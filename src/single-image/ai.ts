export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '图片，可预览的单图',
    usage: `图片，可预览的单图。
slots插槽
无

注意：
- 对于图片组件，尽量保证图片的宽高，如果相对父元素，需要保证父元素的宽高；
- 图片也可以配置背景色，在图片没加载出来的时候有兜底效果；
- 必须选择cover模式，保证图片占满容器，contain模式会有留白；

关于图片链接：

对于图片：我们建议根据其用途选择合适的来源：
  - https://placehold.co/600x400/orange/ffffff?text=hello，可以配置一个橙色背景带白色hello文字的色块占位图片；
  - https://ai.mybricks.world/image-search?term=搜索词&w=宽&h=高，可以配置一个高质量的摄影图片；

  对于海报/写实图片：我们建议使用高质量的摄影图片；
  对于品牌/Logo：我们建议使用色块占位图片；
  对于插画/装饰性图形：我们优先推荐使用图标来点缀；如果确实需要图片，也可以使用色块占位图片，防止摄影图片过于跳脱；
  
  注意参数：
    - 对于https://placehold.co 的text参数的值，必须为英文字符，不允许为中文字符，如果是中文可以用拼音首字母；
    - 对于https://placehold.co 的颜色，背景颜色和文本颜色要区分开；
`
  }
}