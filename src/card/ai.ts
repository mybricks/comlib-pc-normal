export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '卡片',
    usage: `data声明
interface Item {
  key: string;
  name: string;
}
title: string = "卡片"
useExtra?: boolean = false
bordered?: boolean = true
hoverable?: boolean = false
cursor?: boolean = false
size?: 'default' | 'small' = "default"
style: any = {}
bodyStyle?: any = {}
outputContent?: any = 0
dataType: 'null' | 'number' | 'string' | 'object' | 'boolean' | 'external' = "number"
borderStyle?: Object = {
  "borderRadius": "8px 8px 8px 8px",
  "borderColor": "#F0F0F0 #F0F0F0 #F0F0F0 #F0F0F0",
  "borderWidth": "1px 1px 1px 1px",
  "borderStyle": "solid solid solid solid"
}
isAction: boolean = false
items: Item[] = [
  {
    "key": "key1",
    "name": "操作项1"
  }
]
padding: string = "24px"
isHeight: boolean = false
height: string = "80px"
showTitle: boolean = true
slotStyle?: Object = {
  "display": "block",
  "position": "smart",
  "flexDirection": "column",
  "alignItems": "flex-start",
  "justifyContent": "flex-start",
  "flexWrap": "nowrap",
  "rowGap": 0,
  "columnGap": 0
}

slots插槽
body: 卡片内容区内容
extra: 卡片右上角操作区内容
data.items[0].key: 卡片底部操作区内容

styleAry声明
标题: .card .ant-card-head-title:not(#{id} *[data-isslot="1"] *)
  - 可编辑样式: font
边框: .card > .ant-card:not(#{id} *[data-isslot="1"] *)
  - 可编辑样式: border
背景: .card > .ant-card:not(#{id} *[data-isslot="1"] *)
  - 可编辑样式: background
`
  }
}