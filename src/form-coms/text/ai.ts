export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: `单行文本输入框。
表单项组件，schema=form-item`,
    usage: `data数据模型
visible: boolean = true
rules: []
validateTrigger: ['onBlur', 'onPressEnter']
config: {
allowClear: boolean = true
placeholder: string = '请输入内容' 
disabled: boolean = false
addonBefore: string # 前置标签
addonAfter: string # 后置标签
showCount: boolean = false
maxLength: number = -1
size: ['middle', 'small', 'large']
}
isEditable: boolean = true

slots插槽
无

schema声明
form-item

layout声明
width: 默认为100%
height: 不可配置，默认为fit-content (约等于32px)

styleAry声明
表单项: .ant-input-affix-wrapper
文本: .ant-input
清除按钮: .anticon-close-circle
前置标签: .ant-input-group-addon:first-child
后置标签: .ant-input-group-addon:last-child
前缀图标: .ant-input-prefix > .anticon
后缀图标: .anticon`
  }
}