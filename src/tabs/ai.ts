import { getFilterSelector } from '../utils/cssSelector';

const version = ANTD_VERSION === 4 ? "" : "antd5."

export default {
  ':root'({ data }) {
    return {}
  },
  prompts: {
    summary: '标签页',
    usage: `data数据模型
tabList = [
  {
    name: string = "标签页1"
  }
]
slotStyle = {}
defaultActiveKey = "tab0"
size: ['large' | 'middle' | 'small'] = "middle"
centered: [true|false] = false
tabPosition: [top|left|right|bottom] = "top"
hideAdd: [true|false] = true

slots插槽
tab0: 标签页1

关于插槽的使用，尽量每个插槽下都要有内容，不同的标签页往往展示不同的内容

styleAry声明
标签整体: .nav_wrap
  - 默认样式：
    - height: 46px
  - 可编辑样式：
    - background,padding
标签项（未选中）: .nav_item
  - 默认样式：
    - color: #000000;
    - fontSize: 14;
  - 可编辑样式：
    - color,fontSize
标签项（已选中）: .nav_item_active
  - 默认样式：
    - color: #1677FF;
    - fontSize: 14;
  - 可编辑样式：
    - color,fontSize
标签项选中条: .nav_line
  - 默认样式: 一个位于高亮标签项下方的选中条
    - width = 100%
    - height = 2px
    - backgroundColor: #1677FF
  - 可编辑样式: height、backgroundColor
`
  },
  modifyTptJson: (component) => {
    if (!component?.data) {
      component.data = {}
    }
    component.data.tabList.forEach((item, index) => {
      item.key = `tab${index}`,
        item.id = `tab${index}`,
        item.infoType = 'text',
        item.size = "default",
        item.showZero = false
    })
    component.data = {
      ...component.data,
      prohibitClick: false,
    }
    component?.style?.styleAry?.forEach((style, index) => {
      if (style.selector == ".nav_wrap") {
        style.selector = '.ant-tabs .ant-tabs-nav-wrap'
      }
      if (style.selector == ".nav_item") {
        style.selector = `.ant-tabs .ant-tabs-nav-wrap .ant-tabs-tab:not(.ant-tabs-tab-active)${getFilterSelector(component.id)}`
      }
      if (style.selector == ".nav_item_active") {
        style.selector = `.ant-tabs .ant-tabs-nav-wrap .ant-tabs-tab-active${getFilterSelector(component.id)} div.ant-tabs-tab-btn span`
      }
      if (style.selector == '.nav_line') {
        style.selector = `.ant-tabs .ant-tabs-nav .ant-tabs-ink-bar${getFilterSelector(component.id)}`
      }
      // if (style.selector == ".content") {
      //   style.selector = [`.ant-tabs .ant-tabs-content-holder`]
      // }
      // if (style.selector == ".tab") {
      //   style.selector = [`.ant-tabs`, `.ant-tabs-content-holder`, `.ant-tabs-content`]
      // }
    })
  }
}