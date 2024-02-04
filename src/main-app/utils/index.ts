import * as Icons from '@ant-design/icons'

export function uuid (pre = 'u_', len = 6) {
  const seed = 'abcdefhijkmnprstwxyz0123456789',
    maxPos = seed.length
  let rtn = ''
  for (let i = 0; i < len; i++) {
    rtn += seed.charAt(Math.floor(Math.random() * maxPos))
  }
  return pre + rtn
}

export function formatMenuItem(item): any {
  const {
    id,
    icon,
    title,
    menuType
  } = item
  const finalItem: any = {
    key: id,
    label: title,
    type: menuType,
    icon: Icons && Icons[icon as string]?.render()
  }

  if (menuType === 'subMenu') {
    finalItem.children = []
  }
  
  return finalItem
}

export function getMenuConfig ({menuItems, homePage}, obj) {
  const { defaultOpen, cb } = obj
  let selectedItem
  const items: any = []
  const openKeys: string[] = []
  const deep = (items, result: any = []) => {
    items.forEach((item) => {
      const finalItem = formatMenuItem(item)
      const { id, open ,children } = item
      const hasChildren = Array.isArray(children)
      if (hasChildren) {
        const items = []
        if (defaultOpen) {
          openKeys.push(id)
        } else if (open) {
          openKeys.push(id)
        }
        
        deep(children, items)
        finalItem.children = items
      }

      if (cb) {
        cb(item)
      }
console.log(item,'item')
      const { hidden = false } = item

      if (!selectedItem && !hasChildren && !hidden) {
        selectedItem = item
      }

      if (!hidden) {
        result.push(finalItem)
      }
    })
  }

  deep(menuItems, items)

  const { show, icon, title } = homePage

  if (show) {
    const item = {
      id: '/',
      key: '/',
      label: title,
      type: 'menu',
      icon: Icons && Icons[icon as string]?.render()
    }
    items.unshift(item)
    selectedItem = item
  }

  return {
    items,
    openKeys,
    selectedItem
  }
}
