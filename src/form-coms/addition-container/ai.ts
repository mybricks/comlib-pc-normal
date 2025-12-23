export default {
  ':root'({ data }) {
    return {}
  },
  prompts: {
    summary: `自定义内容项，内部支持渲染任意子元素来自定义UI，不可用form-container进行通信
何时使用：仅在现有其他表单项UI不能满足用户需求时，用自定义内容项可以渲染特殊样式的UI，在formContainer被推荐时可以推荐，schema=form-item。`,
    usage: `自定义表单项，内部支持渲染任意子元素来自定义UI，不可用form-container进行通信
何时使用：仅在现有其它表单项UI不能满足用户需求时，用自定义内容项可以渲染特殊样式的UI，schema=form-item。

  schema声明
  form-item

  slots插槽
  form-addition-container: 内容，默认插槽flexDirection为column。
    注意：如需复杂布局请先添加布局组件到插槽中。

  UI组成：默认添加到表单中仅为一个空插槽，用于添加各类UI组件来实现自定义UI。`
  }
};