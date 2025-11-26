export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '下拉菜单，由一个文本和右侧下拉箭头组成，点击或悬浮支持弹出选项。',
    usage: `下拉菜单，由一个文本和右侧下拉箭头组成，点击或悬浮支持弹出选项
layout声明
width: 默认为100%
height: 不可配置，默认为fit-content (越等于18px，取决于提示内容的lineHeight值)

slots插槽
carrier: 自定义内容区内容（仅开启自定义后使用）
item: 动态选项区内容
`
  }
}