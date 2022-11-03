import { uuid } from '../utils';
import { Data } from './constants';
import AddItemEditor from './editors/addItem';
import ScrollEditor from './editors/scroll';
import TitleEditor from './editors/title';
import TitleItemEditor from './editors/titleItem';

export default {
  '@init': ({ data }: EditorResult<Data>) => {
    data.componentId = uuid();
    data.slotList.forEach((item) => {
      if (!item.key) {
        item.key = uuid();
      }
    });
  },
  ':root': ({}: EditorResult<Data>, cate1) => {
    cate1.title = '常规';
    cate1.items = [
      ...AddItemEditor,
      {
        title: '菜单栏配置',
        items: [...TitleEditor]
      },
      ...ScrollEditor
    ];
    return { title: '锚点菜单容器' };
  },
  '[data-menu-title]': ({}: EditorResult<Data>, cate1) => {
    cate1.title = '常规';
    cate1.items = [...TitleEditor, ...AddItemEditor, ...ScrollEditor];
    return { title: '菜单栏' };
  },
  '[data-menu-title-item]': ({}: EditorResult<Data>, cate1) => {
    cate1.title = '常规';
    cate1.items = [...TitleItemEditor];
    return { title: '菜单项' };
  }
};
