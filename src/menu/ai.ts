export default {
  ':root'({ data }) {
    return {}
  },
  prompts: {
    summary: '导航菜单，为页面和功能提供导航的菜单列表，可以水平展示，也可以垂直展示。',
    usage: `导航菜单，为页面和功能提供导航的菜单列表，可以水平展示，也可以垂直展示，整体对标antd的Menu组件。
slots插槽
无

styleAry声明
整体包含菜单和选中标记两部分UI，其中菜单字体选中色和标记选中颜色都是#1677FF
  当mode=horizontal时，菜单为水平展示
    - 菜单项为lineHeight=46px的标签；
    - 选中标记为下方横线，默认为borderWidth=2px、backgroundColor=#1677FF；

  当mode=vertical时，菜单为垂直展示，选中标记失效
    - 菜单项为lineHeight=40px，paddingLeft: 16，paddingRight: 16的标签；
    - 选中时菜单项背景色变化成 #E6F4FF；

注意：调节菜单项的高度，需要通过菜单项的lineHeight来控制，并且设置layout.height为fit-content;

样式配置案例：
1. 配置垂直菜单的样式效果
  - 1.1 配置默认情况下的颜色样式，「样式/默认/菜单项」，的color修改；
  - 1.2 配置选中情况下的颜色样式，「样式/选中/菜单项」，的color、backgroundColor和 border修改；

注意：
- 所有菜单项都不允许配置padding!
- 因为没有继承效果，如果「样式/默认/菜单项」配置了字体大小，「样式/选中/菜单项」也需要配置。
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
