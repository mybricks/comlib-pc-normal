export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: `开关Switch。
表单项组件，schema=form-item`,
    usage: `开关Switch。
表单项组件，schema=form-item

data数据模型
visible: boolean
rules: array
textMap?: {
  开启时: string # 空字符串代表不展示
  关闭时: string # 空字符串代表不展示
}
config: { 
  disabled: boolean
  size: ['small', 'middle']
}

schema声明
form-item

layout声明
width: 可配置，默认为100%，实际宽度为元素的宽度
height: 不可配置，默认为fit-content

styleAry声明
默认状态: .ant-switch
  - 默认样式
    - height: 22px
    - backgroundColor: rgba(0, 0, 0, 0.25)
  - 可配置样式: backgroundColor
激活背景: .ant-switch-checked
  - 默认样式
    - height: 22px
    - backgroundColor: #1677FF
  - 可配置样式: backgroundColor
`
  },
  modifyTptJson: (component) => {
   
  }
}