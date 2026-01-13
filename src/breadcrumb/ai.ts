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
  },
  editors: [
    '面包屑/分割符',
    {
      title: '面包屑/数据源',
      description: `通过数组来配置面包屑数据
[
  {
    key: string = "menu1"
    label: string = '面包屑1'
  }
]
`,
      type: 'array',
      value: {
        set: ({ data, slot, output }, value) => {
          if (Array.isArray(value)) {
            data.children = value.map(item => {
              if (!output.get(item.key)) {
                output.add(item.key, '面包屑点击', { type: 'string' })
              }
              return {
                ...item,
                event: { value: item.key }
              }
            })
          }
        }
      }
    },
    '样式/文本',
  ],
};