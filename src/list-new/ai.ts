export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '列表容器，循环列表组件，用于动态数据列表的实现，支持横排和竖排展示，支持换行',
    usage: `data数据模型
direction: ['row', 'column'] = 'column'
wrap: boolean = true
grid: {
  gutter: [number, number] = [0, 16] # 间距[水平,垂直]
}
rowKey: string = "id" #列表项唯一标志

layout声明
width: 默认为100%
height: 默认为fit-content，不可配置100%

slots插槽
item # 列表项插槽，注意插槽宽度只能为fit-content或者100%，不允许配置其他。

注意：
- 在列表中，插槽仅放置一个组件即可，因为列表会遍历这个组件，不要开发多个，仅需开发一个示例即可；
- 对于静态数据的列表，不要使用循环列表，用flex开发多个示例；`
  },
  modifyTptJson: (component) => {
    if (!component.data) {
      component.data = {}
    }

    component.data.layout = component.data?.direction === 'row' ? 'horizontal' : 'vertical'
    delete component.data?.direction
    if (component.data.layout === 'vertical') {
      component.data.itemWidth = '100%'
    } else if (component.data.layout === 'horizontal') {
      component.data.isAuto = component.data.wrap ?? true
      component.data.itemWidth = 'auto'
      delete component.data.wrap
    }

    component.data.useLoading = false;
    component.data.loadingTip = '加载中...';
  }
}