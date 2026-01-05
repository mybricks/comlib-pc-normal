export default {
  // ignore: true,
  prompts: {
    summary: '基础布局组件，可以用做布局组件和背景样式容器，必须使用',
    usage: `基础布局组件，可以用做布局组件和背景样式容器，必须使用。

slots插槽
content 内容

layout声明
width: 可配置，默认100%；
height: 可配置，仅在display=flex时，可以配置fit-content，其余为固定数值；


<配置流程>
  1. 确认当前布局需要使用什么布局，是flex还是absolute，必须先配置才可以使用此组件；
  2. 由于宽度、高度都和布局相关，需要根据确认的布局，完成宽高的配置；
    2.1 当声明display=absolute时，layout属性宽高需遵循下方类型定义配置:
      width: number(固定px) | '100%'
      height: number(固定px)

      特别注意：display=absolute时，不允许配置padding；

    2.2 当声明display=flex时，layout属性宽高需遵循下方类型定义配置:
      width: number(固定px) | '100%' ｜ 'fit-content'
      height: number(固定px) | 'fit-content'

  3. 根据需求完成其它layout和样式配置；
</配置流程>
`,
  },
  editors: [
    '常规/布局',
    // {
    //   title: '常规/类型',
    //   type: 'switch',
    //   description: '这是一个类型',
    //   value: {
    //     set: ({ data, slots }) => {

    //     }
    //   }
    // },
    '样式/默认/默认',
    '样式/Hover/Hover'
  ]
//   ':root' ({ data }) {
//     return {}
//   },
//   prompts: {
//     summary: '自定义容器',
//     usage: `data声明
// style: React.CSSProperties = {}
// slotStyle?: React.CSSProperties = {
//   "position": "smart"
// },
// legacyConfigStyle: React.CSSProperties = {}
// legacyStyle: React.CSSProperties = {}
// isAutoScroll: boolean = false
// direction: 'horizontal'|'vertical' "vertical"
// scrollTime: number = 2000
// eventBubble: boolean = false

// slots插槽
// content: 内容区内容

// styleAry声明
// 容器: > .root
//   可编辑样式: padding、border、background、overflow、BoxShadow
// 容器hover: > .root:hover
//   可编辑样式: padding、border、background、BoxShadow
// `
//   }
}