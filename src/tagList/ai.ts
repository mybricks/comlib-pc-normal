const version = ANTD_VERSION === 4 ? "" : "antd5."

export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '标签列表，展示单个标签或多个标签时使用',
    usage: `标签列表，展示单个标签或多个标签时使用
slots插槽
无

layout声明
width: 不可配置，默认为100%，推荐使用fit-content
height: 不可配置，默认为fit-content

styleAry声明
单个标签样式（默认）
  - color: #000000
  - backgroundColor: 3FAFAFA
  - borderWidth: 1px
  - borderStyle: solid
  - borderColor: #D9D9D9
  - borderRadius: 4px
  - height: 22px
`
  },
  editors: [
    '常规/基础/方向',
    '常规/基础/标签间距',
    {
      title: '常规/数据源',
      description: `通过数组来配置导航多个标签数据
[
  {
    "key": "tag1", // 唯一ID
    "content": "tag", // 内容
    "color": "default" // 类型，可选值：default(灰色)、processing、success、warning、error
  }
]
`,
      type: 'array',
      value: {
        set: ({ data, slot }, value) => {
          if (Array.isArray(value)) {
            data.tags = value
          }
        }
      }
    },
    '样式/默认/默认'
  ],
}