import { Data } from './runtime';

export const InputIds = {
  SetOptions: 'setOptions'
};

export const OutputIds = {
  SetOptionsDone: 'setOptionsDone'
};

export const refreshSchema = (props: EditorResult<Data>) => {
  const { data, input, output } = props;
  const { label, value, children } = data.fieldNames;
  const optionsSchema = {
    title: '输入数据源数据',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        [label || 'label']: {
          title: '标题',
          type: 'string'
        },
        [value || 'value']: {
          title: '字段名',
          type: 'string'
        },
        disabled: {
          title: '禁用勾选',
          type: 'boolean'
        },
        [children || 'children']: {
          title: '子项',
          type: 'array',
          items: {
            type: 'object'
          }
        }
      }
    }
  };
  input.get(InputIds.SetOptions)?.setSchema(optionsSchema);
  output.get(OutputIds.SetOptionsDone)?.setSchema(optionsSchema);
};

export const descriptionUpList = [
  {
    type: "input",
    id: "setValue",
    schema: {
      "type": "array",
      "description": "设置对应选中项的值",
      "items": {
        "type": "any"
      }
    }
  },
  {
    type: "input",
    id: "setInitialValue",
    schema: {
      "type": "array",
      "description": "设置对应选中项的初始值",
      "items": {
        "type": "any"
      }
    }
  },
  {
    type: "input",
    id: "setOptions",
    schema: {
      "title": "输入数据源数据",
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "value": {
            "title": "值",
            "description": "选项值",
            "type": "any"
          },
          "label": {
            "title": "名称",
            "description": "选项标签（一般展示）",
            "type": "string"
          },
          "disabled": {
            "title": "禁用",
            "description": "选项禁用，true为禁用",
            "type": "boolean"
          },
          "children": {
            "title": "子项",
            "description": "子项内容，逐级嵌套",
            "type": "array",
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
    type: "input",
    id: "setValidateInfo",
    schema: {
      "type": "object",
      "properties": {
        "validateStatus": {
          "type": "enum",
          "descriptions": "校验状态，成功/失败",
          "items": [
            {
              "type": "string",
              "value": "success"
            },
            {
              "type": "string",
              "value": "error"
            }
          ]
        },
        "help": {
          "type": "string"
        }
      }
    }
  },
  {
    type: "output",
    id: "returnValidate",
    schema: {
      "type": "object",
      "properties": {
        "validateStatus": {
          "title": "校验状态",
          "description": "校验状态，成功/失败",
          "type": "string"
        },
        "help": {
          "title": "校验提示",
          "description": "帮助提示文案",
          "type": "string"
        }
      }
    }
  },
  {
    type: "output",
    id: "setOptionsDone",
    schema: {
        "type": "object",
        "properties": {
          "value": {
            "title": "值",
            "description": "选项值",
            "type": "any"
          },
          "label": {
            "title": "名称",
            "description": "选项标签（一般展示）",
            "type": "string"
          },
          "disabled": {
            "title": "禁用",
            "description": "选项禁用，true时禁用",
            "type": "boolean"
          },
          "children": {
            "title": "子项",
            "description": "子项内容，逐级嵌套",
            "type": "array",
            "items": {
              "type": "object",
              "properties": {}
            }
          }
        }
      }
  },
  {
    type: "output",
    id: "setValidateInfoDone",
    schema: {
      "type": "object",
      "properties": {
        "validateStatus": {
          "type": "enum",
          "descriptions": "校验状态，成功/失败",
          "items": [
            {
              "type": "string",
              "value": "success"
            },
            {
              "type": "string",
              "value": "error"
            }
          ]
        },
        "help": {
          "type": "string"
        }
      }
    }
  }
]