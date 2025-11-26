export default {
  ignore: true,
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: `自动完成，自动完成是一个带提示的文本输入框, 用户可以自由输入, 关键词是辅助输入 AutoComplete。
表单项组件，schema=form-item`,
    usage: `data声明
interface Option {
  value: string;
  label: string;
}
options: Option[] = []
rules: any[] = []
isFilter: boolean = false
isOnSearch: boolean = false
config: {
  placeholder: string;
  allowClear: boolean;
  disabled: boolean;
} = {
  "allowClear": true,
  "placeholder": "请输入",
  "disabled": false
}
filterRule: 'value' | 'label' | 'all' = "value"

layout声明
width: 默认为100%
height: 不可配置，默认为fit-content (约等于32px)

slots插槽
无

styleAry声明
无
`
  }
}