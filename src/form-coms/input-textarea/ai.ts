export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: `多行文本输入框textarea。
表单项组件，schema=form-item`,
    usage: `多行文本输入框textarea。
表单项组件，schema=form-item

schema声明
form-item
`
  },
  editors: [
    '常规/提示内容',
    '常规/显示清除图标',
    '常规/触发提交方式',
    '常规/行数限制',
    '常规/显示字数',
    '常规/内容最大长度',
    '样式/文本内容',
    '样式/背景色',
    '样式/提示内容',
    '样式/边框',
    '样式/字数',
    '样式/Hover/边框'
  ]
}