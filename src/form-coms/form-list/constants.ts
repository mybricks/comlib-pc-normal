export const SlotIds = {
  FormItems: 'formItems'
};

export const SlotInputIds = {
  ON_CHANGE: 'onChange',
};

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
  // visible: {
  //   type: 'boolean',
  //   title: '是否显示'
  // },
}