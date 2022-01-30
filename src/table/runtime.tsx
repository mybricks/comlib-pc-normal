import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import moment from 'moment';
import classnames from 'classnames';
// import { runJs } from '../../package/com-utils';
import { Table, Tooltip, Pagination } from 'antd';
import { TablePaginationConfig } from 'antd/es/table';
import {
  SortableContainer,
  SortableElement,
  SortableHandle
} from 'react-sortable-hoc';
import { MenuOutlined, InfoCircleOutlined } from '@ant-design/icons';
import {
  TableCurrentDataSource,
  CompareFn,
  SorterResult,
  TableRowSelection
} from 'antd/es/table/interface';
import css from './runtime.less';
import { uuid } from '../utils';
import { getPageInfo, getTemplateRenderScript } from './utils';
import { useComputed, useObservable } from '@mybricks/rxui';
import { RowSelectionPostion, InputIds, OutputIds, SlotIds } from './constants';
import { arrayMoveImmutable } from 'array-move';
import { Data, ResponseData, IColumn } from './types';
import ColumnRender from './components/ColumnRender';
import ActionBtns from './components/ActionBtns';
import { setPath } from '../utils/path';

const { Column } = Table;

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

export default function ({
  env,
  data,
  inputs,
  outputs,
  slots
}: RuntimeParams<Data>) {
  const { runtime, edit } = env;
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  // const [filterMap, setFilterMap] = useState<any>({})
  // const filterMap = useRef<any>({});
  const tableContent: TableContent = useObservable(
    TableContent,
    (next) =>
      next({
        data,
        env,
        outputs,
        dataSource: [],
        loading: {
          spinning: false,
          tip: data.loadingTip
        },
        filterMap: {}
      }),
    { to: 'children' }
  );
  // const expandableContent = useObservable(ExpandableContent, (next) =>
  //   next({
  //     expandedRowRender: (
  //       record: Record<string, any>,
  //       index: number,
  //       indent: number,
  //       expanded: boolean
  //     ) => (
  //       <ExpandedRowRender
  //         record={record}
  //         index={index}
  //         indent={indent}
  //         expanded={expanded}
  //       />
  //     ),
  //     rowExpandable: () => true
  //   })
  // );

  if (data.hasPagination && data.showPaginationTotal) {
    // showTotal为fn，无法放入json。这个其实是数据的一部分
    data.pagination.showTotal = (total: number) => `共 ${total} 条`;
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
          tableContent.loading.spinning = false;
        });
      inputs[InputIds.SET_DATA_SOURCE]((ds: any) => {
        setTableData(data, ds);
        tableContent.loading.spinning = false;
      });

      inputs[InputIds.END_LOADING](() => {
        tableContent.loading.spinning = false;
      });

      inputs[InputIds.CLEAR_ROW_SELECTION](() => {
        setSelectedRowKeys([]);
        setSelectedRows([]);
      });
      // inputs && inputs['configureToolbar']((ds: any) => {
      //   if (typeCheck(ds, 'object')) {
      //     data.batchBtns = data.batchBtns.map(item => {
      //       const config = ds[item.name]
      //       if (config) {
      //         return Object.assign(item, config)
      //       } else {
      //         return item
      //       }
      //     })
      //   }
      // });

      // if (data.immediate) {
      //   const pageInfo = getPageInfo(data);
      //   fetchData(outputs, data, { ...pageInfo }, env);
      // }

      inputs[InputIds.SET_FILTER_INPUT]((ds) => {
        Object.assign(tableContent.filterMap, ds);
        // setFilterMap((prev) => ({...prev, ds}))
      });
      inputs[InputIds.REFRESH]((ds: any) => {
        onRefreshTable(ds);
        // fetchData(outputs, data, {...pageInfo, ...data.queryParams}, env);
      });

      inputs[InputIds.GET_TABLE_DATA] &&
        inputs[InputIds.GET_TABLE_DATA](() => {
          if (outputs[OutputIds.GET_TABLE_DATA]) {
            outputs[OutputIds.GET_TABLE_DATA](tableContent.dataSource);
          }
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
                  ...newItem
                }
              : oldItem;
          });
          tableContent.dataSource = newDataSource.map((item, index) => ({
            ...item,
            index: item.id
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
    }
  }, []);

  // 表格刷新前 数据聚合
  const onRefreshTable = useCallback((ds?: any) => {
    const pageInfo = getPageInfo(data);
    if (Object.prototype.toString.call(ds) !== '[object Object]') {
      ds = {};
    }

    if (data.hasPagination && ds[data.pageNumber]) {
      data.pagination.current = ds[data.pageNumber];
    }

    data.queryParams = { ...data.queryParams, ...ds };

    if (data.hasPagination) {
      if (data.queryParams.current) {
        data.pagination.current = ~~data.queryParams.current;
      }
      if (data.queryParams.pageSize) {
        data.pagination.pageSize = ~~data.queryParams.pageSize;
      }
    }

    const submitValue = {
      ...pageInfo,
      ...data.queryParams
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
  }, []);

  const submitPropsMethod = useCallback((props) => {
    if (data.useLoading) {
      tableContent.loading.spinning = true;
    }

    outputs[OutputIds.ClickPagination](props);
  }, []);

  if (env.runtime) {
    inputs[InputIds.GET_ROW_SELECTION] &&
      inputs[InputIds.GET_ROW_SELECTION](() => {
        outputs[OutputIds.GET_ROW_SELECTION]({
          selectedRows,
          selectedRowKeys
        });
      });
  }
  // const getFetchDataParams = () => {
  //   const pageInfo = getPageInfo(data)
  //   return { ...pageInfo, ...data.queryParams }
  // }

  // const fetchData = useCallback((outputs: any, data: Data, queryParams: any, env) => {
  //   if (data.useLoading) {
  //     tableContent.loading.spinning = true
  //   }

  //   const promised = (fn, args) => {
  //     return new Promise<any>((resolve, reject) => {
  //       try {
  //         fn(args, (res: any) => {
  //           resolve(res);
  //         })
  //       } catch (e) {
  //         console.error(e)
  //       }
  //     });
  //   };

  //   if (outputs && Object.keys(outputs).find(id => id === 'fetchData')) {
  //     promised(outputs['fetchData'], queryParams).then((res) => {
  //       setTableData(data, res);
  //     }).finally(() => {
  //       tableContent.loading.spinning = false
  //     })
  //   }

  //   // if (data.api?.cdnUrl) {
  //   //   fetchDataForService(data, queryParams, env)
  //   // } else {
  //   //   if (outputs && Object.keys(outputs).find(id => id === 'fetchData')) {
  //   //     promised(outputs['fetchData'], queryParams).then((res) => {
  //   //       setTableData(data, res);
  //   //     }).finally(() => {
  //   //       tableContent.loading.spinning = false
  //   //     })
  //   //   }
  //   // }
  // }, [])

  const setTableData = useCallback((data: Data, ds: ResponseData) => {
    if (data.onLoadData) {
      try {
        data.columns.forEach(
          (item) => (data.columns[item.dataIndex || ''] = item)
        );
        runJs(data.onLoadData, [data, env]);
      } catch (error) {
        console.error(error);
      }
    }
    const { total, dataSource, extraColumns } = ds || {};
    data.extraColumns = extraColumns || data.extraColumns;
    if (dataSource) {
      tableContent.dataSource = dataSource.map((data: any) => {
        return {
          uuid: uuid(),
          ...data
        };
      });
    } else {
      tableContent.dataSource = tableContent.dataSource || [];
    }
    // tableContent.dataSource = dataSource || []
    if (data.hasPagination && total !== undefined) {
      data.pagination.total = total || 0;
    }
  }, []);

  // const fetchDataForService = useCallback((data: Data, queryParams: any, env) => {
  //   const extraParams = extraparamsRuntime({ field: 'extra', env, data })
  //   serviceRuntime({
  //     env,
  //     data,
  //     params: { ...extraParams, ...queryParams },
  //     field: 'api'
  //   }).then((r: any) => {
  //     setTableData(data, r)
  //   }).catch(e => {
  //     tableContent.outputs['resultError'](e)
  //     console.warn(e)
  //   }).finally(() => {
  //     tableContent.loading.spinning = false
  //   })
  // }, [])

  const paginationChange = useCallback((pagination: TablePaginationConfig) => {
    const { current, pageSize } = pagination;
    if (data.hasPagination) {
      data.pagination.current = current || 1;
      data.pagination.pageSize = pageSize || 20;

      if (data.queryParams[data.pageNumber]) {
        delete data.queryParams[data.pageNumber];
      }

      const submitValue = {
        [data.pageNumber || 'current']: current,
        [data.pageSize || 'pageSize']: pageSize,
        ...data.queryParams
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
      // fetchData(
      //   outputs,
      //   data,
      //   {[data.pageNumber || 'current']: current, [data.pageSize || 'pageSize']: pageSize, ...data.queryParams},
      //   env
      // );
    }
  }, []);

  const sorterChange = useCallback((sorter: SorterResult<any>) => {
    const { field, order, column } = sorter || {};
    if (column?.sorter === true) {
      data.sortParams = {
        order,
        field
      };
      onRefreshTable();
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
          [curr.dataIndex]: curr.filter
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
      onRefreshTable();
    }
  }, []);

  // const sorterChange = useCallback(sorter => {
  //   const outputModel = {
  //     type: 'sorter',
  //     order: sorter.order,
  //     field: sorter.field
  //   }
  //   const columnItem = data.columns.find(item => item.dataIndex === sorter.field)
  //   if (columnItem?.sorter?.type === 'request') {
  //     if (data.hasPagination) {
  //       data.pagination.current = 1
  //     }
  //     const dataParams = getFetchDataParams()
  //     outputs['columnAction'](outputModel, (res) => {
  //       data.queryParams = { ...data.queryParams, ...res }
  //       fetchData(outputs, data, { ...dataParams, ...res }, env)
  //     })
  //   }
  // }, [])

  const onChange = useCallback(
    (
      pagination: TablePaginationConfig,
      filters,
      sorter: SorterResult<any>,
      extra: TableCurrentDataSource<any[]>
    ) => {
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
        columnItem,
        value,
        record,
        index,
        colIndex,
        env,
        slots,
        outputs,
        data
      };

      const columnView = <ColumnRender {...columnRenderProps} />;
      // Todo 大数据量 性能问题
      if (
        columnItem.useTooltip &&
        ['text', 'color', 'link'].includes(columnItem.contentType)
      ) {
        return (
          <Tooltip
            placement="topLeft"
            title={columnView}
            overlayClassName={css.ellipsisTooltip}
            // 挂载到table上
            // getTooltipContainer={(node) => {
            //   return getParentNodeByTag(node, 'table');
            // }}
          >
            <span className={css.ellipsisWrap}>{columnView}</span>
          </Tooltip>
        );
      }

      return columnView;
    },
    []
  );

  const columns = useComputed(() => {
    const renderTtl = (cItem: IColumn) => {
      return cItem.hasTip ? (
        <div>
          <span style={{ marginRight: '6px' }}>{cItem.title}</span>
          <Tooltip placement="topLeft" title={cItem.tip}>
            <InfoCircleOutlined />
          </Tooltip>
        </div>
      ) : (
        cItem.title
      );
    };
    // 获取列数据
    const getColumns = () => {
      const res = [...(data.columns || [])];
      // 合并额外列数据
      if (data.extraColumns && Array.isArray(data.extraColumns)) {
        const uid = uuid();
        const defaultColItem = {
          title: '新增',
          dataIndex: `${uid}`,
          ellipsis: true,
          width: 140,
          key: uid,
          uuid: uid,
          contentType: 'text',
          visible: true
        };
        data.extraColumns.forEach((colItem) => {
          if (!colItem) {
            return;
          }
          let { index, ...item } = colItem;
          if (!index || index === -1) {
            index = res.length;
          } else {
            index = index - 1;
          }
          res.splice(index, 0, {
            ...defaultColItem,
            ...item
          });
        });
      }
      if (data.draggable) {
        res.splice(0, 0, {
          title: '',
          dataIndex: 'fzDraggable',
          width: 30,
          className: `${css.dragVisible} column-draggle`,
          render: () => <DragHandle />
        } as any);
      }
      return res;
    };

    return getColumns().map((cItem: IColumn, colIndex) => {
      let sorter: boolean | CompareFn<any> | undefined;
      let ellipsis;

      if (cItem.visible === false) {
        return null;
      }

      if (
        cItem.ellipsis &&
        ['text', 'color', 'link'].includes(cItem.contentType)
      ) {
        ellipsis = true;
        if (cItem.useTooltip) {
          ellipsis = { showTitle: false };
        }
      } else {
        ellipsis = false;
      }

      if (cItem.sorter?.enable) {
        switch (cItem.sorter.type) {
          case 'length':
            sorter = (a, b) => {
              if (!a[cItem.dataIndex] || !b[cItem.dataIndex]) {
                return 0;
              }
              return a[cItem.dataIndex].length - b[cItem.dataIndex].length;
            };
            break;
          case 'size':
            sorter = (a, b) => {
              if (!a[cItem.dataIndex] || !b[cItem.dataIndex]) {
                return 0;
              }
              return a[cItem.dataIndex] - b[cItem.dataIndex];
            };
            break;
          case 'date':
            sorter = (a, b) => {
              if (!a[cItem.dataIndex] || !b[cItem.dataIndex]) {
                return 0;
              }
              return (
                moment(a[cItem.dataIndex]).valueOf() -
                moment(b[cItem.dataIndex]).valueOf()
              );
            };
            break;
          default:
            sorter = true;
            break;
        }
      }
      if (cItem.filter?.enable && cItem.filter?.filterSource !== 'remote') {
        tableContent.filterMap[cItem.dataIndex] = cItem.filter.options;
      }

      const onFilter =
        cItem.filter?.type !== 'request'
          ? (value, record) => {
              return record[cItem.dataIndex] == value;
            }
          : null;

      return (
        <Column
          {...(cItem as any)}
          className={`${css['column-min-width']} ${cItem.className}`}
          title={renderTtl(cItem)}
          ellipsis={ellipsis}
          key={cItem.dataIndex}
          filterMultiple={cItem.filter?.filterType !== 'single'}
          render={
            cItem.render
              ? cItem.render
              : (text, record, index) => {
                  return renderCell(
                    cItem,
                    // dataIndex为空时text=record，会导致错误
                    // 当dataIndex为空时，value设置为''
                    cItem.dataIndex ? text : '',
                    record,
                    index,
                    data.draggable ? colIndex - 1 : colIndex,
                    slots,
                    outputs,
                    data
                  );
                }
          }
          showSorterTooltip={false}
          sorter={sorter}
          filters={tableContent.filterMap[cItem.dataIndex]}
          onFilter={onFilter}
          onHeaderCell={(): any => {
            return {
              'data-table-th-idx': colIndex
            };
          }}
        />
      );
    });
  });

  // const onSelectChange = (selectedRowKeys) => {
  //   setSelectedRowKeys(selectedRowKeys);
  //   outputs['rowSelection'](getSelectedRows(selectedRowKeys));
  // };

  // const handleClear = () => {
  //   setSelectedRowKeys([]);
  // };

  // const handleInvert = () => {
  //   const selected = tableContent.dataSource
  //     .filter((record) => !selectedRowKeys.includes(record.uuid))
  //     .map((item) => item.uuid);
  //   setSelectedRowKeys(selected);
  // };

  // const getSelectedRows = (keys) => {
  //   return tableContent.dataSource.filter((record) =>
  //     keys.includes(record.uuid)
  //   );
  // };

  // const renderBatchBtns = () => {
  //   if (Array.isArray(data.batchBtns)) {
  //     return data.batchBtns.map((item, idx) => (
  //       <Button
  //         data-batch-action-btn
  //         key={item.id}
  //         type='link'
  //         size='small'
  //         disabled={item.disabled}
  //         onClick={() => {
  //           if (env?.runtime) {
  //             selectedRowKeys.length !== 0 ? outputs[item.id](getSelectedRows(selectedRowKeys)) : message.error('请先选择要操作的行')
  //           }
  //         }}
  //       >
  //         {item.name}
  //       </Button>
  //     ));
  //   }
  // };

  // const renderSelectActions = () => {
  //   return (
  //     <div data-select-action-container className={css['select-action-container']}>
  //       <span className={css['info-part']}>
  //         <span className={css['icon-wrapper']}>
  //           <InfoCircleOutlined style={{fontSize: '14px', color: '#8ccff8'}}/>
  //         </span>
  //         <span className={css['desc-wrapper']}>
  //           已选择
  //           <span style={{padding: '0 6px', color: '#8ccff8', fontWeight: 'bold'}}>{selectedRowKeys.length}</span>项
  //         </span>
  //       </span>
  //       <span className={css['btn-part']}>
  //         <Button type='link' size='small' onClick={handleClear}>
  //           清空
  //         </Button>
  //         <Button type='link' size='small' onClick={handleInvert}>
  //           反选
  //         </Button>
  //         {renderBatchBtns()}
  //       </span>
  //     </div>
  //   );
  // };

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
              actionBtns={data.batchBtns}
              record={{
                selectedRows,
                selectedRowKeys
              }}
              btnWrapDataSetKey={false}
              btnDataSetKey="table-batch-btn"
            />
            <div className={css.selectedInfo}>
              已选中
              <span className={css.blue} style={{ marginLeft: 2 }}>
                {selectedRowKeys.length}
              </span>
              {data.rowSelectionLimit ? `/${data.rowSelectionLimit}` : ''}
              <span style={{ marginLeft: 2 }}>项</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 表格头部按钮渲染
  const renderTableBtns = useComputed(() => {
    if (!(data.useActionBtns && data.actionBtns && data.actionBtns.length)) {
      return;
    }
    return (
      <div
        className={classnames(css.width100, css.flex, css.flexRowReverse)}
        data-table-header-action
      >
        <ActionBtns
          colIndex={-1}
          actionBtns={data.actionBtns}
          record={{
            queryParams: data.queryParams,
            dataSource: tableContent.dataSource,
            pagination: data.pagination
          }}
          btnWrapDataSetKey={false}
          btnDataSetKey="table-header-btn"
        />
      </div>
    );
  });

  // 表格标题渲染
  const renderTableTitle = useComputed(() => {
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
        {data.tableTitle}
        {data.useTableTitleWithCount && (
          <span className={css.totalTipWrap}>
            （共<span className={css.blue}>{data.pagination.total}</span>
            条）
          </span>
        )}
      </div>
    );
  });

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
          selectedRowKeys
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
          ? eval(getTemplateRenderScript(data.isDisabledScript))(record)
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

  // 支持拖拽
  const SortableItem = SortableElement((props) => <tr {...props} />);
  const SortableContainerNew = SortableContainer((props) => (
    <tbody {...props} />
  ));

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const { dataSource } = tableContent;
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(
        [].concat(dataSource),
        oldIndex,
        newIndex
      ).filter((el) => !!el);
      tableContent.dataSource = newData;
      outputs[OutputIds.DRAG_FINISH](newData);
    }
  };

  const DraggableContainer = (props) => (
    <SortableContainerNew
      useDragHandle
      disableAutoscroll
      helperClass={css.rowDragging}
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { dataSource } = tableContent;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex((x) => {
      return x.uuid === restProps['data-row-key'];
    });
    return <SortableItem index={index} {...restProps} />;
  };
  // 是否显示分页 总数为0时不显示分页
  const isShowPagination = !!(data.hasPagination && data.pagination.total);
  // 设计态数据mock
  const defaultDataSource = useMemo(() => {
    const mockData = {
      uuid: uuid(),
      guid: 0,
    };
    data.columns.forEach(item => {
      if (Array.isArray(item.dataIndex)) {
        setPath(mockData, item.dataIndex.join('.'), `${item.title}1`,false);
      } else {
        mockData[item.dataIndex] = `${item.title}1`;
      }
    });
    return [mockData];
  }, []);

  return (
    <div className={css.table}>
      <div
        data-table-header-container
        className={classnames(
          css.headerContainer,
          useTopRowSelection && css.flexDirectionColumn,
          (useTopRowSelection || data.useTableTitle || data.useActionBtns) &&
            css.marginBottom
        )}
        // style={data.tableTitleContainerStyle}
      >
        {renderTableTitle}
        {(useTopRowSelection || (data.useActionBtns && data.actionBtns)) && (
          <div className={classnames(css.actionBtnsWrap, css.width100)}>
            {useTopRowSelection && <RenderBatchBtns />}
            {renderTableBtns}
          </div>
        )}
      </div>
      {data.useHeaderSlot && slots[data.headerSlotId].render()}
      {/* {data.useRowSelection && renderSelectActions()} */}
      <Table
        dataSource={edit ? defaultDataSource : tableContent.dataSource}
        loading={tableContent.loading}
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
                expandedRowKeys: edit ? [defaultDataSource[0].uuid] : undefined,
                expandedRowRender: (record) => {
                  return slots[SlotIds.EXPAND_CONTENT].render({
                    inputs: {
                      slotProps(fn) {
                        fn(record);
                      }
                    }
                  });
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
        {columns}
      </Table>
      <div
        className={classnames(
          css.footerContainer,
          (data.hasPagination || useBottomRowSelection) && css.marginTop
        )}
      >
        {useBottomRowSelection && <RenderBatchBtns />}
        {isShowPagination && (
          <Pagination
            {...data.pagination}
            onChange={(current, pageSize) => {
              onChange({ current, pageSize }, {}, data.sortParams, {
                action: 'paginate',
                currentDataSource: []
              });
            }}
          />
        )}
      </div>
    </div>
  );
}
