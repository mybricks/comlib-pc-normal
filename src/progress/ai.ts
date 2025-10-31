export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '进度条，有进度条和进度圈两种类型，由进度条和进度条文本组成，进度条文本为进度条的百分比。',
    usage: `进度条，有进度条和进度圈两种类型，由进度条和进度条文本组成，进度条文本为进度条的百分比。

layout声明
width: 可配置，默认为100%，实际宽度为元素的宽度
height: 不可配置，默认为fit-content
`
  },
  modifyTptJson: (component) => {
    if (component.data.strokeColor || component.data.trailColor) {
      component.data.isColor = true
    }
  }
}