
export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '时间轴 Timeline，垂直展示的时间流 / 信息流列表。',
    usage: `时间轴 Timeline，垂直展示的时间流 / 信息流列表。

layout声明
width: 默认为100%，建议配置固定值
height: 不可配置，默认为fit-content

UI 组成： 
其中标题和副标题在同一行，description在下面的一行
  标题：字体常规，字号16px，颜色#434343
  副标题：字体常规，字号14px，颜色#000000
  描述：字体常规，字号14px，颜色#000000
`
  },
  editors: [
    {
      title: '常规/数据源',
      description: `通过数组来配置步骤条数据
[
  {
    id: string = "id" 
    title: string = "title"
    subTitle: string = "subTitle"
    description: string = 'description'
    index: number # 从0开始
  }
]
`,
      type: 'array',
      value: {
        set: ({ data, slot, output }, value) => {
          if (Array.isArray(value)) {
            data.timelines = value.map((item, index) => {
              return item
            })
          }
        }
      }
    },
    '常规/属性/内容位置',
    '常规/属性/排序方式',
    '常规/属性/支持展开收起',
    '常规/属性/默认折叠',
    '样式/时间轴点',
    '样式/标题',
    '样式/副标题',
    '样式/描述'
  ],
};
