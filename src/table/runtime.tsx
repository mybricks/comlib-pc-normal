import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Table, Empty } from 'antd';
import { SorterResult, TableRowSelection } from 'antd/es/table/interface';
import { InputIds, OutputIds, SlotIds, TEMPLATE_RENDER_KEY, DefaultRowKey } from './constants';
import { formatDataSource, getDefaultDataSource } from './utils';
import { getTemplateRenderScript } from '../utils/runExpCodeScript';
import {
  ContentTypeEnum,
  Data,
  FilterTypeEnum,
  IColumn,
  RowSelectionTypeEnum,
  TableLayoutEnum,
  WidthTypeEnum
} from './types';
import ColumnRender from './components/ColumnRender';
import ColumnsTitleRender from './components/ColumnsTitleRender';
import TableHeader from './components/TableHeader';
import TableFooter from './components/TableFooter';
import ErrorBoundary from './components/ErrorBoundle';
import css from './runtime.less';

export default function (props: RuntimeParams<Data>) {
  const { env, data, inputs, outputs, slots } = props;
  const { runtime, edit } = env;
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [filterMap, setFilterMap] = useState<any>({});

  const rowKey = data.rowKey || DefaultRowKey;

  const initFilterMap = () => {
    let res = {};
    data.columns.forEach((cItem) => {
      const dataIndex = Array.isArray(cItem.dataIndex)
        ? cItem.dataIndex.join('.')
        : cItem.dataIndex;
      if (cItem.filter?.enable && cItem.filter?.filterSource !== FilterTypeEnum.Request) {
        res[dataIndex] = cItem.filter.options;
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
    }
  }, []);

  useEffect(() => {
    if (env.runtime) {
      // 输出表格数据
      inputs[InputIds.GET_TABLE_DATA] &&
        inputs[InputIds.GET_TABLE_DATA]((val, relOutputs) => {
          const outputFn =
            relOutputs?.[OutputIds.GET_TABLE_DATA] || outputs[OutputIds.GET_TABLE_DATA];
          if (outputFn) {
            outputFn(dataSource);
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
          if (newSelectedRowKeys.length > 0) {
            setSelectedRowKeys(newSelectedRowKeys);
            setSelectedRows(newSelectedRows);
          }
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

  const setTableData = useCallback(
    (ds: any) => {
      let temp = [...dataSource] || [];
      if (Array.isArray(ds)) {
        temp = formatDataSource(ds);
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
    outputs[OutputIds.SORTER](data.sortParams);
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

  const renderColumns = () => {
    return ColumnsTitleRender({
      ...props,
      filterMap,
      renderCell: (columnRenderProps) => (
        <ErrorBoundary>
          <ColumnRender {...columnRenderProps} />
        </ErrorBoundary>
      )
    });
  };
  // hack: fix编辑时数据未及时响应
  const renderColumnsWhenEdit = useCallback(() => {
    return renderColumns();
  }, [env.runtime ? undefined : JSON.stringify(data.columns)]);

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

  return (
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
          dataSource={edit ? defaultDataSource : dataSource}
          loading={{
            tip: data.loadingTip,
            spinning: loading
          }}
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
                  expandedRowKeys: edit ? [defaultDataSource[0][DefaultRowKey]] : undefined, //增加动态设置
                  expandedRowRender: (record, index) => {
                    return slots[SlotIds.EXPAND_CONTENT].render({
                      inputValues: {
                        [InputIds.EXP_COL_VALUES]: {
                          ...record
                        },
                        [InputIds.INDEX]: index
                      },
                      key: `${InputIds.EXP_COL_VALUES}-${index}`
                    });
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
        data={data}
        slots={slots}
        selectedRows={selectedRows}
        selectedRowKeys={selectedRowKeys}
      />
    </div>
  );
}
