export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: `下拉框Select。
表单项组件，schema=form-item`,
    usage: `下拉框Select。
表单项组件，schema=form-item

schema声明
form-item
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