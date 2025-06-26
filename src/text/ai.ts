
export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '文本',
    usage: `data声明
content: string = "文字"
outputContent?: string = ""
align?: 'left' | 'center' | 'right' = "left"
isEllipsis: boolean = false
ellipsis: Record<string, any> = {
  "rows": 1
}
useDynamicStyle?: boolean = false
useHoverStyle?: boolean = true
legacyConfigStyle: React.CSSProperties = {}

slots插槽
无

styleAry声明
文本: [data-item-type="root"]
文本hover状态: [data-item-type="root"]:hover`
  },
  modifyTptJson: (component) => {
    if (component.style.styleAry) {
      component.style.styleAry.forEach(item => {
        if (!item.css) {
          item.css = {}
        }
        if (item.css.fontSize?.endsWith("px")) {
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
