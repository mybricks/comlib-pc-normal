export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '列表容器，循环列表组件，用于动态数据列表的实现，支持横排和竖排展示，支持换行',
    usage: `列表容器，循环列表组件，用于动态数据列表的实现，支持横排和竖排展示，支持换行
    
data数据模型
direction: ['row', 'column'] = 'column'
wrap: boolean = true
grid: {
  gutter: [number, number] = [0, 16] # 间距[水平,垂直]
}
rowKey: string = "id" #列表项唯一标志

layout声明
width: 默认为100%
height: 不可配置，fit-content

slots插槽
item # 列表项插槽

注意：
- 在列表中，插槽仅放置一个*宽度和高度是固定px值（不允许使用100%）*的组件，因为列表会遍历这个组件，不要开发多个，仅需开发一个示例即可；
- 宽高固定值 + 间距，决定了这是一个几行几列的列表，请注意不要超过外层组件宽高；
- 对于静态数据的列表，不要使用循环列表，用基础组件开发多个示例；`
  },
  // modifyTptJson: (component) => {
  //   if (!component.data) {
  //     component.data = {}
  //   }

  //   component.data.layout = component.data?.direction === 'row' ? 'horizontal' : 'vertical'
  //   delete component.data?.direction
  //   if (component.data.layout === 'vertical') {
  //     component.data.itemWidth = '100%'
  //   } else if (component.data.layout === 'horizontal') {
  //     component.data.isAuto = component.data.wrap ?? true
  //     component.data.itemWidth = 'auto'
  //     delete component.data.wrap
  //   }

  //   component.data.useLoading = false;
  //   component.data.loadingTip = '加载中...';
  // }
}