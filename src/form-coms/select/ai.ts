export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '下拉框',
    usage: `data数据模型
config: {
placeholder: string = '请选择'
mode: ['default', 'multiple', 'tags']
showArrow: boolean = true
size: ['small', 'middle', 'large']
}
staticOptions: []

schema声明
form-item

styleAry声明
选择器: .ant-select-selector
下拉箭头: .ant-select-arrow
清除按钮: .ant-select-clear
选项: .ant-select-item-option
标签: .ant-select-selection-item
`
  },
  modifyTptJson: (component) => {
    if(!component.data){
      component.data = {}
    }
    component.data = {
      showSearch: true,
      optionFilterProp: 'label',
      mode: 'default',
      showArrow: true,
      isEditable: true,
      mount: 'body',
      dropdownMatchSelectWidth: true,
      filterOption: true
    }
  }
}