export default {
  prompts: {
    summary: '按钮，必须推荐此组件',
    usage: `按钮，对标antd的按钮组件

layout声明
width: 可配置，建议配置固定宽高
height: 可配置，建议配置固定宽高

slots插槽
无

styleAry声明
默认: .button
  - 默认样式:
    - backgroundColor: 随type类型而变化，antd按钮的背景
    - color: 随type类型而变化，antd按钮的文本颜色
    - borderRadius: 6px
    - padding: 16px
    - fontSize: 14px
  - 可编辑样式: font、color、borderRadius、padding、backgroundColor、backgroundImage
  注意：backgroundImage可配置渐变色。
`
  },
  editors: [
    '按钮/文字标题',
    '按钮/图标',
    '按钮/图标配置/图标库',
    '按钮/图标配置/图标位置',
    // '按钮/图标配置/尺寸',
    '按钮/图标配置/间距',
    '样式/风格',
    '样式/危险按钮',
    '样式/形状',
    '样式/默认/按钮',
    '样式/Hover/按钮',
    '样式/激活/按钮'
  ]
}