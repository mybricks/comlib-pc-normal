export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '下拉菜单',
    usage: `data声明
options: { label: string, value: any, disabled?: boolean, useIcon:boolean, icon: string, iconColor: string, link: string, key: string }[] = [ {"label": "选项1", "link": "","disabled": "true", "useIcon": false, "icon": "HomeOutlined", "key": "选项1"} ]
placement: "bottomLeft" | "bottomCenter" | "bottomRight" | "topLeft" | "topCenter" | "topCenter" = "bottomLeft"
width: number | string = 100
isCustom: boolean = false
content: string = "下拉菜单"
trigger: "hover" | "click" = "hover"
isChildCustom: boolean = false
dynamicOptions: any[] = []
eventBubble: boolean = false
contentBubble: boolean = false
isItem: boolean = false

layout声明
width: 默认为100%
height: 不可配置，默认为fit-content (约等于40px)

slots插槽
carrier: 自定义内容区内容
item: 动态选项区内容

styleAry声明
展示区域(提示内容): .{id} .ant-dropdown-trigger
  可编辑样式: font
展示区域: .{id} .dropdown
  可编辑样式: border
展示区域(提示内容箭头): .{id} .anticon-down
  可编辑样式: font
下拉区域(菜单): .{id} .ant-dropdown-menu
  可编辑样式: background
下拉区域(箭头): .{id} .ant-dropdown-arrow:before
  可编辑样式: background
下拉区域: .{id} .ant-dropdown-arrow
  可编辑样式: border
下拉区域(选项): .{id} .ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title
  可编辑样式: font、background
提示内容hover: .{id} .ant-dropdown-trigger:hover
  可编辑样式: font
提示内容箭头hover: .{id} .ant-dropdown-trigger:hover .anticon-down
  可编辑样式: font
选项hover: .{id} .ant-dropdown-menu-item:hover, .ant-dropdown-menu-submenu-title
  可编辑样式: font、background
选项禁用: .{id} .ant-dropdown-menu-item-disabled
  可编辑样式: font、background
菜单项选项: .{id} li[data-menu-item="\${data.options[0].key}"]
  可编辑样式: font、background
菜单项选项hover: .{id} li[data-menu-item="\${data.options[0].key}"]:hover
  可编辑样式: font、background
`
  }
}