const version = ANTD_VERSION === 4 ? "" : "antd5."

export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '标签列表，展示标签或多个标签时使用，大部分场景下只需要一个标签，常用于展示详情、表格列数据',
    usage: `data数据模型
import type { TagProps } from "antd";
interface AppendBtn extends TagProps {
  text: string
}
interface Tag extends TagProps {
  key: string;
  icon?: string;
  content: React.ReactElement | string;
  checked?: boolean;
  textColor?: string;
  borderColor?: string;
}
align?: 'start' | 'end' | 'center' | 'baseline' = "start"
direction?: 'horizontal' | 'vertical' = "horizontal"
wrap?: boolean = true
type: 'default' | 'processing' | 'error' | 'warning' | 'success' = "default"
tags: Array<Tag> = [
  {
    "key": "tag1",
    "content": "tag",
    "color": "default"
  }
]
isEllipsis: boolean = false
ellipsis: {
  maxWidth: number,
} = {
  "maxWidth": 120
}
closeAble: boolean = false
tagSize: 'small-tag' | 'middle-tag' | 'large-tag' = "small-tag",
dynamic?: boolean = false
appendBtn: AppendBtn = {
  "text": "新增",
  "icon": "PlusOutlined"
}
useAppendBtn?: boolean = true
clickAble: boolean = false

slots插槽
无

styleAry声明
标签: .tag
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