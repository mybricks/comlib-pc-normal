export default {
  // ignore: true,
  prompts: {
    summary: '基础布局组件，可以用做布局组件和背景样式容器，必须使用',
    usage: `基础布局组件，可以用做布局组件和背景样式容器，必须使用。

slots插槽
content 内容

layout声明
width: 可配置，默认100%；
height: 可配置，当display=flex时，可以配置fit-content，其余为固定数值；

配置步骤
- 确认布局：确认当前布局信息，必须配置；
- 根据布局完成宽高配置：
  - 当声明display=flex时，layout属性宽高需遵循下方类型定义配置:
    width: number(固定px) | '100%' ｜ 'fit-content'
    height: number(固定px) | 'fit-content'
  - 当声明position=smart时，layout属性宽高需遵循下方类型定义配置:
    width: number(固定px) | '100%'
    height: number(固定px)
- 根据需求完成其它layout和样式配置；
`,
  },
  editors: [
    '常规/布局',
    '样式/默认/默认',
    '样式/Hover/Hover'
  ]
}