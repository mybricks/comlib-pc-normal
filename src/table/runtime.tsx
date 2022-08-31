import React, { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import classnames from 'classnames';
import { runJs } from '@fangzhou/com-utils';
import { Table, Tooltip, Pagination, Empty } from 'antd';
import { TablePaginationConfig } from 'antd/es/table';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import { arrayMoveImmutable } from 'array-move';
import { useObservable } from '@mybricks/rxui';
import {
  TableCurrentDataSource,
  SorterResult,
  TableRowSelection,
} from 'antd/es/table/interface';
import { getPageInfo, flat, unFlat } from './utils';
import { typeCheck, uuid } from '../utils';
import { setPath } from '../utils/path';
import { getTemplateRenderScript } from '../utils/runExpCodeScript';
import { RowSelectionPostion, InputIds, OutputIds, SlotIds, TEMPLATE_RENDER_KEY } from './constants';
import { Data, ResponseData, IColumn } from './types';
import ColumnRender from './components/ColumnRender';
import ActionBtns from './components/ActionBtns';
import FilterColumnRender from './components/FilterColumn/index'
import ColumnsTitleRender from './components/ColumnsTitleRender';
import css from './runtime.less';

interface Loading {
  spinning: boolean;
  tip: string;
}
export class TableContent {
  data: Data;
  env: any;
  outputs: any;
  dataSource: any[];
  loading: Loading;
  filterMap: any;
}

export default function (props: RuntimeParams<Data>) {
  const { env, data, inputs, outputs, slots } = props;
  const { runtime, edit } = env;
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [dynamicColumn, setDynamicColumn] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const tableContent: TableContent = useObservable(TableContent, (next) =>
    next({
      data,
      env,
      outputs,
      dataSource: [],
      filterMap: {},
    })
  );

  if (data.hasPagination && data.showPaginationTotal) {
    // showTotal为fn，无法放入json。这个其实是数据的一部分
    data.pagination.showTotal = (total: number) =>
      env.i18n({ text: '共 ${total} 条', params: { total } });
  } else {
    delete data.pagination.showTotal;
  }

  const DragHandle = SortableHandle(() => (
    <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />
  ));

  useEffect(() => {
    // 编辑模式下，禁用分页点击
    data.pagination.disabled = !!edit;

    if (runtime) {
      tableContent.dataSource = [];
      if (data.hasPagination) {
        data.pagination.total = 0;
      }
      if (!data.fixedHeader) {
        data.scroll.y = undefined;
      }

      data.useSlotProps &&
        inputs[InputIds.SLOT_PROPS] &&
        inputs[InputIds.SLOT_PROPS]((ds: any) => {
          setTableData(data, ds);
          setLoading(false);
        });
      inputs[InputIds.SET_DATA_SOURCE]((ds: any) => {
        setTableData(data, ds);
        setLoading(false);
      });

      inputs[InputIds.END_LOADING](() => {
        setLoading(false);
      });

      inputs[InputIds.CLEAR_ROW_SELECTION](() => {
        setSelectedRowKeys([]);
        setSelectedRows([]);
      });

      inputs[InputIds.SET_FILTER_INPUT]((ds) => {
        Object.assign(tableContent.filterMap, ds);
        // setFilterMap((prev) => ({...prev, ds}))
      });
      inputs[InputIds.REFRESH]((ds: any) => {
        if (data.jumpToFirstPageWhenRefresh) {
          onRefreshTable({
            ...ds,
            [data.pageNumber || 'current']: 1,
          });
        } else {
          onRefreshTable(ds);
        }
      });

      // 输出表格数据
      data.outputTableData && inputs[InputIds.GET_TABLE_DATA] &&
        inputs[InputIds.GET_TABLE_DATA]((val, relOutputs) => {
          const outputFn =
            relOutputs?.[OutputIds.GET_TABLE_DATA] ||
            outputs[OutputIds.GET_TABLE_DATA];
          if (outputFn) {
            outputFn(tableContent.dataSource);
          }
        });

      // 提交行为-输出表格数据
      (data.submitActions || []).forEach((item) => {
        inputs[item.id] &&
          inputs[item.id]((val, relOutputs) => {
            const outputFn = relOutputs?.[item.id] || outputs[item.id];
            if (outputFn) {
              outputFn(tableContent.dataSource);
            }
          });
      });

      // 更新行数据
      inputs[InputIds.UPDATE_COLUMN_DATA] &&
        inputs[InputIds.UPDATE_COLUMN_DATA]((ds: any) => {
          const oldDataSource = tableContent.dataSource;
          const { rowKey, use } =
            tableContent.data.columnDataUpdateConfig || {};
          if (!(use && rowKey && ds)) {
            return;
          }
          const newDataSource = oldDataSource.map((oldItem) => {
            let newItem;
            if (Array.isArray(ds)) {
              newItem = ds.find(
                (temp) => temp && temp[rowKey] === oldItem[rowKey]
              );
            } else if (ds[rowKey] && ds[rowKey] === oldItem[rowKey]) {
              newItem = ds;
            }
            return newItem
              ? {
                uuid: uuid(),
                ...newItem,
              }
              : oldItem;
          });
          tableContent.dataSource = newDataSource.map((item, index) => ({
            ...item,
            index: item.id,
          }));
        });

      // 动态设置勾选项
      if (data.useSetSelectedRowKeys) {
        inputs[InputIds.SET_ROW_SELECTION]((val) => {
          const newSelectedRowKeys = [];
          const newSelectedRows = [];
          (Array.isArray(val) ? val : [val]).forEach((selected) => {
            const rowKey =
              typeof selected === 'object' ? selected?.[data.rowKey] : selected;
            const tempItem = tableContent.dataSource.find(
              (item) => rowKey === item[data.rowKey]
            );
            if (tempItem && !newSelectedRowKeys.includes(rowKey)) {
              newSelectedRows.push(tempItem);
              newSelectedRowKeys.push(rowKey);
            }
          });
          if (newSelectedRowKeys.length > 0) {
            setSelectedRowKeys(newSelectedRowKeys);
            setSelectedRows(newSelectedRows);
          }
        });
      }

      // 设置动态显示列
      if (data.useDynamicColumn && inputs[InputIds.SET_DYNAMIC_COL]) {
        inputs[InputIds.SET_DYNAMIC_COL]((ds) => {
          if (Array.isArray(ds)) {
            setDynamicColumn(ds.filter((item) => !!item.dataIndex));
          } else {
            setDynamicColumn([]);
          }
        });
      }
      // 设置表格标题
      if (
        data.useDynamicTableTitle &&
        inputs[InputIds.SET_DYNAMIC_TABLE_TITLE]
      ) {
        inputs[InputIds.SET_DYNAMIC_TABLE_TITLE]((val) => {
          if (typeof val === 'string') {
            data.tableTitle = val;
          }
        });
      }

      inputs[InputIds.SET_PAGINATION] &&
        inputs[InputIds.SET_PAGINATION]((ds, relOutputs) => {
        if (ds?.[data.pageNumber] !== undefined && typeof ds?.[data.pageNumber] === 'number') {
          data.pagination.current = ds[data.pageNumber];
        }
        if (ds?.[data.pageSize] !== undefined && typeof ds?.[data.pageSize] === 'number') {
          data.pagination.pageSize = ds[data.pageSize];
        }
        relOutputs[OutputIds.SET_PAGINATION]();
      })
    }
  }, []);

  // 表格刷新前 数据聚合
  const onRefreshTable = useCallback((ds?: any) => {
    if (!!edit) {
      return;
    }
    const pageInfo = getPageInfo(data);
    if (Object.prototype.toString.call(ds) !== '[object Object]') {
      ds = {};
    }

    if (data.hasPagination && ds[data.pageNumber]) {
      data.pagination.current = ds[data.pageNumber];
    }

    let submitValue = {
      ...data.queryParams,
      ...pageInfo,
      ...ds,
    };
    if (data.cleanQueryParamsWhenRefresh) {
      submitValue = {
        ...pageInfo,
        ...ds,
      };
    }

    data.queryParams = { ...submitValue };

    if (data.hasPagination) {
      if (submitValue.current) {
        data.pagination.current = ~~submitValue.current;
      }
      if (submitValue.pageSize) {
        data.pagination.pageSize = ~~submitValue.pageSize;
      }
    }

    if (data.sortParams && !submitValue.sortParams) {
      submitValue.sortParams = { ...data.sortParams };
    }
    if (data.filterParams && !submitValue.filterParams) {
      submitValue.filterParams = Object.keys(data.filterParams).reduce(
        (pre, curr) => {
          const val = data.filterParams[curr];
          return val !== null ? { ...pre, [curr]: val } : { ...pre };
        },
        {}
      );
    }
    submitPropsMethod(submitValue);
  }, []);

  const submitPropsMethod = (props) => {
    if (data.useLoading) {
      setLoading(true);
    }

    outputs[OutputIds.ClickPagination](props);
  };

  if (env.runtime) {
    inputs[InputIds.GET_ROW_SELECTION] &&
      inputs[InputIds.GET_ROW_SELECTION]((val, relOutputs) => {
        const outputFn =
          relOutputs?.[OutputIds.GET_ROW_SELECTION] ||
          outputs[OutputIds.GET_ROW_SELECTION];
        if (outputFn) {
          outputFn({
            selectedRows,
            selectedRowKeys,
          });
        }
      });
    // 设置展开行
    if (data.useExpand && inputs[InputIds.SET_EXPANDED_KEYS]) {
      inputs[InputIds.SET_EXPANDED_KEYS](ds => {
        let newKeys: string[],
          isExpanded = false;
        if (typeof ds === 'string') {
          newKeys = [ds];
          isExpanded = expandedRowKeys.includes(ds);
        }
        if (typeCheck(ds, 'OBJECT') && ds['uuid']) {
          newKeys = [ds['uuid']];
          isExpanded = expandedRowKeys.includes(ds['uuid']);
        }
        if (typeCheck(ds, 'Array')) {
          newKeys = ds.filter(item => typeof item === 'string');
          isExpanded = newKeys.every(key => expandedRowKeys.includes(key));
        }
        if (newKeys) {
          setExpandedRowKeys(isExpanded ?
            [...expandedRowKeys]
              .filter(key => !newKeys.includes(key))
            :
            [...expandedRowKeys, ...newKeys]
              .filter((item, i, self) => item && self.indexOf(item) === i)
          );
        }
      });
    }

    inputs[InputIds.PAGINATION](() => {
      outputs['pagination']({
        [data.pageNumber || 'current']:  data.pagination.current,
        [data.pageSize || 'pageSize']:  data.pagination.pageSize
      })
    })
  }

  const initDataSource = (dataSource) => {
    return dataSource.map(({ children, ...rest }) => {
      if (children && children.length) {
        return {
          uuid: uuid(),
          children: initDataSource(children),
          ...rest,
        };
      } else {
        return {
          uuid: uuid(),
          ...rest,
        };
      }
    });
  };

  const setTableData = useCallback((data: Data, ds: ResponseData) => {
    if (data.onLoadData) {
      try {
        data.columns.forEach(
          (item) =>
          ((data.columns as any)[item.dataIndex ? `${item.dataIndex}` : ''] =
            item)
        );
        runJs(data.onLoadData, [data, { ...env, utils: { moment } }], { env });
      } catch (error) {
        console.error(error);
      }
    }
    ds = Array.isArray(ds) ? { dataSource: ds } : ds;
    const { total, dataSource, extraColumns, queryParams } = ds || {};
    if (queryParams) {
      Object.assign(data.queryParams, queryParams);
    }
    data.extraColumns = extraColumns || data.extraColumns;
    if (dataSource) {
      tableContent.dataSource = initDataSource(dataSource);
    } else {
      tableContent.dataSource = tableContent.dataSource || [];
    }
    // tableContent.dataSource = dataSource || []
    if (data.pagination && total !== undefined) {
      data.pagination.total = total || 0;
    }
  }, []);

  const paginationChange = useCallback((pagination: TablePaginationConfig) => {
    const { current, pageSize } = pagination;
    if (data.hasPagination) {
      data.pagination.current = current || 1;
      data.pagination.pageSize = pageSize || 20;

      // if (data.queryParams[data.pageNumber]) {
      //   delete data.queryParams[data.pageNumber];
      // }
      // if (data.queryParams[data.pageSize]) {
      //   delete data.queryParams[data.pageSize];
      // }

      const submitValue = {
        ...data.queryParams,
        [data.pageNumber || 'current']: current,
        [data.pageSize || 'pageSize']: pageSize,
      };
      if (data.sortParams && !submitValue.sortParams) {
        submitValue.sortParams = { ...data.sortParams };
      }
      if (data.filterParams && !submitValue.filterParams) {
        submitValue.filterParams = Object.keys(data.filterParams).reduce(
          (pre, curr) => {
            const val = data.filterParams[curr];
            return val !== null ? { ...pre, [curr]: val } : { ...pre };
          },
          {}
        );
      }
      submitPropsMethod(submitValue);
    }
  }, []);

  const sorterChange = useCallback((sorter: SorterResult<any>) => {
    const { field, order, column } = sorter || {};
    if (column?.sorter === true) {
      data.sortParams = {
        order,
        field,
      };
      if (data.jumpToFirstPageWhenRefresh) {
        onRefreshTable({
          ...data.queryParams,
          [data.pageNumber || 'current']: 1,
        });
      } else {
        onRefreshTable(data.queryParams);
      }
    } else {
      data.sortParams = undefined;
    }
  }, []);

  const filterChange = useCallback((filter: any) => {
    const filterKey = Object.keys(filter);
    const enaleObj = data.columns.reduce((pre, curr) => {
      if (curr.filter) {
        return {
          ...pre,
          [`${curr.dataIndex}`]: curr.filter,
        };
      }
      return pre;
    }, {});
    if (
      filterKey.some(
        (i) =>
          enaleObj[i] && enaleObj[i].enable && enaleObj[i].type === 'request'
      )
    ) {
      data.filterParams = filter;
      if (data.jumpToFirstPageWhenRefresh) {
        onRefreshTable({
          ...data.queryParams,
          [data.pageNumber || 'current']: 1,
        });
      } else {
        onRefreshTable(data.queryParams);
      }
    }
  }, []);

  const onChange = useCallback(
    (
      pagination: TablePaginationConfig,
      filters,
      sorter: SorterResult<any>,
      extra: TableCurrentDataSource<any[]>
    ) => {
      if (env.edit) {
        return;
      }
      const { action } = extra;
      if (action === 'paginate') {
        paginationChange(pagination);
      } else if (action === 'sort') {
        sorterChange(sorter);
      } else if (action === 'filter') {
        filterChange(filters);
      }
    },
    []
  );

  // hack i18n翻译
  const formatI18nNumWithJSX = (
    i18nStr: string,
    dots: string[],
    jsxFns: ((str: any) => any)[]
  ) => {
    let isUseJSXFn = false;
    if (!dots.length || !jsxFns.length) {
      return i18nStr;
    }
    const [dot, ...restDots] = dots;
    const [jsxFn, ...restFns] = jsxFns;
    if (dot === '') {
      return formatI18nNumWithJSX(i18nStr, restDots, restFns);
    }
    const list = i18nStr.split(dot);
    return list.map((str, idx) => {
      if (idx === 0) {
        return formatI18nNumWithJSX(str, restDots, restFns);
      }
      const node = (
        <>
          {isUseJSXFn
            ? dot
            : jsxFn(formatI18nNumWithJSX(dot, restDots, restFns))}
          {formatI18nNumWithJSX(str, restDots, restFns)}
        </>
      );
      isUseJSXFn = true;
      return node;
    });
  };
  const formatActionBtn = (btns: any[]) => {
    return (btns || []).map((item) => {
      const { popConfig } = item || {};
      return {
        ...(item || {}),
        title: env.i18n(item?.title),
        popConfig: {
          ...(popConfig || {}),
          popTitle: env.i18n(popConfig?.popTitle),
          popContent: env.i18n(popConfig?.popContent),
          popOkText: env.i18n(popConfig?.popOkText),
          popCancelText: env.i18n(popConfig?.popCancelText),
        },
      };
    });
  };
  const formatColumnItem = (columnItem: IColumn) => {
    const actionBtns = [...(columnItem.actionBtns || [])];
    const mappingEnum = {
      ...(columnItem.mappingEnum || {}),
    };
    const colorEnum = { ...(columnItem.colorEnum || {}) };
    const tagEnum = { ...(columnItem.tagEnum || {}) };
    Object.keys(mappingEnum).forEach((key) => {
      mappingEnum[key] = env.i18n(mappingEnum[key]);
      mappingEnum[env.i18n(key)] = env.i18n(mappingEnum[key]);
    });
    Object.keys(colorEnum).forEach((key) => {
      colorEnum[env.i18n(key)] = colorEnum[key];
    });
    Object.keys(tagEnum).forEach((key) => {
      tagEnum[env.i18n(key)] = tagEnum[key];
    });
    return {
      ...columnItem,
      mappingEnum,
      colorEnum,
      tagEnum,
      actionBtns: formatActionBtn(actionBtns),
    };
  };
  const renderCell = useCallback(
    (
      columnItem: IColumn,
      value: any,
      record: any,
      index: number,
      colIndex: number,
      slots: any,
      outputs: any,
      data: any
    ) => {
      // const content = formatContent({ columnItem: {...columnItem}, value, record, index, colIndex });
      const columnRenderProps = {
        tableContent,
        columnItem: formatColumnItem(columnItem),
        value,
        record,
        index,
        colIndex,
        env,
        slots,
        outputs,
        data,
      };

      const columnView = <ColumnRender {...columnRenderProps} />;
      // Todo 大数据量 性能问题
      if (columnItem.useTooltip) {
        let title = value;
        if (columnItem.contentType === 'date' && value !== undefined) {
          const formatter = env.i18n(
            columnItem?.dateConfig?.formatter || 'Y-MM-DD'
          );
          title = moment(value).isValid()
            ? moment(value).format(formatter)
            : moment(parseInt(value)).format(formatter);
        }
        return (
          <Tooltip
            placement="topLeft"
            title={
              columnItem.tooltipKey
                ? `${record[columnItem.tooltipKey]}`
                : `${title}`
            }
            overlayClassName={css.ellipsisTooltip}
          // 挂载到table上
          // getTooltipContainer={(node) => {
          //   return getParentNodeByTag(node, 'table');
          // }}
          >
            <span>{columnView}</span>
          </Tooltip>
        );
      }
      return columnView;
    },
    [data.isEditing]
  );

  const renderColumns = () => {
    return ColumnsTitleRender({
      ...props,
      dynamicColumn,
      tableContent,
      renderCell
    })
  };
  // hack: fix编辑时数据未及时响应
  const renderColumnsWhenEdit = useCallback(() => {
    return renderColumns();
  }, [env.runtime ? undefined : JSON.stringify(data.columns)]);

  // 顶部显示批量操作按钮
  const useTopRowSelection =
    data.useRowSelection &&
    data.selectionType !== 'radio' &&
    (data.rowSelectionPostion || []).includes(RowSelectionPostion.TOP);
  // 底部显示批量操作按钮
  const useBottomRowSelection =
    data.useRowSelection &&
    data.selectionType !== 'radio' &&
    (data.rowSelectionPostion || []).includes(RowSelectionPostion.BOTTOM);
  // 批量操作按钮渲染
  const RenderBatchBtns = () => {
    if (
      !(data.useRowSelection && data.batchBtns && data.batchBtns.length) ||
      data.selectionType === 'radio'
    ) {
      return;
    }
    return (
      <div className={css.width100} data-table-batch-action>
        <div className={css.flex}>
          <div className={css.selectedWrap}>
            <ActionBtns
              colIndex={-1}
              actionBtns={formatActionBtn(data.batchBtns)}
              record={{
                selectedRows,
                selectedRowKeys,
              }}
              btnWrapDataSetKey={false}
              btnDataSetKey="table-batch-btn"
              tableContent={tableContent}
            />
            <div className={css.selectedInfo}>
              {formatI18nNumWithJSX(
                env.i18n({
                  text: '已选中${selected}${limit}项',
                  params: {
                    selected: selectedRowKeys.length,
                    limit: data.rowSelectionLimit
                      ? `/${data.rowSelectionLimit}`
                      : '',
                  },
                }),
                [
                  `${selectedRowKeys.length}`,
                  data.rowSelectionLimit ? `/${data.rowSelectionLimit}` : '',
                ],
                [
                  (str) => (
                    <span
                      className={css.blue}
                      style={{
                        marginLeft: 2,
                        marginRight: data.rowSelectionLimit ? 0 : 2,
                      }}
                    >
                      {str}
                    </span>
                  ),
                  (str) => <span style={{ marginLeft: 2 }}>{str}</span>,
                ]
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 表格头部按钮渲染
  const renderTableBtns = () => {
    if (!(data.useActionBtns && data.actionBtns && data.actionBtns.length)) {
      return;
    }
    return (
      <div data-table-header-action>
        <ActionBtns
          colIndex={-1}
          actionBtns={formatActionBtn(data.actionBtns)}
          record={{
            queryParams: data.queryParams,
            dataSource: tableContent.dataSource,
            pagination: data.pagination,
          }}
          btnWrapDataSetKey={false}
          btnDataSetKey="table-header-btn"
          tableContent={tableContent}
        />
      </div>
    );
  };

  // 表格标题渲染
  const renderTableTitle = () => {
    if (!data.useTableTitle) {
      return;
    }
    return (
      <div
        data-table-header-title
        className={classnames(
          css.width100,
          css.title,
          data.useRowSelection &&
          (data.rowSelectionPostion || []).includes(
            RowSelectionPostion.TOP
          ) &&
          css.marginBottom
        )}
        style={data.tableTitleStyle}
        key="table-header-title"
      >
        {env.i18n(data.tableTitle)}
        {data.useTableTitleWithCount && (
          <span className={css.totalTipWrap}>
            {formatI18nNumWithJSX(
              env.i18n({
                text: '（共${total}条）',
                params: { total: data.pagination.total },
              }),
              [`${data.pagination.total}`],
              [(str) => <span className={css.blue}>{str}</span>]
            )}
          </span>
        )}
      </div>
    );
  };

  // 勾选配置
  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    preserveSelectedRowKeys: true,
    onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
      if (
        data.rowSelectionLimit &&
        selectedRowKeys.length > data.rowSelectionLimit
      ) {
        selectedRows = selectedRows.slice(0, data.rowSelectionLimit);
        selectedRowKeys = selectedRowKeys.slice(0, data.rowSelectionLimit);
      }
      setSelectedRows(selectedRows);
      setSelectedRowKeys(selectedRowKeys);
      if (!data.unAutoSelect) {
        outputs['rowSelection']({
          selectedRows,
          selectedRowKeys,
        });
      }
    },
    type: data.selectionType === 'radio' ? 'radio' : 'checkbox',
    getCheckboxProps: (record) => {
      if (edit) {
        return { disabled: true };
      }
      const rowKey = record[data.rowKey];
      if (
        data.rowSelectionLimit &&
        selectedRowKeys.length >= data.rowSelectionLimit &&
        !selectedRowKeys.includes(rowKey)
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
  };

  // 支持拖拽
  const SortableItem = SortableElement((props) => <tr {...props} />);
  const SortableContainerNew = SortableContainer((props) => (
    <tbody {...props} />
  ));

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const { dataSource } = tableContent;
    const flatDataSource = flat(dataSource);
    if (oldIndex !== newIndex) {
      const newFlatDataSource = arrayMoveImmutable(
        [].concat(flatDataSource),
        oldIndex,
        newIndex
      ).filter((el) => !!el);
      const newDataSource = unFlat(newFlatDataSource);
      tableContent.dataSource = newDataSource;
      const { parent, ...current } = newFlatDataSource[newIndex];
      const index = newDataSource.findIndex((ele) => {
        return ele.uuid === parent || (!parent && current.uuid === ele.uuid);
      });
      if (data.useDrapItem) {
        outputs[OutputIds.DRAG_FINISH]({
          data: newDataSource,
          index,
          current,
          pagination: data.pagination,
        });
      } else {
        outputs[OutputIds.DRAG_FINISH](newDataSource);
      }
    }
  };

  const DraggableContainer = (props) => (
    <SortableContainerNew
      // useDragHandle
      distance={2}
      disableAutoscroll
      helperClass={css.rowDragging}
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const getIndex = (dataSource, restProps) => {
    return flat(dataSource).findIndex(({ uuid }) => {
      return uuid === restProps['data-row-key'];
    });
  };

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { dataSource } = tableContent;

    // function findIndex base on Table rowKey props and should always be a right array index
    // const index = dataSource.findIndex((x) => {
    //   return x.uuid === restProps["data-row-key"];
    // });

    const index = getIndex(dataSource, restProps);
    return <SortableItem index={index} {...restProps} />;
  };
  // 是否显示分页 总数为0时不显示分页
  const isShowPagination = !!(data.hasPagination && data.pagination.total);
  // 设计态数据mock
  const mockData = useMemo(() => {
    return {
      uuid: uuid(),
      guid: 0,
    };
  }, []);
  const defaultDataSource = useMemo(() => {
    const setDefaultDataSource = (columns) => {
      if (Array.isArray(columns)) {
        columns.forEach((item) => {
          let defaultValue: any = `${item.title}1`;
          if (item.contentType === 'date') {
            defaultValue = moment().toString();
          }
          if (item.contentType === 'group') {
            setDefaultDataSource(item.children);
            return;
          }
          if (Array.isArray(item.key)) {
            setPath(mockData, item.key, defaultValue, false);
          } else {
            mockData[item.key] = defaultValue;
          }
        });
      }
    }
    setDefaultDataSource(data.columns);
    return [mockData];
  }, [data.columns]);

  return (
    <div className={css.table}>
      <div
        data-table-header-container
        className={classnames(
          css.headerContainer,
          useTopRowSelection && css.flexDirectionColumn,
          (useTopRowSelection || data.useTableTitle || data.useActionBtns || data.useColumnSetting) &&
          css.marginBottom
        )}
      // style={data.tableTitleContainerStyle}
      >
        {renderTableTitle()}
        {(useTopRowSelection || (data.useActionBtns && data.actionBtns) || data.useColumnSetting) && (
          <div className={classnames(css.actionBtnsWrap, css.width100)}>
            {/* 渲染顶部操作按钮 */}
            <div data-table-header-topRowSelection>
              {useTopRowSelection && RenderBatchBtns()}
            </div>
            <div className={classnames(css.width100, css.flex, css.flexRowReverse)}>
              {/* 渲染工作区tools */}
              <div data-table-header-tools>
                <FilterColumnRender data={data} />
              </div>
              {/* 渲染操作按钮 */}
              <div data-table-header-tablebtns>
                {renderTableBtns()}
              </div>
            </div>
          </div>
        )}
      </div>
      {data.useHeaderSlot && slots[data.headerSlotId].render()}
      {/* {data.useRowSelection && renderSelectActions()} */}
      {data.columns.length ? (
        <Table
          dataSource={edit ? defaultDataSource : tableContent.dataSource}
          loading={{
            tip: data.loadingTip,
            spinning: loading
          }}
          rowKey={data.rowKey || 'uuid'}
          size={data.size as any}
          bordered={data.bordered}
          pagination={false}
          // pagination={data.hasPagination && (data.pagination as any)}
          rowSelection={data.useRowSelection && rowSelection}
          showHeader={data.showHeader === false && env.runtime ? false : true}
          scroll={{
            x: '100%',
            y: data.scroll.y ? data.scroll.y : void 0
          }}
          onRow={data.onRow}
          expandable={
            data.useExpand && slots[SlotIds.EXPAND_CONTENT]
              ? {
                  expandedRowKeys: edit ? [defaultDataSource[0].uuid] : expandedRowKeys, //增加动态设置
                  expandedRowRender: (record) => {
                    return slots[SlotIds.EXPAND_CONTENT].render({
                      inputs: {
                        slotProps(fn) {
                          fn(record);
                        }
                      }
                    });
                  },
                  // 兼容展开/收起图标控制
                  onExpand: (isExpanded, record) => {
                    const currentKey = record['uuid'];
                    if (isExpanded) {
                      setExpandedRowKeys([...expandedRowKeys, currentKey]);
                    } else {
                      setExpandedRowKeys([...expandedRowKeys].filter((key) => key !== currentKey));
                    }
                  }
                  //
                }
              : undefined
          }
          // expandable={data.expandable ? expandableContent : void 0}
          // locale={{
          //   triggerAsc: '点击升序',
          //   triggerDesc: '点击降序',
          //   cancelSort: '取消排序',
          // }}
          components={
            data.draggable
              ? {
                  body: {
                    wrapper: DraggableContainer,
                    row: DraggableBodyRow
                  }
                }
              : null
          }
          onChange={onChange}
        >
          {env.runtime ? renderColumns() : renderColumnsWhenEdit()}
        </Table>
      ) : (
          <Empty description='请添加列或连接数据源' className={css.emptyWrap} />
      )}
      <div
        className={classnames(
          css.footerContainer,
          (data.hasPagination || useBottomRowSelection) && css.marginTop
        )}
      >
        {useBottomRowSelection && RenderBatchBtns()}
        {isShowPagination && (
          <Pagination
            {...data.pagination}
            onChange={(current, pageSize) => {
              onChange({ current, pageSize }, {}, data.sortParams, {
                action: 'paginate',
                currentDataSource: [],
              });
            }}
          />
        )}
      </div>
    </div>
  );
}
