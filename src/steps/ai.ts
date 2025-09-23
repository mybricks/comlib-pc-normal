export default {
  ':root'({ data }) {
    return {}
  },
  prompts: {
    summary: '步骤条，引导用户按照流程完成任务的导航条，整体对标antd的Steps组件。',
    usage: `步骤条，引导用户按照流程完成任务的导航条，整体对标antd的Steps组件。
slots插槽
无`
  },
  modifyTptJson(component) {
    if (Array.isArray(component.data?.dataSource)) {
      component.data?.dataSource.map(item => {
        if (item.icon) {
          item.useIcon = true
        }
      })
    }
  },
  editors: [
    '常规/类型',
    {
      title: '常规/数据源',
      description: `通过数组来配置步骤条数据
[
  {
    id: string = "id" 
    title: string = "title"
    description: string = 'description'
    index: number # 从0开始
  }
]
`,
      type: 'array',
      value: {
        set: ({ data, slot, output }, value) => {
          if (Array.isArray(value)) {
            data.stepAry = value.map((item, index) => {

              slot.add({
                id: item.id,
                title: `步骤${index + 1}`
              });

              output.add(item.id, `步骤${index + 1}下一步`, { type: 'any' });

              output.add(`${item.id}_into`, `步骤${index + 1}显示`, { type: 'any' });
              output.add(`${item.id}_leave`, `步骤${index + 1}隐藏`, { type: 'any' });
              output.add(`${item.id}_click`, `步骤${index + 1}点击时`, { type: 'any' });
         
              return item
            })
          }
        }
      }
    },
    '常规/方向',
    '常规/标签放置位置',
    '常规/标签放置位置',
    '常规/描述',
    '样式/默认/标题',
    '样式/默认/子标题',
    '样式/默认/步骤图标',
    '样式/完成态/步骤连线（水平）',
    '样式/完成态/步骤连线（竖直）',
    '样式/完成态/标题',
    '样式/完成态/子标题',
    '样式/完成态/步骤图标'
  ],
};
