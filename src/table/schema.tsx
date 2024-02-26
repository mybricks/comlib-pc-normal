import { InputIds, OutputIds, SlotIds } from './constants';
import { ContentTypeEnum, Data, IColumn } from './types';
import { setPath } from '../utils/path';
import { getColumnItem, getColumnItemDataIndex } from './utils';

interface Props {
  data: Data;
  input: any;
  output: any;
  slot: any;
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
    if (Array.isArray(columns)) {
      columns.forEach((item) => {
        const colDataIndex = getColumnItemDataIndex(item);
        const schema = {
          type: 'string',
          title: item.title,
          ...schemaObj[colDataIndex]
        };
        if (item.contentType === ContentTypeEnum.SlotItem && !item.keepDataIndex) {
          return;
        }
        if (item.contentType === ContentTypeEnum.Group) {
          item.children && setDataSchema(item.children);
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
              items: {
                type: 'object',
                properties: dataSchema
              }
            },
            total: {
              type: 'number'
            },
            pageSize: {
              type: 'number'
            },
            pageNum: {
              type: 'number'
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
        type: 'array',
        items: {
          type: 'string'
        }
      },
      selectedRows: {
        title: '勾选行完整数据',
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
        type: 'array',
        items: {
          type: 'string'
        }
      },
      selectedRows: {
        title: '勾选行完整数据',
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
function setRowSlotSchema(schemaObj: object, dataSchema: object, { data, slot }: Props) {
  data.columns.forEach((col) => {
    const key = getColumnItemDataIndex(col);
    if (col.contentType === 'slotItem' && col.slotId) {
      slot?.setTitle(col.slotId, `自定义${col.title}列`);
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

export function setDataSchema({ data, output, input, slot }: EditorResult<Data>) {
  const schemaObj = schema2Obj(data[`input${InputIds.SET_DATA_SOURCE}Schema`], data) || {};
  const dataSchema = getColumnsDataSchema(schemaObj, { data, output, input, slot });

  setDataSourceSchema(dataSchema, { data, output, input, slot });
  setOutputsSchema(dataSchema, { data, output, input, slot });
  setFilterSchema(schemaObj, { data, output, input, slot });
  setExpandSlotSchema(schemaObj, dataSchema, { data, output, input, slot });
  setRowSlotSchema(schemaObj, dataSchema, { data, output, input, slot });
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
          type: 'string'
        },
        dataIndex: {
          type: 'string'
        },
        width: {
          type: 'number'
        },
        usePrevious: {
          type: 'boolean'
        },
        filter: {
          type: 'object',
          properties: {
            enable: {
              type: 'boolean'
            },
            type: {
              type: 'string'
            },
            hideFilterDropdown: {
              type: 'boolean'
            },
            options: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  text: {
                    type: 'string'
                  },
                  value: {
                    type: 'string'
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
          type: 'string'
        },
        dataIndex: {
          type: 'string'
        },
        visible: {
          type: 'boolean'
        },
        width: {
          type: 'number'
        }
      }
    }
  },
  ROW_CLICK: {
    type: 'object',
    properties: {
      index: {
        type: 'number'
      },
      record: {
        type: 'object'
      }
    }
  },
  CEll_CLICK: {
    type: 'object',
    properties: {
      record: {
        type: 'object'
      },
      index: {
        type: 'number'
      },
      dataIndex: {
        type: 'string'
      },
      isFocus: {
        type: 'boolean'
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
