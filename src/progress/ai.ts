export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '进度条，有进度条和进度圈两种类型，由进度条和进度条文本组成，进度条文本为进度条的百分比。',
    usage: `进度条，有进度条和进度圈两种类型，由进度条和进度条文本组成，进度条文本为进度条的百分比。
data数据模型
percent: number
type?: ['line', 'circle'] = "line"
isShow?: boolean = true # 是否显示进度值
strokeColor?: string = #1677ff # 进度条颜色
circleSize?: number = 120 # 进度圈大小
strokeWidth?: number = 6 # 进度条线宽度
trailColor?: string # 进度条背景色

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