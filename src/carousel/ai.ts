export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '轮播图，可以同时配置图片和内容的轮播展示组件',
    usage: `轮播图，可以同时配置图片和内容的轮播展示组件。

slots插槽
  [slotId]：轮播插槽内容，跟着当前item的slotId走
`
  },
  editors: [
    {
      title: '常规/数据',
      description: `通过数组来配置轮播数据
[
  {
    url: string
    slotId: string
    bgSize: 'contain' | 'cover' | '100% 100%' = 'contain'
  }
]
`,
      type: 'array',
      value: {
        set: ({ data, slot }, value) => {
          if (Array.isArray(value)) {
            data.items = value.map(item => {
              return item
            })
          }
        }
      }
    },
    '常规/自动切换',
    '常规/时间间隔',
    '常规/分页器配置/位置',
    '常规/分页器配置/高度',
    '常规/分页器配置/背景色'
  ],
  modifyTptJson: (component) => {
    if (!component?.data) {
      component.data = {}
    }
    component.data = {
      ...component.data,
      catelogDot: "默认",
      slideIndex: 0,
      useSlots: false
    }
    component.data.items.forEach((item, index) => {
      item.slotId = `slot${index + 1}`
      item.bgSize = "cover"
    })
  },
}