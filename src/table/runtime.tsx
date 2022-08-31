import React, { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import classnames from 'classnames';
import { Table, Tooltip, Empty } from 'antd';
import { useObservable } from '@mybricks/rxui';
import isEqual from 'lodash/isEqual';
import {
  SorterResult,
  TableRowSelection,
} from 'antd/es/table/interface';
import { uuid } from '../utils';
import { setPath } from '../utils/path';
import { getTemplateRenderScript } from '../utils/runExpCodeScript';
import { RowSelectionPostion, InputIds, OutputIds, SlotIds, TEMPLATE_RENDER_KEY } from './constants';
import { Data, IColumn } from './types';
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

  useEffect(() => {
    if (runtime) {
      tableContent.dataSource = [];
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

      // 动态设置筛选数据源
      inputs[InputIds.SET_FILTER_INPUT]((ds) => {
        Object.assign(tableContent.filterMap, ds);
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

      // 动态设置勾选项
      if (data.useSetSelectedRowKeys) {
        inputs[InputIds.SET_ROW_SELECTION]((val) => {
          const newSelectedRowKeys: string[] = [];
          const newSelectedRows: any[]= [];
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
      
      // 获取筛选数据
      inputs[InputIds.GET_FILTER] &&
        inputs[InputIds.GET_FILTER]((val, relOutputs) => {
          relOutputs[OutputIds.GET_FILTER](data.filterParams);
        });
      
      // 获取排序数据
      inputs[InputIds.GET_SORT] &&
        inputs[InputIds.GET_SORT]((val, relOutputs) => {
          relOutputs[OutputIds.GET_SORT](data.sortParams);
        });
    }
  }, []);

  useEffect(() => {
    if (env.runtime) {
      // 获取勾选数据
      inputs[InputIds.GET_ROW_SELECTION] &&
        inputs[InputIds.GET_ROW_SELECTION]((val, relOutputs) => {
          relOutputs[OutputIds.GET_ROW_SELECTION]({
            selectedRows,
            selectedRowKeys,
          });
        });
    }
  }, [selectedRows, selectedRowKeys]);

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
  const setTableData = useCallback((ds: any) => {
    if (Array.isArray(ds)) {
      tableContent.dataSource = initDataSource(ds);
    } else {
      tableContent.dataSource = tableContent.dataSource || [];
    }
  }, []);

  const sorterChange = useCallback((sorter: SorterResult<any>) => {
    const { field, order } = sorter || {};
    const column = data.columns.find(item => isEqual(item.dataIndex, field));
    if (column?.sorter?.type === 'request') {
      const sortParams = {
        field: Array.isArray(field) ? field.join('.') : field,
        order
      }
      data.sortParams = sortParams;
      outputs[OutputIds.SORTER](sortParams);
    }
  }, []);

  const filterChange = useCallback((filter: any) => {
    const filterKey = Object.keys(filter);
    const filterParams = {};
    let isOutput = false;
    filterKey.forEach(key => {
      const col = data.columns.find(item => `${item.dataIndex}` === key);
      if (col) {
        filterParams[Array.isArray(col.dataIndex) ? col.dataIndex.join('.') : col.dataIndex] = filter[key];
      }
      if (col && col.filter?.enable && col.filter?.type === 'request') {
        isOutput = true;
      }
    });
    data.filterParams = filterParams;
    if (isOutput) {
      outputs[OutputIds.FILTER](filterParams);
    }
  }, []);

  const onChange = useCallback((pagination, filters, sorter, extra) => {
    if (env.edit) {
      return;
    }
    const { action } = extra;
    switch (action) {
      case 'sort':
        sorterChange(sorter);
        break;
      case 'filter':
        filterChange(filters);
        break;
      default:
        break;
    }
  }, []);

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
      return <div key={idx}>{node}</div>;
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
      return null;
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
      return null;
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
      return null;
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
        return { disabled: true } as any;
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
          if (Array.isArray(item.dataIndex)) {
            setPath(mockData, item.key, defaultValue, false);
            setPath(mockData, item.dataIndex.join('.'), defaultValue, false);
          } else {
            mockData[item.key] = defaultValue;
            mockData[item.dataIndex] = defaultValue;
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
      >
        {renderTableTitle()}
        {(useTopRowSelection || (data.useActionBtns && data.actionBtns) || data.useColumnSetting) && (
          <div className={classnames(css.actionBtnsWrap, css.width100)}>
            {/* 渲染顶部操作按钮 */}
            <div data-table-header-toprowselection>
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
      {data.useHeaderSlot && data.headerSlotId && slots[data.headerSlotId].render()}
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
          rowSelection={data.useRowSelection ? rowSelection : undefined}
          showHeader={data.showHeader === false && env.runtime ? false : true}
          scroll={{
            x: '100%',
            y: data.scroll.y ? data.scroll.y : void 0
          }}
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
                }
              : undefined
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
      </div>
    </div>
  );
}
