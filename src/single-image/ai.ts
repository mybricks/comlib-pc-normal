export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '图片，可预览的单图',
    usage: `data声明
src: "http:xx"
objectFit: ['fill', 'cover']

slots插槽
无

styleAry声明
默认: .img
Hover: .img:hover

注意：
- 对于图片组件，尽量保证图片的宽高，如果相对父元素，需要保证父元素的宽高
- 图片也可以配置背景色，在图片没加载出来的时候有兜底效果`
  },
  modifyTptJson: (component) => {
    component.style?.styleAry?.forEach?.((style, index) => {
      if (style.selector === ".img") {
        style.selector = ".ant-image-img"
      }
      if (style.selector === ".img:hover") {
        style.selector = ".ant-image-img:hover"
      }
    })
  }
}