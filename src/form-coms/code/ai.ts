export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '多选框',
    usage: `data声明
type AceConfig = Partial<{
  placeholder: string;
  minLines: number;
  maxLines: number;
  wrap: boolean;
  fontSize: number;
  language: string;
  showPrintMargin: boolean;
  indentedSoftWrap: boolean;
  firstLineNumber: number;
}>
aceConfig: AceConfig = {
  "placeholder": "请输入代码",
  "language": "json",
  "minLines": 8,
  "maxLines": 16,
  "wrap": true,
  "readOnly": false
}
readOnly?: boolean = false
rules: any[] = []

slots插槽
无

styleAry声明
无
`
  }
}