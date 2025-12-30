export default {
  ':root'({ data }) {
    return {}
  },
  prompts: {
    summary: '导航菜单，为页面和功能提供导航的菜单列表，可以水平展示，也可以垂直展示，整体对标antd的Menu组件',
    usage: `导航菜单，为页面和功能提供导航的菜单列表，可以水平展示，也可以垂直展示，整体对标antd的Menu组件。
slots插槽
无
`
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
