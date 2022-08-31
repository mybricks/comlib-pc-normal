import { InputIds, OutputIds } from './constants';
import { Data } from './types';
import { setPath } from '../utils/path';
import { getColumnItem } from './utils';

function getRefreshSchema() {
  const refreshSchema = {
    title: '条件参数对象',
    type: 'object',
    properties: {}
  };
  return refreshSchema;
}

function getSingleDataSourceSchema(dataSchema = {}) {
  return {
    title: '数据列表',
    type: 'array',
    items: {
      type: 'object',
      properties: dataSchema
    }
  };
}

function schema2Obj(schema: any = {}, parentKey = '', config: any = { isRoot: true }) {
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
        schema2Obj(properties[key], targetKey, {
          ...config,
          isRoot: false
        })
      );
    }
  });
  return res;
}
function getColumnsDataSchema(data: Data, outputId = '') {
  const { columns } = data;
  const dataSchema = {};
  const schemaObj = schema2Obj(data[`input${InputIds.SET_DATA_SOURCE}Schema`]) || {};

  const setDataSchema = (columns) => {
    if (Array.isArray(columns)) {
      columns.forEach((item) => {
        if (item.contentType === 'action' || item.contentType === 'custom' || outputId) {
          return;
        }
        const schema = {
          type: 'string',
          title: item.title,
          ...schemaObj[Array.isArray(item.dataIndex) ? item.dataIndex.join('.') : item.dataIndex]
        };
        if (item.contentType === 'group') {
          setDataSchema(item.children);
          return;
        }
        if (Array.isArray(item.dataIndex)) {
          setPath(dataSchema, item.dataIndex.join('.'), schema, true);
        } else {
          dataSchema[item.dataIndex] = schema;
        }
      });
    }
  };
  setDataSchema(columns);
  return dataSchema;
}

// function setFetchDataSchema(dataSchema, output, config) {
//   const pin = output.get('fetchData');
//   if (pin) {
//     pin.setSchema(getSingleDataSourceSchema(dataSchema, config));
//   }
// }

// function setRefreshSchema(input) {
//   const refreshPin = input.get('refresh');
//   if (refreshPin) {
//     refreshPin.setSchema(getRefreshSchema());
//   }
// }

function setDataSourceSchema(dataSchema, input) {
  const dataSourcePin = input.get('dataSource');
  if (dataSourcePin) {
    dataSourcePin.setSchema(getSingleDataSourceSchema(dataSchema));
  }
}

function setOutputsSchema(dataSchema, output, data) {
  data.batchBtns.forEach((btn) => {
    const nbtn = output.get(btn.id);
    if (nbtn) {
      nbtn.setSchema({
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
    }
  });
  data.actionBtns?.forEach((btn) => {
    const nbtn = output.get(btn.id);
    if (nbtn) {
      nbtn.setSchema({
        type: 'object',
        properties: {
          queryParams: {
            title: '筛选参数',
            type: 'object',
            properties: {}
          },
          pagination: {
            title: '分页参数',
            type: 'object',
            properties: {}
          },
          dataSource: {
            title: '表格数据',
            type: 'array',
            items: {
              type: 'object',
              properties: getColumnsDataSchema(data)
            }
          }
        }
      });
    }
  });
  // data.scratchOutputIds.forEach((id) => {
  //   const nbtn = output.get(id);
  //   if (nbtn) {
  //     nbtn.setSchema({
  //       title: '表格行数据',
  //       type: 'object',
  //       properties: dataSchema
  //     });
  //   }
  // });
  output.get(OutputIds.GET_TABLE_DATA)?.setSchema?.({
    title: '表格数据',
    type: 'array',
    items: {
      type: 'object',
      properties: dataSchema
    }
  });
}

function setPaginationSchema({ output, data }) {
  output.get(OutputIds.ClickPagination).setSchema({
    title: '分页参数',
    type: 'object',
    properties: {
      [data.pageNumber || 'current']: {
        title: '当前页',
        type: 'number'
      },
      [data.pageSize || 'pageSize']: {
        title: '每页条数',
        type: 'number'
      }
    }
  });
}

function getActionSchema(data: Data) {
  const paramRules = {
    title: '表格行数据',
    type: 'object',
    properties: getColumnsDataSchema(data)
  };

  return paramRules;
}

// 设置勾选输出数据schema
function setRowSelectionSchema({ dataSchema, output }) {
  const Pin = output.get(OutputIds.GET_ROW_SELECTION);
  if (Pin) {
    Pin.setSchema({
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
  }
}

// 设置拖拽完成输出schema
function setDragFinishSchema({ dataSchema, output }) {
  const Pin = output.get(OutputIds.DRAG_FINISH);
  if (Pin) {
    Pin.setSchema({
      title: '拖拽完成',
      type: 'array',
      items: {
        type: 'object',
        properties: dataSchema
      }
    });
  }
}

// 设置筛选数据schema
function getFilterSchema(data: Data) {
  const schema = {
    type: 'object',
    properties: {}
  };
  data.columns
    .filter((item) => item.filter?.enable && item.filter?.type === 'request')
    .forEach((item) => {
      const key = Array.isArray(item.dataIndex) ? item.dataIndex.join('.') : item.dataIndex;
      schema.properties[key] = {
        type: 'any'
      };
    });
  return schema;
}
function setFilterSchema({ data, output }: { data: Data; output: any }) {
  output.get(OutputIds.FILTER)?.setSchema(getFilterSchema(data));
}

function setDataSchema({ data, output, input }) {
  const dataSchema = getColumnsDataSchema(data);
  // const config = { usePagination: data.hasPagination }
  setDataSourceSchema(dataSchema, input);
  setOutputsSchema(dataSchema, output, data);
  setRowSelectionSchema({ dataSchema, output });
  setDragFinishSchema({ dataSchema, output });
  setFilterSchema({ data, output });
}

const setCol = (data: Data, focusArea: any, value: any, propName: string) => {
  const item = getColumnItem(data, focusArea);
  if (!item) {
    return;
  }
  item[propName] = value;
  data.columns = [...data.columns];
  return data.columns;
};

export {
  setCol,
  setDataSchema,
  setPaginationSchema,
  getColumnsDataSchema,
  getActionSchema,
  getRefreshSchema,
  getSingleDataSourceSchema
};

export const Schemas = {
  Object: {
    type: 'object',
    properties: {}
  },
  Void: {
    type: 'any'
  },
  RECORD: (data: Data) => ({
    type: 'object',
    properties: getColumnsDataSchema(data)
  }),
  GetRowSelection: (data: Data) => ({
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
          properties: getColumnsDataSchema(data)
        }
      }
    }
  }),
  SET_ROW_SELECTION: {
    title: '勾选项',
    type: 'array',
    items: {
      type: 'string'
    }
  },
  BATCH_BTN_CLICK: (data: Data) => ({
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
          properties: getColumnsDataSchema(data)
        }
      }
    }
  }),
  DRAG_FINISH: (data: Data) => ({
    type: 'array',
    items: {
      type: 'object',
      properties: getColumnsDataSchema(data)
    }
  }),
  GET_TABLE_DATA: (data) => ({
    title: '表格数据',
    type: 'array',
    items: {
      type: 'object',
      properties: getColumnsDataSchema(data)
    }
  }),
  SLOT_PROPS: (data: Data) => getSingleDataSourceSchema(getColumnsDataSchema(data)),
  HEADER_BTN_CLICK: (data: Data) => ({
    type: 'object',
    properties: {
      queryParams: {
        title: '筛选参数',
        type: 'object',
        properties: {}
      },
      pagination: {
        title: '分页参数',
        type: 'object',
        properties: {}
      },
      dataSource: {
        title: '表格数据',
        type: 'array',
        items: {
          type: 'object',
          properties: getColumnsDataSchema(data)
        }
      }
    }
  }),
  DYNAMIC_COL: {
    title: '显示列数据',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        dataIndex: {
          title: '表格字段',
          type: 'string'
        },
        title: {
          title: '表格标题',
          type: 'string'
        }
      }
    }
  },
  FILTER: (data: Data) => getFilterSchema(data),
  SORTER: {
    type: 'object',
    properties: {
      field: {
        type: 'string'
      },
      order: {
        type: 'string'
      }
    }
  }
};
