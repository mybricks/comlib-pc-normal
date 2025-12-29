export default {
  ':root'({ data }) {
    return {}
  },
  prompts: {
    summary: `自定义表单项，内部支持渲染任意子元素，可与form-container进行通信
何时使用：仅在现有其他表单项不能满足用户需求时，用自定义表单项可以渲染特殊样式的UI，需要和form-container(表单容器)一起使用，不能单独使用，，schema=form-item。`,
    usage: `自定义表单项，内部支持渲染任意子元素，可与form-container进行通信
何时使用：仅在现有其它表单项不能满足用户需求时，用自定义表单项可以渲染特殊样式的UI，schema=form-item。

  schema声明
  form-item

  slots插槽
  formItem: 内容，默认插槽flexDirection为column。
    注意：如需复杂布局请先添加布局组件到插槽中。

  UI组成：
  默认添加到表单中会包含一个标题，剩余部分则是一个插槽，用于添加各类UI组件来实现自定义表单项。
  `
  }
}