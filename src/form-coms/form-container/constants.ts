export const inputIds = {
  SET_FIELDS_VALUE: 'setFieldsValue',
  SUBMIT: 'submit',
  RESET_FIELDS: 'resetFields',
  SUBMIT_AND_MERGE: 'submitAndMerge',
  SET_INITIAL_VALUES: 'setInitialValues',
  SET_FORM_ITEMS_PROPS: 'setFormItemsProps',
  SET_DISABLED: 'setDisabled',
  SET_ENABLED: 'setEnabled',
  GET_FIELDS_VALUE: 'getFieldsValue',
  // 校验
  VALIDATE_FIELDS: 'validateFields',
  SET_VALIDATE_INFO: 'setValidateInfo',
  //禁用/启用
  SetDisable: 'setDisable',
  SetEnable: 'setEnable',
  IsEnable: 'isEnable',

  //显示/隐藏
  SetHidden: 'setHidden',
  SetShow: 'setShow',

  setValue: 'setValue',
  setInitialValue: 'setInitialValue',
  resetValue: 'resetValue',

  // 编辑/只读
  isEditable: 'isEditable',

  // 动态设置表单项
  setDynamicFormItems: 'setDynamicFormItems',

  // 设置数据源
  setFieldsSource: 'setFieldsSource'
}

export const outputIds = {
  ON_FINISH: 'onFinish',
  ON_SUBMIT_ERROR: 'onSubmitError',
  ON_RESET_FINISH: 'onResetFinish',
  ON_CLICK_SUBMIT: 'onClickSubmit',
  ON_CLICK_CANCEL: 'onClickCancel',
  ON_MERGE_FINISH: 'onMergeFinish',
  ON_VALUES_CHANGE: 'onValuesChange',
  RETURN_VALUES: 'returnValues',
  ON_VALIDATE: 'onValidate',
  ON_COLLAPSE: 'onCollapse',

  setValueDone: "setValueDone",
  setInitialValueDone: "setInitialValueDone",
  resetValueDone: "resetValueDone",
  setDisabledDone: "setDisabledDone",
  setEnabledDone: "setEnabledDone",
  isEnableDone: "isEnableDone",
  setColorDone: "setColorDone",
  setOptionsDone: "setOptionsDone",
  setValidateInfoDone: "setValidateInfoDone",

  // 编辑/只读
  isEditableDone: "isEditableDone",

  // 动态设置表单项完成
  setDynamicFormItemsDone: 'setDynamicFormItemsDone',

  // 设置数据源完成
  setFieldsSourceDone: 'setFieldsSourceDone'
}

export const slotInputIds = {
  SET_FIELDS_VALUE: 'setFieldsValue',
  VALIDATE_TRIGGER: 'validateTrigger',
  ON_CHANGE: 'onChange',
  SET_FIELDS_SOURCE: 'setFieldsSource'
}

export const labelWidthTypes = {
  SPAN: 'span',
  PX: 'px'
}

export const formItemPropsSchema = {
  hiddenLabel: {
    type: 'boolean',
    title: '隐藏标题'
  },
  label: {
    type: 'string',
    title: '标题'
  },
  tooltip: {
    type: 'string',
    title: '标题提示'
  },
  description: {
    type: 'string',
    title: '提示语'
  },
  // widthOption: {
  //   type: 'string',
  //   title: '宽度模式'
  // },
  span: {
    type: 'number',
    title: '栅格宽度'
  },
  width: {
    type: 'number',
    title: '像素宽度'
  },
  // inlinePadding: {
  //   type: 'tuple',
  //   items: [
  //     {
  //       "type": "number",
  //       title: '上'
  //     },
  //     {
  //       "type": "number",
  //       title: '右'
  //     },
  //     {
  //       "type": "number",
  //       title: '下'
  //     },
  //     {
  //       "type": "number",
  //       title: '左'
  //     },
  //   ],
  //   title: '边距'
  // },
  labelWidth: {
    type: 'number',
    title: '标题自定义宽度'
  },
  labelAutoWrap: {
    type: 'boolean',
    title: '标题是否换行'
  },
  labelAlign: {
    type: 'boolean',
    title: '标题对齐方式'
  },
  colon: {
    type: 'boolean',
    title: '标题冒号'
  },
  required: {
    type: 'boolean',
    title: '必填样式'
  },
  labelStyle: {
    type: 'object',
    title: '标签样式'
  },
  descriptionStyle: {
    type: 'object',
    title: '提示语样式'
  },
  disabled: {
    type: 'boolean',
    title: '是否禁用'
  },
  // visible: {
  //   type: 'boolean',
  //   title: '是否显示'
  // },
}

/** 一些公有的表单类组件，更新的schema */
export const commonFormItemUpdateSchema = [
  {
    type: 'input',
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
          "description": "帮助提示信息",
          "type": "string"
        }
      }
    }
  },
  {
    type: 'output',
    id: "returnValidate",
    schema: {
      "type": "object",
      "properties": {
        "validateStatus": {
          "title": "校验状态",
          "type": "string",
          "description": "校验状态，成功/失败"
        },
        "help": {
          "title": "校验提示",
          "type": "string",
          "description": "帮助提示文案"
        }
      }
    }
  },
  {
    type: 'output',
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
          "description": "帮助提示信息",
          "type": "string"
        }
      }
    }
  }
]


export const commonDynamicItemSchema = {
  "type": "object",
  "description": "表单项配置",
  "properties": {
    "disabled": {
      "type": "boolean",
      "description": "是否禁用"
    },
    "required": {
      "type": "boolean",
      "description": "表单项是否有必填样式"
    },
    "tooltip": {
      "type": "string",
      "description": "表单项标题的提示信息，问号图标移上去有提示"
    },
    "description": {
      "type": "string",
      "description": "展示在表单项下方的提示内容"
    },
    "labelAutoWrap": {
      "type": "boolean",
      "description": "标题是否换行"
    },
    "labelStyle": {
      "type": 'object',
      "title": '标签样式',
      "description": "标签样式"
    },
    "descriptionStyle": {
      "type": 'object',
      "title": '提示语样式',
      "description": "提示语样式"
    },
    "colon": {
      "type": 'boolean',
      "title": '标签冒号',
      "description": "标签后面是否有冒号"
    },
    "fieldSource": {
      "type": "any",
      "title": "表单项数据源，非必填，按钮、下拉框、树选择等组件一般具有数据源",
      "description": "格式一般为数组，取决于表单项对应的组件，所需要的数据源格式"
    }
  }
}