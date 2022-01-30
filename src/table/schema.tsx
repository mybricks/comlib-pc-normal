import { OutputIds } from './constants';
import { Data, IColumn } from './types';
import { setPath } from '../utils/path';

function getRefreshSchema() {
  const refreshSchema = {
    title: '条件参数对象',
    type: 'object',
    properties: {}
  };
  return refreshSchema;
}

function getSingleDataSourceSchema(dataSchema = {}) {
  const schema = {
    title: '表格数据',
    type: 'object',
    properties: {
      dataSource: {
        title: '数据列表',
        type: 'array',
        items: {
          type: 'object',
          properties: dataSchema
        },
        mock: 'array|50'
      },
      total: {
        title: '总记录数',
        type: 'number',
        mock: '@integer(20, 100)'
      }
    }
  };
  return schema;
}

function getColumnsDataSchema(columns: IColumn[], outputId = '') {
  const dataSchema = {};
  columns.map((item) => {
    if (
      item.contentType === 'action' ||
      item.contentType === 'custom' ||
      outputId
    )
      return;
    const schema = {
      type: 'any',
      title: item.title
    };
    if (Array.isArray(item.dataIndex)) {
      setPath(dataSchema, item.dataIndex.join('.'), schema, true);
    } else {
      dataSchema[item.dataIndex] = schema;
    }
  });
  return dataSchema;
}

function setFetchDataSchema(dataSchema, output) {
  const pin = output.get('fetchData');
  if (pin) {
    pin.setSchema(getSingleDataSourceSchema(dataSchema));
  }
}

function setRefreshSchema(input) {
  const refreshPin = input.get('refresh');
  if (refreshPin) {
    refreshPin.setSchema(getRefreshSchema());
  }
}

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
  output.get(OutputIds.GET_TABLE_DATA).setSchema({
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
  if (data.isActive) {
    setFetchDataSchema(dataSchema, output);
    setRefreshSchema(input);
    setDataSourceSchema(dataSchema, input);
  } else {
    setDataSourceSchema(dataSchema, input);
  }
  setOutputsSchema(dataSchema, output, data);
  setRowSelectionSchema({ dataSchema, output });
  setDragFinishSchema({ dataSchema, output });
}

const setCol = (data: Data, focusArea: any, value: any, propName: string) => {
  const index = +focusArea.dataset.tableThIdx;
  const item = { ...data.columns[index] };
  if (!item) {
    return;
  }
  item[propName] = value;
  const copyed = [...data.columns];
  copyed.splice(index, 1, item);
  data.columns = [...copyed];

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
  })
};
