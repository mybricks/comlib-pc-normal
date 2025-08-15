
export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '文本',
    usage: `data声明
content: string = "文字"
align?: 'left' | 'center' | 'right' = "left" # 仅在width非fit-content下起作用
isEllipsis: boolean = false
ellipsis: Record<string, any> = {
  "rows": 1
}

slots插槽
无

styleAry声明
默认状态: [data-item-type="root"]
  - 默认样式：
    - color: #000000
    - fontSize: 14px
  - 可编辑样式：
    - color、fontSize、backgroundColor、border、padding
hover状态: [data-item-type="root"]:hover
  - 默认样式：
    - color: #000000
    - fontSize: 14px
  - 可编辑样式：
    - color、fontSize、backgroundColor、border、padding`

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
