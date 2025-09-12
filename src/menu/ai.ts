export default {
  ':root'({ data }) {
    return {}
  },
  prompts: {
    summary: '导航菜单，为页面和功能提供导航的菜单列表，可以水平展示，也可以垂直展示',
    usage: `导航菜单，为页面和功能提供导航的菜单列表，可以水平展示，也可以垂直展示。
slots插槽
无

styleAry声明
菜单整体: ul.ant-menu
  - 默认样式：
    - borderColor: #000000
    - borderBottomWidth: 1px # 在mode=horizontal时
    - borderRightWidth: 1px # 在mode=vertical时
  - 可编辑样式：
    - border
菜单项（未选中）: ul li:not(.ant-menu-item-selected)
  - 默认样式：
    - color: #000000;
    - fontSize: 14;
    - backgroundColor: #ffffff;
    - lineHeight: 40px;
    - height: 40px;
  - 可编辑样式：
    - color,fontSize,background
菜单项（已选中）: ul li.ant-menu-item-selected
  - 默认样式：
    - color: #1677FF;
    - fontSize: 14;
    - backgroundColor: #e6f4ff;
    - lineHeight: 40px;
    - height: 40px;
  - 可编辑样式：
    - color,fontSize,background
菜单项选中条: ul li.ant-menu-item-selected:after
  - 默认样式: 一个位于高亮标签项下方的选中条
    - borderWidth: 2px
    - borderColor: #1677FF
  - 可编辑样式: borderWidth,borderColor

注意事项：
  - 如果要配置「样式/默认/菜单项」的padding，必须同时配置「样式/选中/菜单项」为一样的值，两者必须一致；
    `
  },
  modifyTptJson(component) {
    if (Array.isArray(component.data?.dataSource)) {
      component.data?.dataSource.map(item => {
        if (item.icon) {
          item.useIcon = true
        }
      })
    }
  },
  editors: [
    '导航菜单/样式',
    {
      title: '常规/数据源',
      description: `通过树状数组来配置导航菜单数据
[
  {
    defaultActive: boolean = false 
    key: string = "menu1"
    title: string = '菜单名称'
    menuType: ['menu', | 'subMenu'] = 'menu' # 等于subMenu意味着可以配置 children 子菜单
    children?: []
    icon?: string # 可用的图标，会渲染在菜单项左侧
  }
]
`,
      type: 'array',
      value: {
        set: ({ data, slot }, value) => {
          if (Array.isArray(value)) {
            data.dataSource = value.map(item => {
              if (item.icon) {
                item.useIcon = true
              }
              return item
            })
          }
        }
      }
    },
    '样式/默认/菜单',
    '样式/默认/菜单项',
    '样式/选中/菜单项',
    '样式/选中/选中标记'
  ],
};
