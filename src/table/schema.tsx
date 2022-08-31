import { OutputIds } from './constants';
import { Data, IColumn } from './types';
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

function getSingleDataSourceSchema(dataSchema = {}, config: any = {}) {
  const { usePagination = true } = config;
  if (Object.keys(dataSchema).length === 0) {
    return {
      title: '表格数据',
      type: 'any'
    }
  }
  const schema: any = {
    title: '表格数据',
    type: 'object',
    properties: {
      dataSource: {
        title: '数据列表',
        type: 'array',
        items: {
          type: 'object',
          properties: dataSchema
        }
      }
    }
  };

  // if (useQuery) {
  //   schema.properties.queryParams = {
  //     title: '筛选参数',
  //     type: 'object',
  //     properties: {}
  //   };
  // }

  if (usePagination) {
    schema.properties.total = {
      title: '总记录数',
      type: 'number'
    };
  } else {
    return schema.properties.dataSource
  }


  return schema;
}

function getColumnsDataSchema(columns: IColumn[], outputId = '') {
  const dataSchema = {};
  const setDataSchema = (columns) => {
    if (Array.isArray(columns)) {
      columns.forEach((item) => {
        if (item.contentType === 'action' || item.contentType === 'custom' || outputId) {
          return;
        }
        const schema = {
          type: 'string',
          title: item.title
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

function setFetchDataSchema(dataSchema, output, config) {
  const pin = output.get('fetchData');
  if (pin) {
    pin.setSchema(getSingleDataSourceSchema(dataSchema, config));
  }
}

function setRefreshSchema(input) {
  const refreshPin = input.get('refresh');
  if (refreshPin) {
    refreshPin.setSchema(getRefreshSchema());
  }
}

function setDataSourceSchema(dataSchema, input, config) {
  const dataSourcePin = input.get('dataSource');
  if (dataSourcePin) {
    dataSourcePin.setSchema(getSingleDataSourceSchema(dataSchema, config));
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
              properties: getColumnsDataSchema(data.columns)
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
    properties: getColumnsDataSchema(data.columns)
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

function setDataSchema({ data, output, input }) {
  const dataSchema = getColumnsDataSchema(data.columns);
  const config = { usePagination: data.hasPagination }
  if (data.isActive) {
    setFetchDataSchema(dataSchema, output, config);
    setRefreshSchema(input);
    setDataSourceSchema(dataSchema, input, config);
  } else {
    setDataSourceSchema(dataSchema, input, config);
  }
  setOutputsSchema(dataSchema, output, data);
  setRowSelectionSchema({ dataSchema, output });
  setDragFinishSchema({ dataSchema, output });
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
          properties: getColumnsDataSchema(data.columns)
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
          properties: getColumnsDataSchema(data.columns)
        }
      }
    }
  }),
  DRAG_FINISH: (data: Data) => ({
    type: 'array',
    items: {
      type: 'object',
      properties: getColumnsDataSchema(data.columns)
    }
  }),
  GET_TABLE_DATA: (data) => ({
    title: '表格数据',
    type: 'array',
    items: {
      type: 'object',
      properties: getColumnsDataSchema(data.columns)
    }
  }),
  SLOT_PROPS: (data: Data) =>
    getSingleDataSourceSchema(getColumnsDataSchema(data.columns)),
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
          properties: getColumnsDataSchema(data.columns)
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
  }
};
