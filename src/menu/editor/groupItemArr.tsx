import { Data, MenuTypeEnum, uuid } from '../constants';
import { getMenuItem, removeOutput, addOutput, dataHandle, dataSourceHandle } from '../utils';

export const groupItemArr = (props: EditorResult<Data>) => {
  let items: any = [];
  let groupItems: any = [];
  //前提条件是父菜单且子菜单项的类型是分组菜单
  if (getMenuItem(props).menuType === 'subMenu' && getMenuItem(props).children) {
    for (let i = 0; i < getMenuItem(props).children.length; i++) {
      if (getMenuItem(props).children[i].menuType === 'group') {
        items.push(getMenuItem(props).children[i]);
      }
    }
    //items是所有分组菜单的集合
    groupItems = items.map((e) => {
      return {
        title: `${e.title}子项配置`,
        type: 'Array',
        description: '这里可以配置子菜单和分组菜单',
        options: {
          getTitle: (item, index) => {
            if (!item.title) {
              item.title = `分组子菜单${index + 1}`;
            }
            if (!item.key) {
              item.key = uuid();
            }
            return item.title;
          },
          onAdd: () => {
            const key = uuid();
            return {
              key,
              _key: key,
              menuType: MenuTypeEnum.Menu,
              defaultActive: false,
              children: []
            };
          },
          items: [
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
              value: 'defaultActive'
            }
          ]
        },
        value: {
          get(props: EditorResult<Data>) {
            //取到遍历的当前项
            return e.children;
          },
          set(props: EditorResult<Data>, value: any[]) {
            //1、删除菜单项操作
            let befVal = e.children || [];
            if (befVal.length > value.length) {
              removeOutput(befVal, value, props.output);
            }
            //2、增加菜单项操作
            if (befVal.length < value.length) {
              addOutput(befVal, value, props.output);
            }
            if (befVal.length === value.length) {
              props.data.dataSource = dataSourceHandle(befVal, value, props.data.dataSource);
            }
            //value的处理
            e.children = dataHandle(befVal, value);
            //setMenuItem(props, 'children', value);
          }
        }
      };
    });
  }
  return groupItems;
};
