const version = ANTD_VERSION === 4 ? "" : "antd5."

export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '标签列表，展示标签或多个标签时使用',
    usage: `标签列表，展示标签或多个标签时使用
data数据模型
import type { TagProps } from "antd";
interface AppendBtn extends TagProps {
  text: string
}

align?: 'start' | 'end' | 'center' | 'baseline' = "start"
direction?: 'horizontal' | 'vertical' = "horizontal"
type: 'default' | 'processing' | 'error' | 'warning' | 'success' = "default"
tags: Array<Tag> = [
  {
    "key": "tag1",
    "content": "tag",
  }
]
isEllipsis: boolean = false
ellipsis: {
  maxWidth: number,
} = {
  "maxWidth": 120
}
closeAble: boolean = false
useAppendBtn?: boolean = true
appendBtn: AppendBtn = {
  "text": "新增",
  "icon": "PlusOutlined"
}
clickAble: boolean = false

layout声明
width: 默认为fit-content
height: 不可配置，默认为fit-content

slots插槽
无

layout声明
width: 不可配置，默认为100%，实际宽度为标签列表的宽度
height: 不可配置，默认为fit-content

styleAry声明
标签: .tag
  - 默认样式:
    - color: #000000
    - backgroundColor: 3FAFAFA
    - borderWidth: 1px
    - borderStyle: solid
    - borderColor: #D9D9D9
    - borderRadius: 4px
    - height: 22px
  - 可编辑样式: font、border、background
标签hover: .hover
  - 可编辑样式: font、border、background
标签激活: .checked
  - 可编辑样式: font、border、background
`
  },
  modifyTptJson: (component) => {
    component?.style?.styleAry?.forEach((style, index) => {
      if (style.selector == ".tag") {
        style.selector = 'div[data-root="root"] span[data-item-tag="tag"]'
      }
      if (style.selector == ".hover") {
        style.selector = 'div[data-root="root"] span[data-item-tag="tag"].ant-tag-checkable:not(.ant-tag-checkable-checked):hover'
      }
      if (style.selector == ".checked") {
        style.selector = 'div[data-root="root"] span[data-item-tag="tag"].ant-tag-checkable-checked'
      }
    })
  }
}