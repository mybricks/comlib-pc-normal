export default {
  ':root'({ data }) {
    return {}
  },
  prompts: {
    summary: `自定义表单项，内部支持渲染任意子元素来自定义UI，最终与formContainer通信完成表单信息的收集和渲染
何时使用：仅在现有其他表单项UI不能满足用户需求时，用自定义表单项可以渲染特殊样式的UI，在formContainer被推荐时可以推荐，schema=form-item。`,
    usage: `自定义表单项，内部支持渲染任意子元素来自定义UI，最终与formContainer通信完成表单信息的收集和渲染
何时使用：仅在现有其它表单项UI不能满足用户需求时，用自定义表单项可以渲染特殊样式的UI，代价是配置变复杂，非必要不使用，schema=form-item。

  
  schema声明
  form-item

  slots插槽
  formItem: 内容`
  }
}