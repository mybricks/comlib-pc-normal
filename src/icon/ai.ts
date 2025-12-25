export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: `图标，内置丰富的图标类型，也可作为图标样式的按钮使用
何时使用：任何时候优先推荐此组件，当明确发现导航入口、图标时，使用此组件。
`,
    usage: `图标，内置丰富的图标类型，也可作为图标样式的按钮使用
何时使用：任何时候优先推荐此组件，当明确发现导航入口、图标时，使用此组件。

data数据模型
icon: string # antd可用的图标名，例如 DownOutlined

配置流程：
  1. 配置layout.width为图标大小，比如需要一个20*20的图标则配置width=20；
  2. 配置layout.height=fit-content，图标组件只能配置fit-content；
  3. 考虑是否要配置样式，比如内间距、背景色、圆角、边框；
    - 常见效果：单色图标、带背景色圆角图标。

注意：icon默认的宽度为32，使用图标时要注意大小是否需要调整，调整时通过配置组件的width来调整，无法通过fontSize来调节。`
  },
}