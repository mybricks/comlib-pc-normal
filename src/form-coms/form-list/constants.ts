export const SlotIds = {
  FormItems: 'formItems'
};

export const SlotInputIds = {
  ON_CHANGE: 'onChange',
  CUR_VALUE: 'curValue',
  VALIDATE_TRIGGER: 'validateTrigger',
};

export const OutputIds = {
  ON_CLICK_ADD: 'add',
  ON_CLICK_REMOVE: 'remove',
};

export const InputIds = {
  AddField: 'addField',
  RemoveField: 'removeField',
  ModifyField: 'modifyField'
};

export const labelWidthTypes = {
  SPAN: 'span',
  PX: 'px'
}

export const fieldItemPropsSchema = {
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
  }
}