export const InputIds = {
  SetTreeData: 'treeData',
  SetNodeData: 'nodeData',
  SetSearchValue: 'searchValue',
  SetFilterValue: 'filter',
  SetSelectedKeys: 'setSelectedKeys',
  SetExpandedKeys: 'setExpandedKeys',
  SetCheckedKeys: 'checkedValues',
  SetDisableCheckbox: 'disableCheckbox',
  SetEnableCheckbox: 'enableCheckbox',
  SetDragConfig: 'setDragConfig',
  SetOpenDepth: 'setOpenDepth',
  SetAddTips: 'addTips',
  GetCheckedKeys: 'submit',
  GetSelectedKeys: 'getSelectedKeys',
  GetTreeData: 'getTreeData',
  SetLoadData: 'setLoadData',
}

export const OutputIds = {
  OnChange: 'onChange',
  OnDropDone: 'onDropDone',
  AddNodeDone: 'addNodeDone',
  OnNodeClick: 'click',
  OnCheck: 'check',
  ReturnTreeData: 'returnTreeData',
  ReturnSelectedKeys: 'returnSelectedKeys',
  LoadData: 'loadData',
  SetLoadDataDone: 'setLoadDataDone',
}

export const DragConfigKeys = ['draggable', 'draggableScript', 'allowDrop', 'allowDropScript', 'useDropScope', 'dropScopeMessage'];

export const DefaultStaticData = '%5B%0A%20%20%7B%0A%20%20%20%20%22key%22%3A%20%22%E7%AC%AC%E4%B8%80%E7%BA%A7%201%22%2C%0A%20%20%20%20%22title%22%3A%20%22%E7%AC%AC%E4%B8%80%E7%BA%A7%201%22%2C%0A%20%20%20%20%22children%22%3A%20%5B%0A%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%22key%22%3A%20%22%E7%AC%AC%E4%BA%8C%E7%BA%A7%201-1%22%2C%0A%20%20%20%20%20%20%20%20%22title%22%3A%20%22%E7%AC%AC%E4%BA%8C%E7%BA%A7%201-1%22%2C%0A%20%20%20%20%20%20%20%20%22children%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22key%22%3A%20%22%E5%8F%B6%E5%AD%90%201-1-1%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22title%22%3A%20%22%E5%8F%B6%E5%AD%90%201-1-1%22%0A%20%20%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22key%22%3A%20%22%E5%8F%B6%E5%AD%90%201-1-2%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22title%22%3A%20%22%E5%8F%B6%E5%AD%90%201-1-2%22%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%22key%22%3A%20%22%E7%AC%AC%E4%BA%8C%E7%BA%A7%201-2%22%2C%0A%20%20%20%20%20%20%20%20%22title%22%3A%20%22%E7%AC%AC%E4%BA%8C%E7%BA%A7%201-2%22%2C%0A%20%20%20%20%20%20%20%20%22children%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22key%22%3A%20%22%E5%8F%B6%E5%AD%90%201-2-1%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22title%22%3A%20%22%E5%8F%B6%E5%AD%90%201-2-1%22%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%20%20%7D%0A%5D';

export const DefaultFieldName = {
  Title: 'title',
  Key: 'key',
  Children: 'children',
}

export const placeholderTreeData = [
  {
    title: '0(搭建态占位数据)',
    key: '0',
    children: [
      {
        title: '0-0',
        key: '0-0',
        children: [
          {
            title: '0-0-1',
            key: '0-0-1',
          },
          {
            title: '0-0-2',
            key: '0-0-2',
          },
        ],
      },
      {
        title: '0-1',
        key: '0-1',
      },
    ],
  }
]

const treeDataSchema = {
  "title": "树组件数据",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "title": {
        "title": "标题",
        "description": "树节点标题",
        "type": "string"
      },
      "key": {
        "title": "字段名",
        "description": "树节点唯一的key",
        "type": "string"
      },
      "disableCheckbox": {
        "title": "禁用勾选",
        "description": "勾选场景下，需要带上这个字段",
        "type": "boolean"
      },
      "children": {
        "title": "子项",
        "type": "array",
        "description": "节点子项的数据",
        "items": {
          "type": "object"
        }
      }
    }
  }
}

const nodeDataSchema = {
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "树节点的标题"

    },
    "children": {
      "title": "子项",
      "type": "array",
      "description": "树节点的子项",
      "items": {
        "type": "object"
      }
    }
  }
}

const dragConfigSchema = {
  "type": "object",
  "properties": {
    "draggable": {
      "type": "enum",
      "description": "允许拖拽属性，可以为布尔值或者'custom'自定义节点",
      "items": [
        {
          "type": "boolean"
        },
        {
          "type": "string",
          "value": "custom"
        }
      ]
    },
    "draggableScript": {
      "description": "节点可拖拽表达式,根据表达式动态计算是否可拖拽",
      "type": "string"
    },
    "allowDrop": {
      "type": "enum",
      "description": "允许放置配置，可以为布尔值或者'custom'自定义节点",
      "items": [
        {
          "type": "boolean"
        },
        {
          "type": "string",
          "value": "custom"
        }
      ]
    },
    "allowDropScript": {
      "type": "string",
      "description": "节点可放置表达式,根据表达式动态计算是否可放置"
    },
    "useDropScope": {
      "type": "enum",
      "description": "放置范围限制,false表示无限制，parent表示父节点",
      "items": [
        {
          "type": "boolean",
          "value": false
        },
        {
          "type": "string",
          "value": "parent"
        }
      ]
    },
    "dropScopeMessage": {
      "type": "string",
      "description": "禁止放置提示语"
    }
  }
}
export const descriptionUpList = [
  {
    type: 'input',
    id: 'treeData',
    schema: treeDataSchema
  },
  {
    type: 'input',
    id: 'nodeData',
    schema: nodeDataSchema
  },
  {
    type: 'input',
    id: 'setDragConfig',
    schema: dragConfigSchema
  },
  {
    type: 'output',
    id: 'setTreeDataDone',
    schema: treeDataSchema
  },
  {
    type: 'output',
    id: 'setNodeDataDone',
    schema: nodeDataSchema
  },
  {
    type: 'output',
    id: 'setDragConfigDone',
    schema: dragConfigSchema
  },
  {
    type: 'output',
    id: 'onChange',
    schema: {
      "title": "树组件数据",
      "type": "array",
      "description": "树组件的数据",
      "items": {
        "type": "object",
        "properties": {
          "title": {
            "title": "标题",
            "type": "string",
            "description": "节点的标题"
          },
          "key": {
            "title": "字段名",
            "type": "string",
            "description": "节点的字段名"

          },
          "children": {
            "title": "子项",
            "type": "array",
            "description": "节点的子项",
            "items": {
              "type": "object"
            }
          }
        }
      }
    }
  },
  {
    type: 'output',
    id: 'returnTreeData',
    schema: {
      "title": "树组件数据",
      "type": "array",
      "description": "树的数据内容",
      "items": {
        "type": "object",
        "properties": {
          "title": {
            "title": "标题",
            "type": "string",
            "description": "节点标题"
          },
          "key": {
            "title": "字段名",
            "type": "string",
            "description": "节点字段名"
          },
          "children": {
            "title": "子项",
            "type": "array",
            "description": "节点子项",
            "items": {
              "type": "object"
            }
          }
        }
      }
    }
  },
  {
    type: 'output',
    id: 'submit',
    schema: {
      "type": "array",
      "description": "所有勾选的节点的key",
      "items": {
        "type": "string"
      }
    }
  },
  {
    type: 'output',
    id: 'click',
    schema: {
      "type": "array",
      "description": "所有选中的节点的key",
      "items": {
        "type": "string"
      }
    }
  },
  {
    type: 'output',
    id: 'returnSelectedKeys',
    schema: {
      "type": "array",
      "description": "数组结构的数据，里面包含节点的key",
      "items": {
        "type": "string"
      }
    }
  },
  {
    type: 'output',
    id: 'addNodeDone',
    schema: {
      "type": "object",
      "properties": {
        "node": {
          "type": "object",
          "title": "新增节点数据",
          "description": "新增节点数据格式",
          "properties": {
            "title": {
              "type": "string",
              "description": "新增节点的标题"
            },
            "value": {
              "type": "string",
              "description": "新增节点的值"
            },
            "key": {
              "type": "string",
              "description": "新增节点的key"
            }
          }
        },
        "parent": {
          "type": "object",
          "title": "新增节点的父节点数据",
          "description": "新增节点的父节点数据"
        }
      }
    }
  },
  {
    type: 'output',
    id: 'modify',
    schema:  treeDataSchema.items, 
  },
  {
    type: 'output',
    id: 'delete',
    schema: {
      "title": "节点数据",
      "type": "object",
      "description": "返回删除的节点数据",
      "properties": {
        "title": {
          "title": "标题",
          "type": "string",
          "description": "节点的标题"
        },
        "key": {
          "title": "字段名",
          "type": "string",
          "description": "节点的字段名"
        },
        "value": {
          "title": "值",
          "type": "string",
          "description": "节点的值"
        },
        "disableCheckbox": {
          "title": "禁用勾选",
          "type": "boolean",
          "description": "节点是否禁用勾选"
        }
      }
    }
  },
  {
    type: 'output',
    id: 'onDropDone',
    schema: {
      "type": "object",
      "properties": {
        "dragNodeInfo": {
          "title": "拖拽节点信息",
          "description": "拖拽节点相关信息",
          "type": "object",
          "properties": {
            "parent": {
              "type": "object",
              "description": "拖拽节点的父节点信息",
              "properties": {
                "title": {
                  "title": "标题",
                  "type": "string",
                  "description": "节点的标题"
                },
                "key": {
                  "title": "字段名",
                  "type": "string",
                  "description": "节点的字段名"
                }
              }
            },
            "node": {
              "type": "object",
              "description": "当前拖拽的节点信息",
              "properties": {
                "title": {
                  "title": "标题",
                  "type": "string",
                  "description": "节点的标题"
                },
                "key": {
                  "title": "字段名",
                  "type": "string",
                  "description": "节点的字段名"
                }
              }
            },
            "index": {
              "type": "number",
              "description": "当前拖拽的节点的索引"
            }
          }
        },
        "dropNodeInfo": {
          "title": "放置节点信息",
          "description": "放置位置节点信息",
          "type": "object",
          "properties": {
            "parent": {
              "type": "object",
              "description": "放置位置节点的父节点信息",
              "properties": {
                "title": {
                  "title": "标题",
                  "type": "string",
                  "description": "节点的标题"
                },
                "key": {
                  "title": "字段名",
                  "type": "string",
                  "description": "节点的字段名"
                }
              }
            },
            "node": {
              "type": "object",
              "description": "放置位置的节点",
              "properties": {
                "title": {
                  "title": "标题",
                  "type": "string",
                  "description": "节点的标题"
                },
                "key": {
                  "title": "字段名",
                  "type": "string",
                  "description": "节点的字段名"
                }
              }
            },
            "index": {
              "type": "number",
              "description": "放置位置的节点的索引"
            }
          }
        },
        "flag": {
          "title": "标识",
          "type": "enum",
          "description": "相对放置节点位置标识",
          "items": [
            {
              "type": "number",
              "value": 0
            },
            {
              "type": "number",
              "value": 1
            },
            {
              "type": "number",
              "value": -1
            }
          ]
        },
        "treeData": {
          "title": "拖拽后的树组件数据",
          "type": "array",
          "description": "拖拽后的树组件数据",
          "items": {
            "type": "object",
            "properties": {
              "title": {
                "title": "标题",
                "type": "string",
                "description": "节点的标题"
              },
              "key": {
                "title": "字段名",
                "type": "string",
                "description": "节点的字段名"
              },
              "children": {
                "title": "子项",
                "type": "array",
                "description": "节点的子项",
                "items": {
                  "type": "object"
                }
              }
            }
          }
        }
      }
    }
  }
]