import { Data, MenuTypeEnum, uuid, MenuItem } from '../constants';
import {
  getMenuItem,
  removeOutput,
  dataHandle,
  dataSourceHandle,
  setMenuItem,
  addKeys,
  removeKeys
} from '../utils';

export const subItemArr = (props: EditorResult<Data>) => [
  {
    title: '子项配置',
    type: 'Tree',
    description: '这里可以配置子菜单和分组菜单',
    ifVisible(props: EditorResult<Data>) {
      return getMenuItem(props, 'menuType') === MenuTypeEnum.SubMenu;
    },
    options: {
      getTitle: (item, index) => {
        //切换分组，菜单子项的标题暂时不进行改变
        if (!item.title) {
          item.title = `子菜单${index + 1}`;
        }
        if (!item.defaultActive) {
          item.defaultActive = false;
        }
        if (!item.key) {
          item.key = uuid();
        }
        if (!item.menuType) {
          item.menuType = MenuTypeEnum.Menu;
        }
        if (item.menuType === MenuTypeEnum.Group && item.title === `子菜单${index + 1}`) {
          item.title = `分组菜单${index + 1}`;
        }
        return item.title;
      },
      onAdd: () => {
        const key = uuid();
        return {
          key: key,
          _key: key,
          menuType: MenuTypeEnum.Menu,
          defaultActive: false,
          title: `菜单${key}`
        };
      },
      addItemGoal: {
        key: 'menuType',
        value: [MenuTypeEnum.SubMenu, MenuTypeEnum.Group]
      },
      items: [
        {
          title: '类型',
          type: 'Select',
          options: [
            { label: '子菜单', value: MenuTypeEnum.Menu },
            { label: '父菜单', value: MenuTypeEnum.SubMenu },
            { label: '分组', value: MenuTypeEnum.Group }
          ],
          value: 'menuType'
        },
        {
          title: '标题',
          type: 'TextArea',
          value: 'title',
          options: {
            autoSize: { maxRows: 1 },
            locale: true
          }
        },
        {
          title: '唯一标识',
          type: 'TextArea',
          value: 'key',
          options: {
            autoSize: { maxRows: 1 }
          }
        },
        {
          title: '默认激活',
          type: 'Switch',
          ifVisible(item) {
            return item.menuType === MenuTypeEnum.Menu;
          },
          value: 'defaultActive'
        }
      ]
    },
    value: {
      get(props: EditorResult<Data>) {
        return getMenuItem(props, 'children');
      },
      set(props: EditorResult<Data>, value: MenuItem[]) {
        let befVal = getMenuItem(props, 'children') || [];
        //删除菜单项操作
        if (value.length < befVal.length) {
          removeOutput(befVal, value, props.output);
        }
        //增加菜单项操作
        if (value.length > befVal.length) {
          addKeys(value.slice(-1)[0], props);
        }
        //子项-子菜单，切换至分组菜单
        if (value.length === befVal.length) {
          value.map((item) => {
            if (item.menuType === MenuTypeEnum.Group) {
              props.output.remove(item._key);
              //从分组菜单切换至子菜单，去除分组菜单事件
            } else if (item.menuType === MenuTypeEnum.Menu) {
              props.output.add(item._key, `点击${item.title}`, { type: 'any' });
              removeKeys(item.children || [], props);
            }
          });
          //dataSource的处理
          props.data.dataSource = dataSourceHandle(befVal, value, props.data.dataSource);
        }

        //value的处理
        let newVal = dataHandle(befVal, value);
        setMenuItem(props, 'children', newVal);
      }
    }
  }
];
