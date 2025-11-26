export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '轮播图，可以配置图片和内容的轮播展示组件',
    usage: `轮播图，可以配置图片和内容的轮播展示组件。

slots插槽
  [slotId]：每一项的插槽id对应着当前项的slotId

`
  },
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
  }
}