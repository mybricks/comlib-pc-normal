import React, { useCallback, useEffect, useMemo, useRef, useState, createContext } from 'react';
import moment from 'moment';
import { Table, Empty, Image, message } from 'antd';
import ConfigProvider from '../components/ConfigProvider';
import { SorterResult, TableRowSelection } from 'antd/es/table/interface';
import get from 'lodash/get';
import {
  InputIds,
  OutputIds,
  SlotIds,
  TEMPLATE_RENDER_KEY,
  DefaultRowKey,
  DefaultOnRowScript
} from './constants';
import zhCN from 'antd/es/locale/zh_CN';

import {
  formatColumnItemDataIndex,
  formatDataSource,
  getColumnsSchema,
  getDefaultDataSource
} from './utils';
import { getTemplateRenderScript } from '../utils/runExpCodeScript';
import {
  ContentTypeEnum,
  Data,
  FilterTypeEnum,
  IColumn,
  RowSelectionTypeEnum,
  SorterTypeEnum,
  TableLayoutEnum,
  WidthTypeEnum
} from './types';
import ColumnRender from './components/ColumnRender';
import ColumnsTitleRender from './components/ColumnsTitleRender';
import TableHeader from './components/TableHeader';
import TableFooter from './components/TableFooter';
import SummaryColumn from './components/SummaryColumn';
import ErrorBoundary from './components/ErrorBoundle';
import css from './runtime.less';
import { unitConversion } from '../utils';
import { runJs } from '../../package/com-utils';
import useParentHeight from './hooks/use-parent-height';
import useElementHeight from './hooks/use-element-height';

export const TableContext = createContext<any>({ slots: {} });

export default function (props: RuntimeParams<Data>) {
  const { env, data, inputs, outputs, slots, style } = props;
  const { runtime, edit } = env;
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const dataSourceRef = useRef(dataSource);
  dataSourceRef.current = dataSource;
  const [filterMap, setFilterMap] = useState<any>({});
  const [focusRowIndex, setFocusRowIndex] = useState<number>(null as any);
  const [focusCellinfo, setFocusCellinfo] = useState<any>(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  // 前端分页后表格数据
  const [pageDataSource, setPageDataSource] = useState<any[]>([]);
  // 显示数据
  const realShowDataSource = data.paginationConfig?.useFrontPage ? pageDataSource : dataSource;
  const [summaryColumnData, setSummaryColumnData] = useState<string>('');

  const rowKey = data.rowKey || DefaultRowKey;

  const ref = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const [parentHeight] = useParentHeight(ref);
  const [headerHeight] = useElementHeight(headerRef);
  const [footerHeight] = useElementHeight(footerRef);

  /** 高度配置为「适应内容」时，表示使用老的高度方案 */
  const isUseOldHeight = style.height === 'auto';

  /** 表格高度，此为新高度方案，替代 fixedHeight */
  const tableHeight = (() => {
    if (isUseOldHeight) return data.fixedHeader ? data.fixedHeight : '';
    const headerPadding = headerHeight === 0 ? 0 : 16;
    const footerPadding = footerHeight === 0 ? 0 : 16;
    return parentHeight - headerHeight - headerPadding - footerHeight - footerPadding;
  })();

  /** 滚动区域高度，此为新高度方案，替代 scrollHeight */
  const scrollHeight = (() => {
    if (isUseOldHeight) return data.scroll.y ? data.scroll.y : void 0;
    // Tip: 这里逻辑和实际消费处匹配，undefined 的结果为 true
    const _showHeader = data.showHeader === false ? false : true;
    return (tableHeight as number) - (_showHeader ? 48 : 0);
  })();

  const selectedRows = useMemo(() => {
    return dataSource.filter((item) => selectedRowKeys.includes(item[rowKey]));
  }, [dataSource, selectedRowKeys, rowKey]);

  const initFilterMap = () => {
    let res = {};
    data.columns.forEach((cItem) => {
      if (env.runtime && !cItem.dataIndex && cItem.title) {
        cItem.dataIndex = formatColumnItemDataIndex(cItem);
      }
      const dataIndex = Array.isArray(cItem.dataIndex)
        ? cItem.dataIndex.join('.')
        : cItem.dataIndex;
      if (!cItem.filter?.enable) {
        res[env.edit ? cItem.key : dataIndex] = null;
      } else if (cItem.filter?.filterSource !== FilterTypeEnum.Request) {
        res[env.edit ? cItem.key : dataIndex] = cItem.filter.options || [];
      } else {
        res[env.edit ? cItem.key : dataIndex] = [];
      }
    });
    setFilterMap(res);
  };

  // IO串行处理
  const handleOutputFn = (relOutputs: { [x: string]: any }, OutputId: string, val: any) => {
    const outputFn = relOutputs?.[OutputId] || outputs[OutputId];
    if (outputFn) {
      outputFn(val);
    }
  };

  useEffect(() => {
    initFilterMap();
    if (runtime) {
      setDataSource(dataSource);
      if (!data.fixedHeader) {
        data.scroll.y = undefined;
      }

      // 设置数据源
      inputs[InputIds.SET_DATA_SOURCE]((ds: any, relOutputs: any) => {
        setTableData(ds);
        setLoading(false);
        handleOutputFn(relOutputs, OutputIds.SET_DATA_SOURCE, ds);
      });

      // 表格loading
      inputs[InputIds.START_LOADING] &&
        inputs[InputIds.START_LOADING]((val: any, relOutputs: any) => {
          setLoading(true);
          handleOutputFn(relOutputs, OutputIds.START_LOADING, val);
        });
      inputs[InputIds.END_LOADING] &&
        inputs[InputIds.END_LOADING]((val: any, relOutputs: any) => {
          setLoading(false);
          handleOutputFn(relOutputs, OutputIds.END_LOADING, val);
        });

      // 清空勾选
      inputs[InputIds.CLEAR_ROW_SELECTION] &&
        inputs[InputIds.CLEAR_ROW_SELECTION]((val: any, relOutputs: any) => {
          setSelectedRowKeys([]);
          handleOutputFn(relOutputs, OutputIds.CLEAR_ROW_SELECTION, val);
        });

      // 获取筛选数据
      inputs[InputIds.GET_FILTER] &&
        inputs[InputIds.GET_FILTER]((val: any, relOutputs: any) => {
          relOutputs[OutputIds.GET_FILTER](data.filterParams);
        });
      // 设置筛选数据
      inputs[InputIds.SET_FILTER] &&
        inputs[InputIds.SET_FILTER]((val: any, relOutputs: any) => {
          data.filterParams = {
            ...data.filterParams,
            ...val
          };
          handleOutputFn(relOutputs, OutputIds.SET_FILTER, data.filterParams);
        });

      // 获取排序数据
      inputs[InputIds.GET_SORT] &&
        inputs[InputIds.GET_SORT]((val: any, relOutputs: any) => {
          relOutputs[OutputIds.GET_SORT](data.sortParams);
        });
      // 设置排序数据
      inputs[InputIds.SET_SORT] &&
        inputs[InputIds.SET_SORT]((val: any, relOutputs: any) => {
          const { order, id } = val || {};
          data.sortParams = {
            order,
            id
          };
          handleOutputFn(relOutputs, OutputIds.SET_SORT, data.sortParams);
        });

      // 设置表格高度
      inputs[InputIds.TABLE_HEIGHT] &&
        inputs[InputIds.TABLE_HEIGHT]((val: any, relOutputs: any) => {
          const { maxScrollHeight, tableHeight } = val || {};
          if (typeof maxScrollHeight !== 'undefined') {
            data.scroll.y = unitConversion(maxScrollHeight);
          }
          if (typeof tableHeight !== 'undefined') {
            if (isUseOldHeight) data.fixedHeight = unitConversion(tableHeight);
          }
          handleOutputFn(relOutputs, OutputIds.TABLE_HEIGHT, val);
        });

      // 总结栏数据
      inputs[InputIds.SUMMARY_COLUMN] &&
        inputs[InputIds.SUMMARY_COLUMN]((val: any, relOutputs: any) => {
          setSummaryColumnData(val);
          handleOutputFn(relOutputs, OutputIds.SUMMARY_COLUMN, val);
        });

      // 动态设置显示列
      if (data.useDynamicColumn && inputs[InputIds.SET_SHOW_COLUMNS]) {
        inputs[InputIds.SET_SHOW_COLUMNS]((ds: any, relOutputs: any) => {
          const showColumnList = ds?.filter?.((item) => item && typeof item === 'string') || [];
          data.columns = (data.columns || []).map((item) => {
            let visible = item.visible;
            const dataIndexStr = Array.isArray(item.dataIndex)
              ? item.dataIndex.join('.')
              : item.dataIndex;
            if (showColumnList && showColumnList.length) {
              visible = showColumnList.includes(dataIndexStr);
            }
            return {
              ...item,
              visible
            };
          });
          handleOutputFn(relOutputs, OutputIds.SET_SHOW_COLUMNS, data.columns);
        });
      }

      // 动态设置表头
      if (data.useDynamicTitle && inputs[InputIds.SET_SHOW_TitleS]) {
        inputs[InputIds.SET_SHOW_TitleS]((val: any, relOutputs: any) => {
          const newCols = val.map((item) => {
            if (item.usePrevious) {
              const previousCol = data.columns.find((i) => i.dataIndex === item.dataIndex) || null;
              return previousCol || item;
            } else {
              return item;
            }
          });
          data.columns = newCols;
          initFilterMap();
          handleOutputFn(relOutputs, OutputIds.SET_SHOW_TitleS, data.columns);
        });
      }
      // 动态修改列
      if (data.enableDynamicChangeCols && inputs[InputIds.CHANGE_COLS_ATTR]) {
        inputs[InputIds.CHANGE_COLS_ATTR]((val: any, relOutputs: any) => {
          const newCols = data.columns.map((item) => {
            const { dataIndex } = item;
            const matchedVal = val.find((v) => v.dataIndex === dataIndex);
            let newItem = { ...item };
            if (matchedVal) {
              newItem = {
                ...newItem,
                ...matchedVal
              };
            }
            return newItem;
          });
          data.columns = newCols;
          initFilterMap();
          handleOutputFn(relOutputs, OutputIds.CHANGE_COLS_ATTR, data.columns);
        });
      }
    }
  }, []);

  useEffect(() => {
    const target = ref.current?.querySelector?.('.ant-table-placeholder') as HTMLSpanElement;

    if (!isUseOldHeight) {
      if (target) target.style.height = '';
      return;
    }

    if (target && data.fixedHeader) {
      target.style.height = typeof data.scroll.y === 'string' ? data.scroll.y : '';
    }
  }, [data.scroll.y, data.fixedHeader]);

  useEffect(() => {
    const target = ref.current?.querySelector?.('div.ant-table-body') as HTMLDivElement;

    if (!isUseOldHeight) {
      if (target) target.style.minHeight = '';
      return;
    }

    if (target && data.fixedHeader && !!data.fixedHeight) {
      target.style.minHeight = typeof data.scroll.y === 'string' ? data.scroll.y : '';
    } else if (target) {
      target.style.minHeight = '';
    }
  }, [isUseOldHeight, data.fixedHeight, data.fixedHeader, data.scroll.y]);

  // 更新某一行数据
  const editTableData = useCallback(
    /**
     *
     * @param param0 { value, index } value 目标值 index 行号
     */
    ({ value, index }) => {
      index = Number(index);
      if (value && index >= 0) {
        if (index > dataSource.length) return dataSource;
        const newDataSource = [...dataSource];
        const tempValue = newDataSource[index];
        newDataSource[index] = {
          ...tempValue, // 需要保留类似rowKey的数据
          ...value
        };
        setDataSource(newDataSource);
      }
    },
    [dataSource]
  );
  useEffect(() => {
    // 监听插槽输出数据
    if (slots) {
      Object.keys(slots).forEach((slot) => {
        const slotOutput = slots[slot]?.outputs[OutputIds.Edit_Table_Data];
        if (slotOutput) {
          slotOutput((val: { value: object; index: number }) => {
            editTableData(val);
          });
        }
      });
    }
  }, [editTableData]);

  useEffect(() => {
    if (!env.runtime || !data.useExpand) return;
    // 开启关闭所有展开项
    inputs[InputIds.EnableAllExpandedRows] &&
      inputs[InputIds.EnableAllExpandedRows]((enable: boolean, relOutputs: any) => {
        setExpandedRowKeys(enable ? realShowDataSource.map((item) => item[rowKey]) : []);
        handleOutputFn(relOutputs, OutputIds.EnableAllExpandedRows, enable);
      });
  }, [realShowDataSource]);

  useEffect(() => {
    dataSourceRef.current = dataSource;

    if (env.runtime) {
      // 输出表格数据
      inputs[InputIds.GET_TABLE_DATA] &&
        inputs[InputIds.GET_TABLE_DATA]((val, relOutputs) => {
          const outputFn =
            relOutputs?.[OutputIds.GET_TABLE_DATA] || outputs[OutputIds.GET_TABLE_DATA];
          if (outputFn) {
            outputFn(dataSource.map(({ [DefaultRowKey]: key, ...res }) => res));
          }
        });
      // 动态设置勾选项
      if (data.useSetSelectedRowKeys) {
        inputs[InputIds.SET_ROW_SELECTION] &&
          inputs[InputIds.SET_ROW_SELECTION]((val: any, relOutputs: any) => {
            // 时机延后，保证同时设置行选中和数据源时能生效
            setTimeout(() => {
              const newSelectedRowKeys: string[] = [];
              const newSelectedRows: any[] = [];
              (Array.isArray(val) ? val : [val]).forEach((selected) => {
                // 目前行rowKey数据
                const targetRowKeyVal =
                  typeof selected === 'object' ? selected?.[rowKey] : selected;
                const tempItem = dataSourceRef.current.find(
                  (item) => targetRowKeyVal === item[rowKey]
                );
                if (tempItem && !newSelectedRowKeys.includes(targetRowKeyVal)) {
                  newSelectedRows.push(tempItem);
                  newSelectedRowKeys.push(targetRowKeyVal);
                }
              });
              setSelectedRowKeys(newSelectedRowKeys);
              if (typeof outputs?.[OutputIds.ROW_SELECTION] === 'function') {
                outputs[OutputIds.ROW_SELECTION]({
                  selectedRows: newSelectedRows,
                  selectedRowKeys: newSelectedRowKeys
                });
              }
              handleOutputFn(relOutputs, OutputIds.SET_ROW_SELECTION, data.filterParams);
            }, 0);
          });
      }
      // 设置选中行序号
      if (data.enableRowFocus) {
        inputs[InputIds.SET_FOCUS_ROW] &&
          inputs[InputIds.SET_FOCUS_ROW]((val: any, relOutputs: any) => {
            if (typeof val !== 'number') {
              message.error(`行序号必须是数字`);
              return;
            }
            setFocusRowIndex(val);
            handleOutputFn(relOutputs, OutputIds.SET_FOCUS_ROW, val);
          }, 0);
      }
    }
  }, [dataSource, rowKey]);
  useEffect(() => {
    if (env.runtime) {
      // 动态设置筛选数据源
      inputs[InputIds.SET_FILTER_INPUT] &&
        inputs[InputIds.SET_FILTER_INPUT]((ds: any, relOutputs: any) => {
          setFilterMap({
            ...filterMap,
            ...ds
          });
          handleOutputFn(relOutputs, OutputIds.SET_FILTER_INPUT, data.filterParams);
        });
    }
  }, [filterMap]);
  useEffect(() => {
    if (env.runtime) {
      // 获取勾选数据
      inputs[InputIds.GET_ROW_SELECTION] &&
        inputs[InputIds.GET_ROW_SELECTION]((val, relOutputs) => {
          relOutputs[OutputIds.GET_ROW_SELECTION]({
            selectedRows,
            selectedRowKeys
          });
        });
    }
  }, [selectedRows, selectedRowKeys]);

  // 前端分页逻辑
  const filterDataSourceBySortAndFilter = () => {
    let tempDataSource = [...dataSource];
    let cItem;
    // 排序
    let sorter;
    const { id, order } = data.sortParams || {};
    cItem = data.columns.find((col) => col.dataIndex === id);
    switch (cItem?.sorter?.type) {
      case SorterTypeEnum.Length:
        sorter = (a, b) => {
          const aVal = get(a, cItem.dataIndex);
          const bVal = get(b, cItem.dataIndex);
          if (typeof aVal !== 'string' || typeof bVal !== 'string') {
            return 0;
          }
          return aVal.length - bVal.length;
        };
        break;
      case SorterTypeEnum.Size:
        sorter = (a, b) => {
          const aVal = get(a, cItem.dataIndex);
          const bVal = get(b, cItem.dataIndex);
          if (typeof aVal !== 'number' || typeof bVal !== 'number') {
            return 0;
          }
          return aVal - bVal;
        };
        break;
      case SorterTypeEnum.Date:
        sorter = (a, b) => {
          const aVal = get(a, cItem.dataIndex);
          const bVal = get(b, cItem.dataIndex);
          if (!aVal || !bVal) {
            return 0;
          }
          return moment(aVal).valueOf() - moment(bVal).valueOf();
        };
        break;
      default:
        break;
    }
    if (sorter) {
      tempDataSource.sort(sorter);
      if (order === 'descend') {
        tempDataSource = tempDataSource.reverse();
      }
    }
    // 筛选
    Object.keys(data.filterParams || {}).forEach((key) => {
      const filterValues = data.filterParams?.[key];
      cItem = data.columns.find((col) => col.dataIndex === key);
      if (cItem && cItem?.filter?.type !== FilterTypeEnum.Request && filterValues) {
        tempDataSource = tempDataSource.filter((record) => {
          return filterValues?.some((value) => get(record, cItem.dataIndex) == value);
        });
      }
    });
    // 分页
    const len = data.paginationConfig.pageSize || data.paginationConfig.defaultPageSize || 1;
    const start = (data.paginationConfig.current - 1) * len;
    const end = start + len;
    data.paginationConfig.total = tempDataSource.length;
    setPageDataSource([...tempDataSource.slice(start, end)]);
  };
  useEffect(() => {
    if (env.runtime && data.paginationConfig.useFrontPage) {
      filterDataSourceBySortAndFilter();
    }
  }, [dataSource, data.paginationConfig.current, data.paginationConfig.pageSize]);

  const setTableData = useCallback(
    (ds: any) => {
      let temp = [...dataSource] || [];
      // 是否后端分页
      const usePagination = !!(data.usePagination && !data.paginationConfig?.useFrontPage);
      if (!usePagination && Array.isArray(ds)) {
        temp = formatDataSource(ds, rowKey);
      } else if (usePagination && ds && typeof ds === 'object') {
        /**
         * 分页特殊处理逻辑
         * 当存在dataSource字段且为数组类型数据时，直接使用
         * 当不存在dataSource字段且仅有一个数组类型数据时，直接使用
         *
         * 当存在total字段且为数字类型数据时，直接使用
         * 当不存在total字段且仅有一个数字类型数据时，直接使用
         */
        const dsKey = Object.keys(ds);
        if (Array.isArray(ds?.dataSource)) {
          temp = formatDataSource(ds?.dataSource, rowKey);
        } else {
          const arrayItemKey = dsKey.filter((key) => !!Array.isArray(ds[key]));
          if (arrayItemKey.length === 1) {
            temp = formatDataSource(ds?.[arrayItemKey[0]], rowKey);
          } else {
            console.error('[数据表格]：未传入列表数据', ds);
          }
        }
        if (typeof ds?.total === 'number') {
          data.paginationConfig.total = ds?.total;
        } else {
          const numberItemKey = dsKey.filter((key) => !!(typeof ds[key] === 'number'));
          if (numberItemKey.length === 1) {
            data.paginationConfig.total = ds?.[numberItemKey[0]];
          }
        }
        if (typeof ds?.pageSize === 'number' && ds?.pageSize > 0) {
          data.paginationConfig.pageSize = ds?.pageSize;
        }
        if (typeof ds?.pageNum === 'number') {
          data.paginationConfig.current = ds?.pageNum;
        }
      } else {
        console.error('[数据表格]：未传入列表数据', ds);
      }
      setDataSource(temp);
    },
    [dataSource]
  );

  const sorterChange = useCallback((sorter: SorterResult<any>) => {
    const { field, order } = sorter || {};
    const sortParams: any = {
      id: Array.isArray(field) ? field.join('.') : field,
      order
    };
    data.sortParams = order ? sortParams : undefined;
    outputs[OutputIds.SORTER]({
      ...sortParams,
      order: order || 'none'
    });
  }, []);

  const filterChange = useCallback((filter: any) => {
    const filterKey = Object.keys(filter);
    const filterParams = {};
    filterKey.forEach((key) => {
      const col = data.columns.find((item) => `${item.dataIndex}` === key);
      if (col) {
        filterParams[Array.isArray(col.dataIndex) ? col.dataIndex.join('.') : col.dataIndex] =
          filter[key];
      }
    });
    data.filterParams = filterParams;
    outputs[OutputIds.FILTER](data.filterParams);
  }, []);

  const onChange = useCallback(
    (pagination, filters, sorter, extra) => {
      if (env.edit) {
        return;
      }
      const useFrontPage = data.paginationConfig?.useFrontPage;
      const { action } = extra;
      switch (action) {
        case 'sort':
          sorterChange(sorter);
          if (useFrontPage) {
            filterDataSourceBySortAndFilter();
          }
          break;
        case 'filter':
          filterChange(filters);
          if (useFrontPage) {
            // 前端分页时，筛选自动回到第一页
            data.paginationConfig.current = 1;
            filterDataSourceBySortAndFilter();
          }
          break;
        default:
          break;
      }
    },
    [dataSource]
  );

  const renderColumns = () => {
    return ColumnsTitleRender({
      ...props,
      filterMap,
      dataSource,
      focusRowIndex,
      setFocusCellinfo,
      focusCellinfo,
      renderCell: (columnRenderProps) => (
        <ErrorBoundary>
          <ColumnRender {...columnRenderProps} env={env} outputs={outputs} />
        </ErrorBoundary>
      )
    });
  };

  // hack: fix编辑时数据未及时响应
  useEffect(() => {
    if (env.edit) {
      initFilterMap();
    }
  }, [JSON.stringify(data.columns)]);
  // const renderColumnsWhenEdit = useCallback(() => {
  //   return renderColumns();
  // }, [env.runtime ? undefined : JSON.stringify({ filterMap, columns: data.columns })]);
  const renderColumnsWhenEdit = renderColumns;

  // 勾选配置
  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    preserveSelectedRowKeys: true,
    onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
      if (
        data.rowMergeConfig &&
        data.mergeCheckboxColumn &&
        data.selectionType === RowSelectionTypeEnum.Checkbox
      ) {
        const { mergeByField } = data.rowMergeConfig || {};
        const result: any[] = [];
        const addedObjects = new Set();

        for (const key of selectedRowKeys) {
          // 找相应uuid数据
          const matchingObject = dataSource.find((obj) => obj[rowKey] === key);
          const matchingObjectIndex = dataSource.findIndex((obj) => obj[rowKey] === key);
          // 去重
          if (matchingObject && !addedObjects.has(matchingObject[rowKey])) {
            if (!matchingObject[mergeByField as string]) {
              // col为undefined 只添加自己
              result.push(matchingObject);
            } else {
              // 是合并行中间项直接跳出 前一项合并标识相同
              if (
                matchingObjectIndex - 1 >= 0 &&
                dataSource[matchingObjectIndex - 1]?.[mergeByField] === matchingObject[mergeByField]
              ) {
                continue;
              }
              const matchingObjects: any[] = [];
              for (let i = matchingObjectIndex; i < dataSource.length; i++) {
                if (dataSource[i]?.[mergeByField] !== matchingObject[mergeByField]) {
                  break;
                }

                matchingObjects.push(dataSource[i]);
              }
              // 反选 取消 不是合并行的第一个就取消
              const isFirst =
                matchingObjects.length > 0 && matchingObjects[0][rowKey] === matchingObject[rowKey];
              if (!isFirst) {
                continue;
              }
              // 添加合并行 col相同项
              matchingObjects.forEach((obj) => {
                if (!addedObjects.has(obj[rowKey])) {
                  result.push(obj);
                  addedObjects.add(obj[rowKey]);
                }
              });
            }

            addedObjects.add(matchingObject[rowKey]);
          }
        }
        selectedRows = result;
        selectedRowKeys = result.map((item) => item[rowKey]);
      }

      if (data.rowSelectionLimit && selectedRowKeys.length > data.rowSelectionLimit) {
        selectedRows = selectedRows.slice(0, data.rowSelectionLimit);
        selectedRowKeys = selectedRowKeys.slice(0, data.rowSelectionLimit);
      }
      setSelectedRowKeys(selectedRowKeys);
      outputs[OutputIds.ROW_SELECTION]({
        selectedRows,
        selectedRowKeys
      });
    },
    type:
      data.selectionType === RowSelectionTypeEnum.Radio
        ? RowSelectionTypeEnum.Radio
        : RowSelectionTypeEnum.Checkbox,
    getCheckboxProps: (record) => {
      if (edit) {
        return { disabled: true } as any;
      }
      const targetRowKeyVal = record[rowKey];
      if (
        data.rowSelectionLimit &&
        data.selectionType === RowSelectionTypeEnum.Checkbox &&
        selectedRowKeys.length >= data.rowSelectionLimit &&
        !selectedRowKeys.includes(targetRowKeyVal)
      ) {
        return { disabled: true };
      }
      let isDisabled;
      try {
        isDisabled = data.isDisabledScript
          ? eval(getTemplateRenderScript(data.isDisabledScript, false, TEMPLATE_RENDER_KEY))(record)
          : false;
      } catch (e) {
        console.error(`禁止勾选的表达式错误`, data.isDisabledScript, e);
      }
      if (isDisabled === true) {
        return { disabled: true };
      }
      return null;
    },
    renderCell: (value: boolean, record: any, index: number, originNode: React.ReactNode) => {
      const getCellConfig = (dataSource: any[], rowIndex: number): number => {
        const { mergeByField } = data.rowMergeConfig || {};
        if (
          !data.enbaleRowMerge ||
          !mergeByField ||
          !dataSource ||
          dataSource.length <= 1 ||
          typeof dataSource[rowIndex]?.[mergeByField] === 'undefined' ||
          !data.mergeCheckboxColumn
        )
          return 1;
        const fieldValues = dataSource.map((item) => item[mergeByField]);

        // 如果跟上一行数据一样，则直接合并
        if (rowIndex !== 0 && fieldValues[rowIndex] === fieldValues[rowIndex - 1]) {
          return 0;
        }

        // 计算连续相同的值的个数
        const calcEqualCount = (list: string | any[], index: number) => {
          if (index === list.length - 1) {
            return 1;
          }
          if (index >= list.length) {
            return 0;
          }
          if (list[index] === list[index + 1]) {
            return 1 + calcEqualCount(list, index + 1);
          }
          return 1;
        };

        return calcEqualCount(fieldValues, rowIndex);
      };
      return {
        props: {
          rowSpan:
            data.mergeCheckboxColumn && data.selectionType === RowSelectionTypeEnum.Checkbox
              ? getCellConfig(dataSource, index)
              : 1 // 合并行
        },
        children: originNode
      };
    }
  };

  // 设计态数据mock
  const defaultDataSource = getDefaultDataSource(data.columns, rowKey, env);

  const setCurrentSelectRows = useCallback(
    (_record) => {
      const targetRowKeyVal = _record[rowKey];
      let newSelectedRows = [...selectedRows];
      let newSelectedRowKeys: any = [];
      // 多选情况下，如果没有超出限制就可以选择
      if (data.selectionType !== RowSelectionTypeEnum.Radio) {
        if (
          !data.rowSelectionLimit ||
          (data.rowSelectionLimit && selectedRowKeys.length < data.rowSelectionLimit) ||
          selectedRowKeys.includes(targetRowKeyVal)
        ) {
          if (newSelectedRows.find((item) => item[rowKey] === targetRowKeyVal)) {
            newSelectedRows = newSelectedRows.filter((item) => item[rowKey] !== targetRowKeyVal);
          } else {
            newSelectedRows.push(_record);
          }
        }
      } else {
        // 单选的情况
        if (selectedRowKeys.includes(_record)) {
          newSelectedRows = [];
        } else {
          newSelectedRows = [_record];
        }
      }
      newSelectedRowKeys = newSelectedRows.map((item) => item[rowKey]);
      setSelectedRowKeys(newSelectedRowKeys);
      outputs[OutputIds.ROW_SELECTION]({
        selectedRows: newSelectedRows,
        selectedRowKeys: newSelectedRowKeys
      });
    },
    [selectedRows, data.rowSelectionLimit, selectedRowKeys]
  );

  const onRow = useCallback(
    (_record, index) => {
      const { [DefaultRowKey]: _, ...record } = _record;
      let props = {};
      if (data?.enableOnRow && !env.edit) {
        if (!data.onRowScript) {
          data.onRowScript = DefaultOnRowScript;
        }
        props = runJs(data?.onRowScript, [_record, index]);
      }

      return {
        onClick: (e) => {
          if (data.useRowSelection && data.enableRowClickSelection && e?.target?.tagName === 'TD') {
            setCurrentSelectRows(_record);
          }
          if (data.enableRowFocus) {
            setFocusRowIndex(index === focusRowIndex ? null : index);
          }
          if (data.enableRowClick) {
            outputs[OutputIds.ROW_CLICK]({ record, index });
          }
        },
        onDoubleClick: () => {
          if (data.enableRowDoubleClick) {
            outputs[OutputIds.ROW_DOUBLE_CLICK]({ record, index });
          }
          if (data.enableRowFocus) {
            setFocusRowIndex(index === focusRowIndex ? null : index);
          }
        },
        ...props
      };
    },
    [focusRowIndex, setCurrentSelectRows]
  );

  // 获取表格显示列宽度和
  const getUseWidth = () => {
    let hasAuto, width;
    const getWidth = (list: IColumn[]) => {
      let count = 0;
      list.forEach((item) => {
        if (!item.visible || hasAuto) {
          return;
        }
        if (item.width === WidthTypeEnum.Auto && item.contentType !== ContentTypeEnum.Group) {
          hasAuto = true;
          return;
        }
        if (item.contentType === ContentTypeEnum.Group && item.children?.length) {
          count = count + getWidth(item.children);
        } else {
          count = count + (+(item.width || 0) || 0);
        }
      });
      return count;
    };
    width = getWidth(data.columns);
    // 当任意列为自适应时，宽度为100%
    return hasAuto ? '100%' : width;
  };

  // 当数据发生变化时，重新设置所有行展开
  useEffect(() => {
    if (env.runtime) {
      data.useExpand &&
        data.defaultExpandAllRows &&
        setExpandedRowKeys(realShowDataSource.map((item) => item[rowKey]));
    }
  }, [realShowDataSource, env.runtime, rowKey]);

  const contextValue = useMemo(() => {
    return {
      slots
    };
  }, [slots]);

  const customizeRenderEmpty = () => (
    <div
      className={css.emptyNormal}
      style={{
        height: data.fixedHeader ? `calc(${data.fixedHeight} - 144px` : ''
      }}
    >
      <Image src={data.image} className={`emptyImage ${css.emptyImage}`} preview={false} />
      <p className={`emptyDescription ${css.emptyDescription}`}>{env.i18n(data.description)}</p>
    </div>
  );

  return (
    <div ref={ref}>
      <ConfigProvider
        locale={env.vars?.locale}
        renderEmpty={data.isEmpty ? customizeRenderEmpty : void 0}
      >
        <TableContext.Provider value={contextValue}>
          <div className={css.table}>
            <TableHeader
              headerRef={headerRef}
              env={env}
              data={data}
              dataSource={dataSource}
              slots={slots}
              outputs={outputs}
              selectedRows={selectedRows}
              selectedRowKeys={selectedRowKeys}
            />
            {data.columns.length ? (
              <Table
                style={{
                  width: data.tableLayout === TableLayoutEnum.FixedWidth ? getUseWidth() : '100%',
                  height: tableHeight
                }}
                dataSource={edit ? defaultDataSource : realShowDataSource}
                loading={{
                  tip: env.i18n(data.loadingTip),
                  spinning: loading
                }}
                onRow={onRow}
                rowKey={rowKey}
                size={data.size as any}
                bordered={data.bordered}
                pagination={false}
                rowSelection={data.useRowSelection ? rowSelection : undefined}
                showHeader={data.showHeader === false && env.runtime ? false : true}
                rowClassName={(_, index) => {
                  if (data.enableStripe) {
                    return (index + 1) % 2 === 0
                      ? 'mybricks-table-row-double'
                      : 'mybricks-table-row-single';
                  }
                  return '';
                }}
                scroll={{
                  x: '100%',
                  y: scrollHeight
                }}
                summary={
                  data.useSummaryColumn
                    ? () => SummaryColumn(slots, data, summaryColumnData)
                    : void 0
                }
                expandable={
                  data.useExpand && slots[SlotIds.EXPAND_CONTENT]
                    ? {
                        expandedRowRender: (record, index) => {
                          const inputValues = {
                            [InputIds.EXP_COL_VALUES]: {
                              ...record
                            },
                            [InputIds.INDEX]: index
                          };
                          if (data.useExpand && data.expandDataIndex) {
                            inputValues[InputIds.EXP_ROW_VALUES] = get(
                              record,
                              data.expandDataIndex
                            );
                          }
                          return slots[SlotIds.EXPAND_CONTENT].render({
                            inputValues,
                            key: `${InputIds.EXP_COL_VALUES}-${record[rowKey]}`
                          });
                        },
                        expandedRowKeys: edit ? [defaultDataSource[0][rowKey]] : expandedRowKeys, //增加动态设置
                        onExpand: (expanded, record) => {
                          if (!env.runtime) return;
                          const key = record[rowKey];
                          if (expanded && !expandedRowKeys.includes(key)) {
                            setExpandedRowKeys([...expandedRowKeys, key]);
                          } else if (!expanded && expandedRowKeys.includes(key)) {
                            expandedRowKeys.splice(expandedRowKeys.indexOf(key), 1);
                            setExpandedRowKeys([...expandedRowKeys]);
                          }
                        }
                      }
                    : undefined
                }
                onChange={onChange}
                tableLayout={
                  (data.tableLayout === TableLayoutEnum.FixedWidth
                    ? TableLayoutEnum.Fixed
                    : data.tableLayout) || TableLayoutEnum.Fixed
                }
              >
                {env.runtime ? renderColumns() : renderColumnsWhenEdit()}
              </Table>
            ) : (
              <Empty description="请添加列或连接数据源" className={css.emptyWrap} />
            )}
            <TableFooter
              footerRef={footerRef}
              env={env}
              parentSlot={props.parentSlot}
              data={data}
              slots={slots}
              inputs={inputs}
              outputs={outputs}
              selectedRows={selectedRows}
              selectedRowKeys={selectedRowKeys}
            />
          </div>
        </TableContext.Provider>
      </ConfigProvider>
    </div>
  );
}
