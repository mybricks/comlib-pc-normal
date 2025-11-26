export default {
  ignore: true,
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '轮播图',
    usage: `data声明
title: string = "标题"

slots插槽
content: 内容区内容
extra: 右上角操作区内容
customTitle: 标题区内容

styleAry声明
无
`
  }
}