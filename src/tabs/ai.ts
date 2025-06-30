const version = ANTD_VERSION === 4 ? "" : "antd5."

export default {
  ':root' ({ data }) {
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
顶部标签整体: .nav_wrap
  - 默认样式：
    - display: flex
    - flex: auto
    - height: 46px
    -transform: translate(0)
  - 可编辑样式：
    - background,border,borderRadius,height
顶部单个标签: .nav_item
  - 默认样式：
    - color: #1677ff;
    - text-shadow: 0 0 0.25px #1677ff;
  - 可编辑样式：
    - color,textShadow
下方tab内容: .content
  - 默认样式：
    - min-width:0
    - min-height:0
  - 可编辑样式：
    - background,border,borderRadius
整个tab: .tab
  - 默认样式：
    - height: 100%
    - border: none
  - 可编辑样式：
    - background,border,borderRadius
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
        style.selector = [`.css-1x0dypw.ant-tabs >.ant-tabs-nav .ant-tabs-nav-wrap`, `.css-1x0dypw.ant-tabs >div>.ant-tabs-nav .ant-tabs-nav-wrap`]
      }
      if (style.selector == ".nav_item") {
        style.selector = [`.ant-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn`]
      }
      if (style.selector == ".content") {
        style.selector = [`.ant-tabs .ant-tabs-content-holder`]
      }
      if (style.selector == ".tab") {
        style.selector = [`.ant-tabs`, `.ant-tabs-content-holder`, `.ant-tabs-content`]
      }
    })
  }
}