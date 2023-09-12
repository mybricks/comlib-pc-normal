import { Data, MenuTypeEnum } from '../constants';
import { getMenuItem } from '../utils';

export const subItemsEvent = (props: EditorResult<Data>) => [
  {
    title: '父菜单-子项',
    ifVisible(props: EditorResult<Data>) {
      return getMenuItem(props, 'menuType') === MenuTypeEnum.SubMenu;
    },
    items: [...menuItemsOnClick(props)]
  }
];

const menuItemsOnClick = (props: EditorResult<Data>) => {
  let items: any = [];
  if (getMenuItem(props, 'children')) {
    for (let i = 0; i < getMenuItem(props, 'children').length; i++) {
      if (getMenuItem(props, 'children')[i].menuType === 'menu') {
        items.push({
          title: `点击${getMenuItem(props, 'children')[i].title}`,
          type: '_Event',
          options: {
            outputId: getMenuItem(props, 'children')[i]._key
          }
        });
      }
    }
  }
  return items;
};
