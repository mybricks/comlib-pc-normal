export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: `多选勾选框 Checkbox。
表单项组件，schema=form-item`,
    usage: `data声明
config: {
  options: antd.CheckboxOptionType[];
  disabled: boolean;
} = {
  "options": [
    {
      "label": "选项1",
      "value": "选项1",
      "type": "default",
      "checked": false,
      "key": "option1"
    }
  ],
  "disabled": false
}
staticOptions: antd.CheckboxOptionType[] = [
  {
    "label": "选项1",
    "value": "选项1",
    "type": "default",
    "checked": false,
    "key": "option1"
  }
]
checkAll: boolean = false
layout: 'vertical' | 'horizontal' = "horizontal"
checkAllText: string = "全选"
isEditable: boolean = true
isIndeterminate: boolean = false
eventBubble?: boolean = false
outputValueType: 'value' | 'option' = "value"

slots插槽
无

styleAry声明
选择框: .ant-checkbox-inner
  可编辑样式: border、background、opacity
全选框: .checkbox > .ant-checkbox-wrapper
  可编辑样式: background、border
选项: .ant-checkbox-group .ant-checkbox-group-item
  可编辑样式: background、border
选项标签: label.ant-checkbox-wrapper > span:nth-child(2)
  可编辑样式: font
选择框hover: .ant-checkbox:hover .ant-checkbox-inner
  可编辑样式: border、background、opacity
全选框hover: .checkbox > .ant-checkbox-wrapper:hover
  可编辑样式: background、border
选项hover: .ant-checkbox-group .ant-checkbox-group-item:hover
  可编辑样式: background、border
选择框选中: .ant-checkbox-checked .ant-checkbox-inner
  可编辑样式: border、BoxShadow、background、opacity
全选框选中: .checkbox > .ant-checkbox-wrapper-checked
  可编辑样式: background、border
选项选中: .ant-checkbox-group .ant-checkbox-wrapper-checked
  可编辑样式: background、border
选项标签选中: label.ant-checkbox-wrapper.ant-checkbox-wrapper-checked > span:nth-child(2)
  可编辑样式: font
选择框勾选符号选中: .ant-checkbox-checked:not(.ant-checkbox-disabled) .ant-checkbox-inner:after
  可编辑样式: border
选择框禁用: .ant-checkbox.ant-checkbox-disabled .ant-checkbox-inner
  可编辑样式: border、background、opacity
全选框禁用: .checkbox > .ant-checkbox-wrapper-disabled
  可编辑样式: background、border
选项禁用: .ant-checkbox-group>.ant-checkbox-wrapper-disabled
  可编辑样式: background、border
选择框勾选符号禁用: .ant-checkbox.ant-checkbox-disabled .ant-checkbox-inner:after
  可编辑样式: border
选项标签禁用: label.ant-checkbox-wrapper.ant-checkbox-wrapper-disabled > span:nth-child(2)
  可编辑样式: border
`
  }
}