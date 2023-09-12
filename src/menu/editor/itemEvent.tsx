import { Data, MenuTypeEnum } from '../constants';
import { getMenuItem } from '../utils';

export const itemEvent = (props: EditorResult<Data>) => [
  {
    title: '子菜单',
    ifVisible(props: EditorResult<Data>) {
      return getMenuItem(props, 'menuType') === MenuTypeEnum.Menu;
    },
    items: [
      {
        title: `点击${getMenuItem(props).title}`,
        type: '_Event',
        options: (props: EditorResult<Data>) => {
          return {
            outputId: getMenuItem(props, '_key')
          };
        }
      }
    ]
  }
];
