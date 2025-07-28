export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: `开关Switch。
表单项组件，schema=form-item`,
    usage: `data数据模型
visible: boolean
rules: array
textMap: {
开启时: string
关闭时: string
config: { 
disabled: boolean
size: ['small', 'middle']
}
isEditable: boolean

schema声明
form-item

styleAry声明
控件: .ant-switch-handle:before
文案: .ant-switch-inner
激活状态: .ant-switch-checked
非激活状态: .ant-switch
禁用状态: .ant-switch-disabled`
  }
}