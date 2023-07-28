import { Data, MenuTypeEnum } from '../constants';
import { getMenuItem } from '../utils';

export const groupItemEvent = (props: EditorResult<Data>) => {
  let items: any = [];
  let groupItems: any = [];
  if (getMenuItem(props).menuType === MenuTypeEnum.SubMenu && getMenuItem(props).children) {
    for (let i = 0; i < getMenuItem(props).children.length; i++) {
      if (getMenuItem(props).children[i].menuType === 'group') {
        items.push(getMenuItem(props).children[i]);
      }
    }
    //items是所有分组菜单的集合
    groupItems = items.map((e) => {
      return {
        title: `${e.title}-子项`,
        items: [...groupItemsOnClick(e.children || [])]
      };
    });
  }
  return groupItems;
};

const groupItemsOnClick = (props) => {
  let items: any = [];
  if (props.length > 0) {
    for (let i = 0; i < props.length; i++) {
      items.push({
        title: `点击${props[i].title}`,
        type: '_event',
        options: {
          outputId: props[i]._key
        }
      });
    }
  }
  return items;
};
