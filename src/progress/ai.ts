export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '进度条',
    usage: `data数据模型
percent: number # 进度百分比
type: ['line', 'circle', 'dashboard']
isShow: boolean
status: ['success', 'exception', 'normal', 'active']
strokeColor: string
isSteps: boolean # 是否步骤进度条
steps: number # 步骤数
isColor: boolean # 是否自定义颜色
size: ['default', 'small']
circleSize: number
strokeWidth: number
trailColor: string
`
  },
}