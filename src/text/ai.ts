
export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '文本',
    usage: `文本组件，支持配置溢出策略

slots插槽
无

注意事项
- 注意配置fontSize同时要配置lineHeight，否则会无法正常展示；
- 尽量不用全黑的字体颜色，而是用柔和一些的颜色比如深灰色；
- 对于大部分（特别是动态内容）的文本，需要配置文本一出，防止内容过多换行；
- 注意文本和其他组件之间要留有适量的边距（通过layout进行配置）；`

  },
  modifyTptJson: (component) => {
    if (component.style.styleAry) {
      component.style.styleAry.forEach(item => {
        if (!item.css) {
          item.css = {}
        }
        if (item.css?.fontSize?.endsWith?.("px")) {
          if (!item.css.lineHeight) {
            item.css.lineHeight = 1
          }
        }
        item.css.textAlign = component.data?.align || 'left'
      })
    } else {
      component.style.styleAry = [
        {
          selector: "[data-item-type='root']",
          css: {
            textAlign: 'left'
          }
        }
      ]
    }
  }
};