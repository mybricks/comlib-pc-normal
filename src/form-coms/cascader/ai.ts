export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '级联选择',
    usage: `data声明
interface FieldNames {
  label?: string;
  value?: string;
  children?: string;
}
options: any[] = []
isMultiple: boolean = false
maxTagCountType?: string = "isResponsive"
rules: any[] = []
config: antd.CascaderProps<any[]> = {
  "allowClear": true,
  "placeholder": "请选择",
  "disabled": false,
  "maxTagCount": "responsive",
  "changeOnSelect": false,
  "showSearch": false,
  "size": "middle"
}
isEditable: boolean = true
fieldNames: FieldNames = { 
  "label": "label",
  "value": "value",
  "children": "children" 
}
useLoadData: boolean = false

slots插槽
无

styleAry声明
文本内容: .ant-select-single.ant-select-show-arrow .ant-select-selection-item
  可编辑样式: font
提示内容: .ant-select-selection-placeholder
  可编辑样式: font
边框: div.ant-select:not(.ant-select-customize-input) > div.ant-select-selector
  可编辑样式: border
背景色: .ant-select:not(.ant-select-customize-input) .ant-select-selector
  可编辑样式: background
清除按钮: .ant-select-allow-clear .ant-select-clear
  可编辑样式: font、background
下拉图标: .ant-select-arrow
  可编辑样式: font
标签: .ant-select-multiple .ant-select-selection-item
  可编辑样式: font、background
标签-关闭图标: .ant-select-multiple .ant-select-selection-item-remove
  可编辑样式: font
下拉区域: .{id} .ant-cascader-menu
  可编辑样式: background
选项: .{id} .ant-cascader-menu-item
  可编辑样式: font、background
多选节点: .{id} .ant-cascader-checkbox-inner
  可编辑样式: border、background
展开图标: .{id} .ant-cascader-menu-item-expand-icon
  可编辑样式: font
边框hover: div.ant-select:not(.ant-select-customize-input) > div.ant-select-selector:hover
  可编辑样式: border
清除按钮hover: .anticon-close-circle:hover
  可编辑样式: font
标签-关闭图标hover: .ant-select-multiple .ant-select-selection-item-remove:hover
  可编辑样式: font
选项hover: .{id} .ant-cascader-menu-item:hover
  可编辑样式: font、background
多选节点hover: .{id} .ant-cascader-checkbox-wrapper:hover .ant-cascader-checkbox-inner, .ant-cascader-checkbox:not(.ant-cascader-checkbox-checked):hover .ant-cascader-checkbox-inner
  可编辑样式: border、background
边框focus: div.ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) > div.ant-select-selector
  可编辑样式: border、BoxShadow
选项focus: .{id} .ant-cascader-menu-item-active:not(.ant-cascader-menu-item-disabled), .ant-cascader-menu-item-active:not(.ant-cascader-menu-item-disabled):hover
  可编辑样式: font、background
多选节点focus: .{id} .ant-cascader-checkbox-checked .ant-cascader-checkbox-inner
  可编辑样式: border、background
表单项禁用: .ant-select-disabled.ant-select:not(.ant-select-customize-input) .ant-select-selector
  可编辑样式: border、background
`
  }
}