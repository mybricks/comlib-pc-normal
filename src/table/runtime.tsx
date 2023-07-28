import React, { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { Table, Empty, ConfigProvider } from 'antd';
import { SorterResult, TableRowSelection } from 'antd/es/table/interface';
import get from 'lodash/get';
import { InputIds, OutputIds, SlotIds, TEMPLATE_RENDER_KEY, DefaultRowKey } from './constants';
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
import ErrorBoundary from './components/ErrorBoundle';
import css from './runtime.less';
import { getColumnsFromSchema } from './editors';
import { setDataSchema } from './schema';

export default function (props: RuntimeParams<Data>) {
  const { env, data, inputs, outputs, slots } = props;
  const { runtime, edit } = env;
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [filterMap, setFilterMap] = useState<any>({});
  const [focusRowIndex, setFocusRowIndex] = useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  // 前端分页后表格数据
  const [pageDataSource, setPageDataSource] = useState<any[]>([]);

  const rowKey = data.rowKey || DefaultRowKey;

  const initFilterMap = () => {
    let res = {};
    data.columns.forEach((cItem) => {
      if (env.runtime && !cItem.dataIndex && cItem.title) {
        cItem.dataIndex = formatColumnItemDataIndex(cItem);
      }
      const dataIndex = Array.isArray(cItem.dataIndex)
        ? cItem.dataIndex.join('.')
        : cItem.dataIndex;
      if (cItem.filter?.enable && cItem.filter?.filterSource !== FilterTypeEnum.Request) {
        res[env.edit ? cItem.key : dataIndex] = cItem.filter.options || [];
      }
    });
    setFilterMap(res);
  };

  useEffect(() => {
    initFilterMap();
    if (runtime) {
      setDataSource(dataSource);
      if (!data.fixedHeader) {
        data.scroll.y = undefined;
      }

      // 设置数据源
      inputs[InputIds.SET_DATA_SOURCE]((ds: any) => {
        setTableData(ds);
        setLoading(false);
      });

      // 表格loading
      inputs[InputIds.START_LOADING](() => {
        setLoading(true);
      });
      inputs[InputIds.END_LOADING](() => {
        setLoading(false);
      });

      // 清空勾选
      inputs[InputIds.CLEAR_ROW_SELECTION](() => {
        setSelectedRowKeys([]);
        setSelectedRows([]);
      });

      // 获取筛选数据
      inputs[InputIds.GET_FILTER] &&
        inputs[InputIds.GET_FILTER]((val, relOutputs) => {
          relOutputs[OutputIds.GET_FILTER](data.filterParams);
        });
      // 设置筛选数据
      inputs[InputIds.SET_FILTER] &&
        inputs[InputIds.SET_FILTER]((val) => {
          data.filterParams = {
            ...data.filterParams,
            ...val
          };
        });

      // 获取排序数据
      inputs[InputIds.GET_SORT] &&
        inputs[InputIds.GET_SORT]((val, relOutputs) => {
          relOutputs[OutputIds.GET_SORT](data.sortParams);
        });
      // 设置排序数据
      inputs[InputIds.SET_SORT] &&
        inputs[InputIds.SET_SORT]((val) => {
          const { order, id } = val || {};
          data.sortParams = {
            order,
            id
          };
        });

      // 动态设置显示列
      if (data.useDynamicColumn && inputs[InputIds.SET_SHOW_COLUMNS]) {
        inputs[InputIds.SET_SHOW_COLUMNS]((ds) => {
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
        });
      }

      // 动态设置表头
      if (data.useDynamicTitle && inputs[InputIds.SET_SHOW_TitleS]) {
        inputs[InputIds.SET_SHOW_TitleS]((val) => {
          data.columns = val;
        });
      }

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
    }
  }, []);

  // 更新某一行数据
  const editTableData = useCallback(
    /**
     *
     * @param param0 { value, index } value 目标值 index 行号
     */
    ({ value, index }) => {
      index = Number(index);
      if (value && index >= 0) {
        setDataSource((prevDataSource) => {
          if (index > prevDataSource.length) return prevDataSource;
          const temp = [...prevDataSource];
          temp[index] = value;
          return temp;
        });
      }
    },
    []
  );

  useEffect(() => {
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
        inputs[InputIds.SET_ROW_SELECTION]((val) => {
          const newSelectedRowKeys: string[] = [];
          const newSelectedRows: any[] = [];
          (Array.isArray(val) ? val : [val]).forEach((selected) => {
            // 目前行rowKey数据
            const targetRowKeyVal = typeof selected === 'object' ? selected?.[rowKey] : selected;
            const tempItem = dataSource.find((item) => targetRowKeyVal === item[rowKey]);
            if (tempItem && !newSelectedRowKeys.includes(targetRowKeyVal)) {
              newSelectedRows.push(tempItem);
              newSelectedRowKeys.push(targetRowKeyVal);
            }
          });
          setSelectedRowKeys(newSelectedRowKeys);
          setSelectedRows(newSelectedRows);
        });
      }
    }
  }, [dataSource, rowKey]);
  useEffect(() => {
    if (env.runtime) {
      // 动态设置筛选数据源
      inputs[InputIds.SET_FILTER_INPUT]((ds) => {
        setFilterMap({
          ...filterMap,
          ...ds
        });
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
        temp = formatDataSource(ds);
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
          temp = formatDataSource(ds?.dataSource);
        } else {
          const arrayItemKey = dsKey.filter((key) => !!Array.isArray(ds[key]));
          if (arrayItemKey.length === 1) {
            temp = formatDataSource(ds?.[arrayItemKey[0]]);
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
      focusRowIndex,
      renderCell: (columnRenderProps) => (
        <ErrorBoundary>
          <ColumnRender {...columnRenderProps} env={env} slots={props.slots} />
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
      if (data.rowSelectionLimit && selectedRowKeys.length > data.rowSelectionLimit) {
        selectedRows = selectedRows.slice(0, data.rowSelectionLimit);
        selectedRowKeys = selectedRowKeys.slice(0, data.rowSelectionLimit);
      }
      setSelectedRows(selectedRows);
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
    }
  };

  // 设计态数据mock
  const defaultDataSource = useMemo(() => {
    return getDefaultDataSource(data.columns);
  }, [data.columns]);

  const onRow = useCallback(
    (record, index) => {
      return {
        onClick: () => {
          if (data.enableRowClick) {
            outputs[OutputIds.ROW_CLICK]({ record, index });
          }
          if (data.enableRowFocus) {
            setFocusRowIndex(index === focusRowIndex ? null : index);
          }
        }
      };
    },
    [focusRowIndex]
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

  // 显示数据
  const realShowDataSource = data.paginationConfig?.useFrontPage ? pageDataSource : dataSource;

  // 当数据发生变化时，重新设置所有行展开
  useEffect(() => {
    if (env.runtime) {
      data.useExpand &&
        data.defaultExpandAllRows &&
        setExpandedRowKeys(realShowDataSource.map((item) => item[rowKey]));
    }
  }, [realShowDataSource, env.runtime, rowKey]);

  return (
    <ConfigProvider locale={zhCN}>
      <div className={css.table}>
        <TableHeader
          env={env}
          data={data}
          slots={slots}
          selectedRows={selectedRows}
          selectedRowKeys={selectedRowKeys}
        />
        {data.columns.length ? (
          <Table
            style={{
              width: data.tableLayout === TableLayoutEnum.FixedWidth ? getUseWidth() : '100%'
            }}
            dataSource={edit ? defaultDataSource : realShowDataSource}
            loading={{
              tip: data.loadingTip,
              spinning: loading
            }}
            onRow={onRow}
            rowKey={rowKey}
            size={data.size as any}
            bordered={data.bordered}
            pagination={false}
            rowSelection={data.useRowSelection ? rowSelection : undefined}
            showHeader={data.showHeader === false && env.runtime ? false : true}
            scroll={{
              x: '100%',
              y: data.scroll.y ? data.scroll.y : void 0
            }}
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
                        inputValues[InputIds.EXP_ROW_VALUES] = get(record, data.expandDataIndex);
                      }
                      return slots[SlotIds.EXPAND_CONTENT].render({
                        inputValues,
                        key: `${InputIds.EXP_COL_VALUES}-${index}`
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
    </ConfigProvider>
  );
}
