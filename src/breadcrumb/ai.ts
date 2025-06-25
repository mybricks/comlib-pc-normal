
export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '面包屑',
    usage: `data声明
interface Children {
  key: string;
  label: string;
  clickable?: boolean;
  outputValue: string;
  event: any;
  style?: any;
}
separator: string = "/"
customSeparator: string = ""
padding: number = 0
children: Children[] = []

slots插槽
无

styleAry声明
文本: .\${children[0].key}
  - 可编辑样式: font`
  }
};
