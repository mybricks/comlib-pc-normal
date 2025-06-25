export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '颜色选择框',
    usage: `data声明
rules: any[] = []
validateTrigger: string[] = [
  "onChange"
]
disabled: boolean = false
width?: number | string = "32px"
colorType: 'rgb' | 'hex' = "rgb"

slots插槽
无

styleAry声明
无
`
  }
}