export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: `下拉框Select。
表单项组件，schema=form-item`,
    usage: `下拉框Select。
表单项组件，schema=form-item

schema声明
form-item
`
  },
  editors: [
    '常规/提示内容',
    '常规/选择框最大高度',
    '常规/选择框弹出位置',
    '常规/下拉框模式',
    '常规/标签过多时省略',
    '常规/显示清除图标',
    '常规/静态选项配置',

    '样式/文本内容',
    '样式/提示内容',
    '样式/边框',
    '样式/背景色',
    '样式/下拉图标',
    '样式/选项',
    '样式/下拉区背景',
    '样式/Hover/边框',
    '样式/Focus/边框',
  ]
}