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

styleAry声明
选项标签: label.ant-radio-wrapper
选择框: .ant-radio-inner
选项: .ant-space-item .ant-radio-wrapper
按钮样式: .ant-radio-button-wrapper`
  },
}