export const descriptionUpList = [
  {
    type: 'input',
    id: 'setOptions',
    schema: {
      "type": "array",
      "description":"树形选择结构的下拉框列表数据",
      "items": {
        "type": "object",
        "properties": {
          "label": {
            "title": "标签",
            "type": "string",
            "description": "选项的标签"
          },
          "value": {
            "title": "值",
            "type": "string",
            "description": "选项的值"
          },
          "isLeaf": {
            "title": "是否叶子节点",
            "type": "boolean",
            "description": "是否是叶子节点"
          },
          "children": {
            "title": "子项",
            "type": "array",
            "description": "节点的子节点数组数据",
            "items": {
              "type": "object",
              "properties": {}
            }
          }
        }
      }
    }
  },
  {
    type: 'input',
    id: 'setLoadData',
    schema: {
      "type": "object",
      "description": "异步加载数据结构",
      "properties": {
        "label": {
          "title": "标签",
          "type": "string",
          "description": "选项的标签"
        },
        "value": {
          "title": "值",
          "type": "string",
          "description": "选项的值"
        },
        "isLeaf": {
          "title": "是否叶子节点",
          "type": "boolean",
          "description": "是否是叶子节点"
        },
        "children": {
          "title": "子项",
          "type": "array",
          "description": "节点的子节点数组数据",
          "items": {
            "type": "object",
            "properties": {}
          }
        }
      }
    },
  },
  {
    type: 'output',
    id: "loadData",
    schema: {
      "type": "object",
      "description":"异步加载数据，输出",
      "properties": {
        "label": {
          "title": "标签",
          "type": "string"
        },
        "value": {
          "title": "值",
          "type": "string"
        }
      }
    }
  },
  {
    type: 'output',
    id: "setOptionsDone",
    schema: {
      "description":"设置数据源完成后，输出数据源数据",
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "label": {
            "title": "标签",
            "type": "string",
            "description": "选项的标签"
          },
          "value": {
            "title": "值",
            "type": "string",
            "description": "选项的值"
          },
          "isLeaf": {
            "title": "是否叶子节点",
            "type": "boolean",
            "description": "是否是叶子节点"
          },
          "children": {
            "title": "子项",
            "type": "array",
            "description": "节点的子节点数组数据",
            "items": {
              "type": "object",
              "properties": {}
            }
          }
        }
      }
    }
  },
  {
    type: 'output',
    id: "setLoadDataDone",
    schema: {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "label": {
            "title": "标签",
            "type": "string",
            "description": "选项的标签"
          },
          "value": {
            "title": "值",
            "type": "string",
            "description": "选项的值"
          },
          "isLeaf": {
            "title": "是否叶子节点",
            "type": "boolean",
            "description": "是否是叶子节点"
          },
          "children": {
            "title": "子项",
            "type": "array",
            "description": "节点的子节点数组数据",
            "items": {
              "type": "object",
              "properties": {}
            }
          }
        }
      }
    }
  },
]