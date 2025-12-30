export default {
  ignore: true,
  ':root'({ data }) {
    return {}
  },
  prompts: {
    summary: `自定义内容项，内部支持渲染任意子元素来自定义UI，不可与form-container进行通信
何时使用：用自定义内容项可以渲染特殊样式的UI，需要和form-container(表单)一起使用，不能单独使用，schema=form-item。`,
    usage: `自定义表单项，内部支持渲染任意子元素来自定义UI，不可与form-container进行通信
何时使用：
  仅在表单中间要渲染一些特殊UI时使用，比如分割线等不属于表单项的UI。
何时禁止使用：
  禁止用于标题等非表单区域内容的渲染；

  schema声明
  form-item

  slots插槽
  form-addition-container: 内容，默认插槽flexDirection为column。
    注意：如需复杂布局请先添加布局组件到插槽中。

  UI组成：
  默认添加到表单中仅为一个空插槽，用于添加各类UI组件来实现自定义UI。`
  }
};