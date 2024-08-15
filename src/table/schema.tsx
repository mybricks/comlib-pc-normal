import { InputIds, OutputIds, SlotIds, DefaultRowKeyKey } from './constants';
import { ContentTypeEnum, Data, IColumn } from './types';
import { setPath } from '../utils/path';
import { getColumnItem, getColumnItemDataIndex } from './utils';

interface Props {
  data: Data;
  input: any;
  output: any;
  slot: any;
  env?: any;
}

function getColumnsWithExpand(data: Data) {
  const list = [...data.columns];
  if (data.useExpand && data.expandDataIndex) {
    list.push({
      dataIndex: data.expandDataIndex,
      title: '展开行数据',
      key: '_expandIndex',
      contentType: ContentTypeEnum.Text,
      dataSchema: data.expandDataSchema
    });
  }
  return list;
}
export function getDefaultDataSchema(dataIndex: string | string[] | undefined, data: Data) {
  if (!dataIndex) {
    return { type: 'string' };
  }
  const columnIdx = Array.isArray(dataIndex) ? dataIndex.join('.') : dataIndex;
  const schemaObj = schema2Obj(data[`input${InputIds.SET_DATA_SOURCE}Schema`], data) || {};
  return schemaObj[columnIdx] || { type: 'string' };
}
function schema2Obj(schema: any = {}, data: Data) {
  function loop(schema: any = {}, parentKey = '', config: any = { isRoot: true }) {
    const { isRoot = false } = config;
    const { type } = schema;
    const res: any = {};
    if (type !== 'object' && type !== 'array') return;
    const properties = (type === 'object' ? schema.properties : schema.items.properties) || {};
    Object.keys(properties).forEach((key) => {
      const subSchema = properties[key];
      const targetKey = isRoot ? key : `${parentKey}.${key}`;
      res[targetKey] = subSchema;
      if (subSchema?.type === 'object') {
        Object.assign(
          res,
          loop(properties[key], targetKey, {
            ...config,
            isRoot: false
          })
        );
      }
    });
    return res;
  }
  const schemaObj = loop(schema) || {};
  getColumnsWithExpand(data).forEach((item) => {
    const idx = getColumnItemDataIndex(item);
    if (
      item.dataSchema &&
      ([ContentTypeEnum.Text].includes(item.contentType) ||
        ([ContentTypeEnum.SlotItem].includes(item.contentType) && item.keepDataIndex))
    ) {
      schemaObj[idx] = item.dataSchema;
    }
  });
  return schemaObj;
}

// 获取列数据schema
function getColumnsDataSchema(schemaObj: object, { data }: Props) {
  const dataSchema = {};

  const setDataSchema = (columns: IColumn[]) => {
    let rowKeyDataIndex = '';
    columns.forEach(({ key, dataIndex }) => {
      if (key === DefaultRowKeyKey) {
        rowKeyDataIndex = String(dataIndex);
      }
    });
    if (Array.isArray(columns)) {
      columns.forEach((item) => {
        const colDataIndex = getColumnItemDataIndex(item);
        const { title, dataIndex, contentType, children, keepDataIndex } = item;
        const schema = {
          type: 'string',
          title,
          description: `表格列的字段名为: ${dataIndex}${
            !!rowKeyDataIndex && dataIndex === rowKeyDataIndex && '，行标识字段，值需要全局唯一'
          }`,
          ...schemaObj[colDataIndex]
        };
        if (contentType === ContentTypeEnum.SlotItem && !keepDataIndex) {
          return;
        }
        if (contentType === ContentTypeEnum.Group) {
          children && setDataSchema(children);
          return;
        }
        setPath(dataSchema, colDataIndex, schema, true);
      });
    }
  };
  setDataSchema(getColumnsWithExpand(data));
  return dataSchema;
}

// 数据源schema
function setDataSourceSchema(dataSchema: object, { input, data, output }: Props) {
  const TableDataSchema =
    data.usePagination && !data.paginationConfig?.useFrontPage
      ? {
          title: '数据列表',
          type: 'object',
          properties: {
            dataSource: {
              type: 'array',
              description: '表格数据源数据',
              items: {
                type: 'object',
                properties: dataSchema
              }
            },
            total: {
              type: 'number',
              description: '数据总数'
            },
            pageSize: {
              type: 'number',
              description: '表格每页条数'
            },
            pageNum: {
              type: 'number',
              description: '表格当前页码'
            }
          }
        }
      : {
          title: '数据列表',
          type: 'array',
          items: {
            type: 'object',
            properties: dataSchema
          }
        };
  input.get(InputIds.SET_DATA_SOURCE)?.setSchema(TableDataSchema);
  output.get(OutputIds.SET_DATA_SOURCE)?.setSchema?.(TableDataSchema);
}

// 输出节点schema
function setOutputsSchema(dataSchema, { output }: Props) {
  output.get(OutputIds.ROW_SELECTION)?.setSchema?.({
    title: '勾选数据',
    type: 'object',
    properties: {
      selectedRowKeys: {
        title: '勾选数据',
        description: '勾选的数据，返回一组勾选行的key字段的数据',
        type: 'array',
        items: {
          type: 'string'
        }
      },
      selectedRows: {
        title: '勾选行完整数据',
        description: '返回勾选行的完整数据',
        type: 'array',
        items: {
          type: 'object',
          properties: dataSchema
        }
      }
    }
  });
  output.get(OutputIds.GET_ROW_SELECTION)?.setSchema?.({
    title: '勾选数据',
    type: 'object',
    properties: {
      selectedRowKeys: {
        title: '勾选数据',
        description: '勾选的数据，返回一组勾选行的key字段的数据',
        type: 'array',
        items: {
          type: 'string'
        }
      },
      selectedRows: {
        title: '勾选行完整数据',
        description: '返回勾选行的完整数据',
        type: 'array',
        items: {
          type: 'object',
          properties: dataSchema
        }
      }
    }
  });
  output.get(OutputIds.GET_TABLE_DATA)?.setSchema?.({
    title: '表格数据',
    type: 'array',
    items: {
      type: 'object',
      properties: dataSchema
    }
  });
}

// 设置筛选数据schema
function setFilterSchema(schemaObj, { data, input, output }: Props) {
  const schema1 = {
    type: 'object',
    properties: {}
  };
  const schema2 = {
    type: 'object',
    properties: {}
  };
  const schema3 = {
    type: 'object',
    properties: {
      dataIndex: {
        type: 'string'
      },
      dataSource: {
        type: 'array'
      }
    }
  };

  const setDataSchema = (columns: IColumn[]) => {
    if (Array.isArray(columns)) {
      columns.forEach((item) => {
        if (item.filter?.enable) {
          const key = getColumnItemDataIndex(item);
          schema1.properties[key] = {
            type: 'array',
            items: {
              type: 'string',
              ...(schemaObj[key] || {})
            }
          };
          schema2.properties[key] = {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                text: {
                  type: 'string'
                },
                value: {
                  type: 'any',
                  ...(schemaObj[key] || {})
                }
              }
            }
          };
        }
        if (item.contentType === ContentTypeEnum.Group && item.children) {
          setDataSchema(item.children);
        }
      });
    }
  };
  setDataSchema(data.columns);

  output.get(OutputIds.FILTER)?.setSchema(schema1);
  output.get(OutputIds.GET_FILTER)?.setSchema(schema1);
  output.get(OutputIds.FILTER_CLICK)?.setSchema(schema3);
  output.get(OutputIds.SET_FILTER)?.setSchema(schema1);
  output.get(OutputIds.SET_FILTER_INPUT)?.setSchema(schema2);
  input.get(InputIds.SET_FILTER)?.setSchema(schema1);
  input.get(InputIds.SET_FILTER_INPUT)?.setSchema(schema2);
}

// 展开行插槽作用域schema
function setExpandSlotSchema(schemaObj: object, dataSchema, { slot, data }: Props) {
  slot?.get(SlotIds.EXPAND_CONTENT)?.inputs?.get(InputIds.EXP_COL_VALUES)?.setSchema({
    type: 'object',
    properties: dataSchema
  });
  if (data.useExpand && data.expandDataIndex) {
    const key = Array.isArray(data.expandDataIndex)
      ? data.expandDataIndex.join('.')
      : data.expandDataIndex;
    slot
      ?.get(SlotIds.EXPAND_CONTENT)
      ?.inputs?.get(InputIds.EXP_ROW_VALUES)
      ?.setSchema({
        type: 'string',
        ...(schemaObj[key] || {})
      });
  }
}

// 列插槽作用域schema
function setRowSlotSchema(schemaObj: object, dataSchema: object, { data, slot, env }: Props) {
  data.columns.forEach((col) => {
    const key = getColumnItemDataIndex(col);
    if (col.contentType === 'slotItem' && col.slotId) {
      slot?.setTitle(col.slotId, `${env && env?.i18n ? env.i18n(col.title) : col.title}-列`);
      slot?.get(col.slotId)?.inputs?.get(InputIds.SLOT_ROW_RECORD)?.setSchema({
        type: 'object',
        properties: dataSchema
      });
      slot
        ?.get(col.slotId)
        ?.inputs?.get(InputIds.SLOT_ROW_VALUE)
        ?.setSchema({
          type: 'string',
          ...(schemaObj[key] || {})
        });
      slot
        ?.get(col.slotId)
        ?.outputs?.get(OutputIds.Edit_Table_Data)
        ?.setSchema({
          type: 'object',
          properties: {
            index: {
              type: 'number'
            },
            value: {
              type: 'object',
              properties: dataSchema
            }
          }
        });
    }
  });
}
// 行点击事件schema
function setRowClickSchema(dataSchema: object, { output }: Props) {
  const schema = {
    type: 'object',
    properties: {
      index: {
        type: 'number'
      },
      record: {
        type: 'object',
        properties: dataSchema
      }
    }
  };
  output.get(OutputIds.ROW_CLICK)?.setSchema(schema);
  output.get(OutputIds.ROW_DOUBLE_CLICK)?.setSchema(schema);
}

/**
 * upgrade时候更新列插槽作用域schema
 * @param
 */
export const upgradeSchema = ({ data, output, input, slot }) => {
  const schemaObj = schema2Obj(data[`input${InputIds.SET_DATA_SOURCE}Schema`], data) || {};
  const dataSchema = getColumnsDataSchema(schemaObj, { data, output, input, slot });
  setRowSlotSchema(schemaObj, dataSchema, { data, output, input, slot });
};

export function getTableSchema({ data }) {
  const schemaObj = schema2Obj(data[`input${InputIds.SET_DATA_SOURCE}Schema`], data) || {};
  const dataSchema = getColumnsDataSchema(schemaObj, { data } as any);
  return dataSchema;
}

type setDataSchemaProps = Pick<EditorResult<Data>, 'data' | 'output' | 'input' | 'slot'> & {
  env?: EditorResult<Data>['env'];
  focusArea?: EditorResult<Data>['focusArea'];
};
export function setDataSchema({ data, output, input, slot, env }: setDataSchemaProps) {
  const schemaObj = schema2Obj(data[`input${InputIds.SET_DATA_SOURCE}Schema`], data) || {};
  const dataSchema = getColumnsDataSchema(schemaObj, { data, output, input, slot });
  console.log('[38;2;255;0;255m [ dataSchema ]-375-「table/schema.tsx」 [0m', dataSchema);

  setDataSourceSchema(dataSchema, { data, output, input, slot });
  setOutputsSchema(dataSchema, { data, output, input, slot });
  setFilterSchema(schemaObj, { data, output, input, slot });
  setExpandSlotSchema(schemaObj, dataSchema, { data, output, input, slot });
  setRowSlotSchema(schemaObj, dataSchema, { data, output, input, slot, env });
  setRowClickSchema(dataSchema, { data, output, input, slot });
}

export const setCol = <T extends keyof IColumn, P extends IColumn[T]>(
  { data, focusArea }: { data: Data; focusArea: any },
  propName: T,
  value: P
) => {
  const item = getColumnItem(data, focusArea);
  if (!item) {
    return;
  }
  item[propName] = value;
  data.columns = [...data.columns];
  return data.columns;
};

export const Schemas = {
  Object: {
    type: 'object'
  },
  Any: {
    type: 'any'
  },
  Void: {
    type: 'any'
  },
  Number: {
    type: 'number'
  },
  String: {
    type: 'string'
  },
  Boolean: {
    type: 'boolean'
  },
  Array: {
    type: 'array'
  },
  SET_ROW_SELECTION: {
    title: '勾选项',
    type: 'array',
    items: {
      type: 'string'
    }
  },
  SET_FOCUS_ROW: {
    title: '选中行序号',
    type: 'number'
  },
  SORTER: {
    type: 'object',
    properties: {
      id: {
        type: 'string'
      },
      order: {
        type: 'string'
      }
    }
  },
  SET_SHOW_COLUMNS: {
    type: 'array',
    items: {
      type: 'string'
    }
  },
  SET_SHOW_TitleS: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: '表格列标题'
        },
        dataIndex: {
          type: 'string',
          description: '表格列数据在数据项中的路径'
        },
        width: {
          type: 'number',
          description: '表格列宽度'
        },
        usePrevious: {
          type: 'boolean'
        },
        filter: {
          type: 'object',
          properties: {
            enable: {
              type: 'boolean',
              description: '是否启用过滤'
            },
            type: {
              type: 'string',
              description: '过滤类型'
            },
            hideFilterDropdown: {
              type: 'boolean',
              description: '是否隐藏表格列的过滤菜单'
            },
            options: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  text: {
                    type: 'string',
                    description: '选项文字'
                  },
                  value: {
                    type: 'string',
                    description: '选项值'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  CHANGE_COLS_ATTR: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: '表格列标题'
        },
        dataIndex: {
          type: 'string',
          description: '表格列数据在数据项中的路径'
        },
        visible: {
          type: 'boolean',
          description: '表格列是否可见'
        },
        width: {
          type: 'number',
          description: '表格列宽度'
        }
      }
    }
  },
  ROW_CLICK: {
    type: 'object',
    properties: {
      index: {
        type: 'number',
        description: '行序号'
      },
      record: {
        type: 'object',
        description: '行数据'
      }
    }
  },
  CEll_CLICK: {
    type: 'object',
    properties: {
      record: {
        type: 'object',
        description: '行数据'
      },
      index: {
        type: 'number',
        description: '单元格所在行的索引'
      },
      dataIndex: {
        type: 'string',
        description: '单元格所在列在数据项中的路径'
      },
      isFocus: {
        type: 'boolean',
        description: '单元格是否聚焦'
      }
    }
  },
  TABLE_HEIGHT: {
    type: 'object',
    properties: {
      maxScrollHeight: {
        type: 'string'
      },
      tableHeight: {
        type: 'string'
      }
    }
  },
  SET_SIZE: {
    type: 'string'
  },
  SET_SIZE_DONE: {
    type: 'string'
  }
};
