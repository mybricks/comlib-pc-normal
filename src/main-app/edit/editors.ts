import { uuid } from '../utils'

export default {
  '@init'({ style }) {
    style.width = '100%'
    style.height = '100%'
  },
  '@childAdd'(props, props2) {
    console.log('@childAdd:', { props, props2 })
  },
  '@childRemove'(props, props2) {
    console.log('@childRemove:', { props, props2 })
  },
  '@parentUpdated'(props, props2) {
    console.log('@parentUpdated:', { props, props2 })
  },
  ':root': [],
  '[data-logo-img="topAreaLogoImg"]': {
    title: 'logo',
    items: [
      {
        title: 'logo地址',
        type: 'text',
        value: {
          get({ data }: EditorResult<any>) {
            return data.topArea.logo
          },
          set({ data }: EditorResult<any>, value) {
            data.topArea.logo = value
          }
        }
      },
    ]
  },
  '[data-logo-title="topAreaLogoTitle"]': {
    title: '标题',
    items: [
      {
        title: '标题',
        type: 'text',
        value: {
          get({ data }: EditorResult<any>) {
            return data.topArea.title
          },
          set({ data }: EditorResult<any>, value) {
            data.topArea.title = value
          }
        }
      },
    ]
  },
  '[data-sider="middleAreaSider"]': {
    title: '侧边栏',
    items: [
      {
        title: '菜单项',
        type: 'array',
        options: {
          getTitle(item) {
            return item.title || '未命名'
          },
          onAdd() {
            const id = uuid()
            return {
              id,
              key: id,
              menuType: 'menu',
              title: '菜单名称',
              open: true
            }
          },
          items: [
            {
              title: '名称',
              type: 'text',
              value: 'title'
            },
            {
              title: '唯一标识',
              type: 'text',
              value: 'key',
              ifVisible(item) {
                return item.menuType === 'menu';
              },
            },
            {
              title: '路径',
              type: 'textArea',
              value: 'pageUrl',
              ifVisible(item) {
                return item.menuType === 'menu';
              },
            },
            {
              title: '默认展开',
              type: 'switch',
              value: 'open',
              ifVisible(item) {
                return item.menuType === 'subMenu';
              },
            },
            {
              title: '类型',
              type: 'select',
              options: [
                { label: '子菜单', value: 'menu' },
                { label: '父菜单', value: 'subMenu' }
              ],
              value: 'menuType'
            },
          ]
        },
        value: {
          get({ data }) {
            return data.middleArea.sider.menuItems
          },
          set({ data }, menuItems) {
            const { menuOpenKeys } = menuItemsChange(menuItems)
            data.middleArea.sider.menuItems = menuItems
            data.middleArea.sider.menuOpenKeys = menuOpenKeys
          }
        }
      }
    ]
  },
  '[data-menu-id]:not([data-menu-id$="-/"])': {
    title: '菜单项',
    items: [
      {
        title: '标题',
        type: 'text',
        value: {
          get({ data, focusArea }) {
            if (!focusArea) return
            const menuItem = findMenuItem({ menuItems: data.middleArea.sider.menuItems, id: focusArea.dataset['menuId'] })
            return menuItem.title
          },
          set({ data, focusArea }, value) {
            if (!focusArea) return
            const menuItem = findMenuItem({ menuItems: data.middleArea.sider.menuItems, id: focusArea.dataset['menuId'] })
            if (menuItem) {
              menuItem.title = value
            }
          }
        }
      },
      {
        title: '唯一标识',
        type: 'text',
        description: '用于路由跳转hash以及权限配置',
        ifVisible({ data, focusArea }) {
          if (!focusArea) return false
          const menuItem = findMenuItem({ menuItems: data.middleArea.sider.menuItems, id: focusArea.dataset['menuId'] })
          return menuItem ? menuItem.menuType === 'menu' : false
        },
        value: {
          get({ data, focusArea }) {
            if (!focusArea) return
            const menuItem = findMenuItem({ menuItems: data.middleArea.sider.menuItems, id: focusArea.dataset['menuId'] })
            return menuItem.key
          },
          set({ data, focusArea }, value) {
            if (!focusArea) return
            const menuItem = findMenuItem({ menuItems: data.middleArea.sider.menuItems, id: focusArea.dataset['menuId'] })
            menuItem.key = value
          }
        }
      },
      {
        title: '路径',
        type: 'text',
        ifVisible({ data, focusArea }) {
          if (!focusArea) return false
          const menuItem = findMenuItem({ menuItems: data.middleArea.sider.menuItems, id: focusArea.dataset['menuId'] })
          return menuItem ? menuItem.menuType === 'menu' : false
        },
        value: {
          get({ data, focusArea }) {
            if (!focusArea) return
            const menuItem = findMenuItem({ menuItems: data.middleArea.sider.menuItems, id: focusArea.dataset['menuId'] })
            return menuItem.pageUrl
          },
          set({ data, focusArea }, value: string) {
            if (!focusArea) return
            const menuItem = findMenuItem({ menuItems: data.middleArea.sider.menuItems, id: focusArea.dataset['menuId'] })
            menuItem.pageUrl = value
          }
        }
      },
      {
        title: '图标',
        items: [
          {
            title: '使用图标',
            type: 'switch',
            value: {
              get({ data, focusArea }) {
                if (!focusArea) return
                const menuItem = findMenuItem({ menuItems: data.middleArea.sider.menuItems, id: focusArea.dataset['menuId'] })
                return typeof menuItem.icon === 'string'
              },
              set({ data, focusArea }, bool) {
                if (!focusArea) return
                const menuItem = findMenuItem({ menuItems: data.middleArea.sider.menuItems, id: focusArea.dataset['menuId'] })
                if (bool) {
                  menuItem.icon = ''
                } else {
                  menuItem.icon = void 0
                  Reflect.deleteProperty(menuItem, 'icon')
                }
              }
            }
          },
          {
            type: 'icon',
            ifVisible({ data, focusArea }) {
              if (!focusArea) return false
              const menuItem = findMenuItem({ menuItems: data.middleArea.sider.menuItems, id: focusArea.dataset['menuId'] })
              return typeof menuItem.icon === 'string'
            },
            value: {
              get({ data, focusArea }) {
                if (!focusArea) return
                const menuItem = findMenuItem({ menuItems: data.middleArea.sider.menuItems, id: focusArea.dataset['menuId'] })
                return menuItem.icon
              },
              set({ data, focusArea }, icon) {
                if (!focusArea) return
                const menuItem = findMenuItem({ menuItems: data.middleArea.sider.menuItems, id: focusArea.dataset['menuId'] })
                menuItem.icon = icon
              }
            }
          }
        ]
      },
      {
        title: '默认展开',
        type: 'switch',
        description: '在运行时默认展开菜单栏',
        ifVisible({ data, focusArea }) {
          if (!focusArea) return false
          const menuItem = findMenuItem({ menuItems: data.middleArea.sider.menuItems, id: focusArea.dataset['menuId'] })
          return menuItem ? menuItem.menuType === 'subMenu' : false
        },
        value: {
          get({ data, focusArea }) {
            if (!focusArea) return
            const menuItem = findMenuItem({ menuItems: data.middleArea.sider.menuItems, id: focusArea.dataset['menuId'] })
            return menuItem.open
          },
          set({ data, focusArea }, value) {
            if (!focusArea) return
            const menuItem = findMenuItem({ menuItems: data.middleArea.sider.menuItems, id: focusArea.dataset['menuId'] })
            menuItem.open = value
            const { menuOpenKeys } = menuItemsChange(data.middleArea.sider.menuItems)
            data.middleArea.sider.menuOpenKeys = menuOpenKeys
          }
        }
      },
      {
        title: '类型',
        type: 'select',
        options: [
          { label: '子菜单', value: 'menu' },
          { label: '父菜单', value: 'subMenu' }
        ],
        value: {
          get({ data, focusArea }) {
            if (!focusArea) return
            const menuItem = findMenuItem({ menuItems: data.middleArea.sider.menuItems, id: focusArea.dataset['menuId'] })
            return menuItem.menuType
          },
          set({ data, focusArea }, menuType) {
            if (!focusArea) return
            const menuItem = findMenuItem({ menuItems: data.middleArea.sider.menuItems, id: focusArea.dataset['menuId'] })
            menuItem.menuType = menuType
            const { menuOpenKeys } = menuItemsChange(data.middleArea.sider.menuItems)
            data.middleArea.sider.menuOpenKeys = menuOpenKeys
          }
        }
      },
      {
        title: '菜单项',
        type: 'array',
        ifVisible({ data, focusArea }) {
          if (!focusArea) return false
          const menuItem = findMenuItem({ menuItems: data.middleArea.sider.menuItems, id: focusArea.dataset['menuId'] })
          return menuItem ? menuItem.menuType === 'subMenu' : false
        },
        options: {
          getTitle(item) {
            return item.title || '未命名'
          },
          onAdd() {
            const id = uuid()
            return {
              id,
              key: id,
              menuType: 'menu',
              title: '菜单名称',
              open: true
            }
          },
          items: [
            {
              title: '标题',
              type: 'text',
              value: 'title'
            },
            {
              title: '唯一标识',
              type: 'text',
              value: 'key',
              ifVisible(item) {
                return item.menuType === 'menu';
              },
            },
            {
              title: '路径',
              type: 'textArea',
              value: 'pageUrl',
              ifVisible(item) {
                return item.menuType === 'menu';
              },
            },
            {
              title: '默认展开',
              type: 'switch',
              value: 'open',
              ifVisible(item) {
                return item.menuType === 'subMenu';
              },
            },
            {
              title: '类型',
              type: 'select',
              options: [
                { label: '子菜单', value: 'menu' },
                { label: '父菜单', value: 'subMenu' }
              ],
              value: 'menuType'
            }
          ]
        },
        value: {
          get({ data, focusArea }) {
            if (!focusArea) return
            const menuItem = findMenuItem({ menuItems: data.middleArea.sider.menuItems, id: focusArea.dataset['menuId'] })
            return menuItem.children
          },
          set({ data, focusArea }, menuItems) {
            if (!focusArea) return
            const menuItem = findMenuItem({ menuItems: data.middleArea.sider.menuItems, id: focusArea.dataset['menuId'] })
            menuItem.children = menuItems
            const { menuOpenKeys } = menuItemsChange(data.middleArea.sider.menuItems)
            data.middleArea.sider.menuOpenKeys = menuOpenKeys
          }
        }
      },
    ]
  },
}

function findMenuItem({ menuItems, id }) {
  id = id.split('-').at(-1)
  let menuItem

  for (let item of menuItems) {
    if (item.id === id) {
      menuItem = item
      break
    } else if (item.menuType === 'subMenu') {
      menuItem = findMenuItem({ menuItems: item.children, id })
      if (menuItem) {
        break
      }
    }
  }

  return menuItem
}

function traverseMenuItems(items, cb) {
  if (Array.isArray(items)) {
    items.forEach((item) => {
      cb(item)
      if (item.menuType === 'subMenu') {
        traverseMenuItems(item.children, cb)
      }
    })
  }
}

function menuItemsChange(items) {
  const menuOpenKeys: string[] = []
  traverseMenuItems(items, (item) => {
    const {
      id,
      open,
      menuType,
      children
    } = item
    if (menuType === 'subMenu') {
      const finalOpen = typeof open === 'boolean' ? open : true
      if (finalOpen) {
        menuOpenKeys.push(id)
      }
      console.log(finalOpen, item)
      item.children = children || []
      item.open = finalOpen
      Reflect.deleteProperty(item, 'page')
    } else {
      Reflect.deleteProperty(item, 'open')
      Reflect.deleteProperty(item, 'children')
    }
  })

  return {
    menuOpenKeys
  }
}
