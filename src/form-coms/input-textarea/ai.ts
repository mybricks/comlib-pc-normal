import { uuid } from '../../utils';

const version = ANTD_VERSION === 4 ? "" : "antd5."

export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: `多行文本输入框textarea。
表单项组件，schema=form-item`,
    usage: `data数据模型
visible: boolean
rules: array
config: {
allowClear: boolean
placeholder: string
disabled: boolean
showCount: boolean
maxLength: number
size: ['small', 'middle', 'large']
}
minRows?: number
maxRows?: number
isEditable: boolean 

schema声明
form-item

styleAry声明
输入框: .ant-input
清除按钮: .anticon-close-circle
字数统计: .ant-input-textarea-show-count::after`
  },
}