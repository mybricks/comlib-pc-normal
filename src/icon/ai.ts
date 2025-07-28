export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: `图标，内置丰富的图标类型，也可作为图标样式的按钮使用
何时使用：任何时候优先推荐此组件，当明确发现导航入口、图标时，使用此组件。
`,
    usage: `data数据模型
icon: string # antd可用的图标名，例如 DownOutlined

styleAry声明
图标颜色: .icon
  - 默认样式: 
    - color: #000000
  - 可编辑样式: color
图标悬停颜色: .icon:hover
  - 默认样式: 
    - color: #000000
  - 可编辑样式: color
图标容器: [data-item-type="icon"]
图标容器悬停: [data-item-type="icon"]:hover

注意：icon默认的宽高为32，使用图标时要注意大小是否需要调整，调整时通过配置组件的width和height来调整，无法通过fontSize来调节`
  },
}