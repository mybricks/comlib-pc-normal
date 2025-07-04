import { uuid } from '../../utils';

const version = ANTD_VERSION === 4 ? "" : "antd5."

export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '单选框',
    usage: `data数据模型
visible: boolean
staticOptions: [
{
  label: string
  value: string
  type: string
  checked: boolean
  key: string
}
]
config: {
options: array
disabled: boolean
size: ['small', 'middle', 'large']
}
layout: ['horizontal', 'vertical']
enableButtonStyle: boolean
buttonStyle: string 
isEditable: boolean

schema声明
form-item

layout声明
width: 默认为100%
height: 默认为fit-content，不可配置

styleAry声明
选项标签: label.ant-radio-wrapper
  - 可编辑样式: font
选择框: .ant-radio-inner
  - 可编辑样式: border、background

按钮样式: .ant-radio-button-wrapper
  - 可编辑样式: font、border、background
选中按钮样式: .ant-radio-button-wrapper-checked
  - 可编辑样式: font、border、background
`
  },
}