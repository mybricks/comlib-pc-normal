import {
  Data,
  findMenuItem,
  MenuItem,
  MenuTypeEnum,
  MenuModeEnum,
  OutputIds,
  uuid
} from '../constants';
import {
  removeOutput,
  dataHandle,
  addOutput,
  itemHandle,
  getMenuItem,
  setMenuItem,
  removeKeys,
  addKeys,
  dataSourceHandle
} from '../utils';
import { groupItemArr } from './groupItemArr';
import { subItemsEvent } from './subItemsEvent';
import { groupItemEvent } from './groupItemEvent';
import { itemEvent } from './itemEvent';
import { subItemArr } from './subItemsArr';
import IconEditor from './iconEditor';

export default {
  '@init': ({ data, output, style }: EditorResult<Data>) => {
    const schema = {
      type: 'any'
    };
    output.add(data.dataSource[0]._key, `点击${data.dataSource[0].title}`, schema);
  },
  '@resize': {
    options: ['width']
  },
  ':root': {
    items: [
      {
        title: '静态数据',
        type: 'Tree',
        options: {
          getTitle: (item) => {
            if (!item.key) {
              item.key = uuid();
            }
            return item.title || `菜单${item.key}`;
          },
          onAdd: () => {
            const key = uuid();
            return {
              key,
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
            },
            {
              title: '类型',
              type: 'Select',
              options: [
                { label: '子菜单', value: MenuTypeEnum.Menu },
                { label: '父菜单', value: MenuTypeEnum.SubMenu },
                { label: '分组菜单', value: MenuTypeEnum.Group }
              ],
              value: 'menuType'
            }
          ]
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.dataSource;
          },
          set(props: EditorResult<Data>, val: any[]) {
            //删除菜单项操作
            if (val.length < props.data.dataSource.length) {
              removeOutput(props.data.dataSource, val, props.output);
            }
            //增加菜单项操作
            if (val.length > props.data.dataSource.length) {
              addOutput(props.data.dataSource, val, props.output);
            }
            if (val.length === props.data.dataSource.length) {
              for (let i = 0; i < val.length; i++) {
                //如果从子菜单切换到父菜单，去除该项的点击事件
                if (
                  val[i].menuType === MenuTypeEnum.SubMenu &&
                  props.data.dataSource[i].menuType === MenuTypeEnum.Menu
                ) {
                  props.output.remove(val[i]._key);
                } else if (val[i].menuType === MenuTypeEnum.Menu) {
                  //如果从父菜单切换到子菜单，去除该项子项的点击事件
                  props.output.add(val[i]._key, `点击${val[i].title}`, { type: 'any' });
                  removeKeys(val[i].children || [], props);
                }
              }
            }

            //根据激活项唯一处理数据源(删除菜单项，增加菜单项，仅改变菜单项配置)
            //let newVal =
            //dataHandle(data.dataSource, val);
            props.data.dataSource = dataHandle(props.data.dataSource, val);
          }
        }
      },
      {
        title: '样式',
        type: 'Select',
        options: [
          { label: '水平', value: MenuModeEnum.Horizontal },
          { label: '垂直', value: MenuModeEnum.Vertical },
          { label: '内联', value: MenuModeEnum.Inline }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.mode;
          },
          set({ data }: EditorResult<Data>, val: MenuModeEnum) {
            data.mode = val;
          }
        }
      },
      {
        title: '点击',
        type: '_Event',
        options: {
          outputId: OutputIds.ClickMenu
        }
      }
    ],
    style: [
      {
        items: [
          {
            title: '菜单项',
            catelog: '默认',
            options: [
              { type: 'font', config: { disableTextAlign: true } },
              'border',
              'padding',
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            target: 'ul li:not(.ant-menu-item-selected)'
          },
          {
            title: '菜单项',
            catelog: '选中',
            options: [
              { type: 'font', config: { disableTextAlign: true } },
              'border',
              'padding',
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            target: 'ul li.ant-menu-item-selected'
          },
          {
            title: '选中标记',
            catelog: '选中',
            options: ['border'],
            target: 'ul li.ant-menu-item-selected:after'
          },
          {
            title: '菜单项',
            catelog: 'Hover',
            options: [
              { type: 'font', config: { disableTextAlign: true } },
              'border',
              'padding',
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            target: 'ul li:hover'
          }
        ]
      }
    ]
  },
  '[data-menu-item]': {
    items: (props: EditorResult<Data>, cate1, cate2) => {
      cate1.title = '菜单项';

      cate1.items = [
        {
          title: '标题',
          type: 'Text',
          options: {
            locale: true
          },
          value: {
            get(props: EditorResult<Data>) {
              return getMenuItem(props, 'title');
            },
            set(props: EditorResult<Data>, value: string) {
              setMenuItem(props, 'title', value);
            }
          }
        },
        {
          title: '唯一标识',
          type: 'Text',
          value: {
            get(props: EditorResult<Data>) {
              return getMenuItem(props, 'key');
            },
            set(props: EditorResult<Data>, value: string) {
              setMenuItem(props, 'key', value);
              props.output.add(value, `点击${getMenuItem(props, 'title')}`, { type: 'any' });
            }
          }
        },
        {
          title: '默认激活',
          type: 'Switch',
          ifVisible(props: EditorResult<Data>) {
            return getMenuItem(props, 'menuType') === MenuTypeEnum.Menu;
          },
          value: {
            get(props: EditorResult<Data>) {
              return getMenuItem(props, 'defaultActive');
            },
            set(props: EditorResult<Data>, value: boolean) {
              setMenuItem(props, 'defaultActive', value);

              //默认激活的互斥, 整体数据处理
              if (value === true) {
                let selectedKey = getMenuItem(props, 'key');
                //对dataSource整体遍历
                let newval = itemHandle(selectedKey, props.data.dataSource);
                props.data.dataSource = newval;
              }
            }
          }
        },
        ...IconEditor,
        {
          title: '类型',
          type: 'Select',
          options: [
            { label: '子菜单', value: MenuTypeEnum.Menu },
            { label: '父菜单', value: MenuTypeEnum.SubMenu }
          ],
          value: {
            get(props: EditorResult<Data>) {
              return getMenuItem(props, 'menuType');
            },
            set(props: EditorResult<Data>, value: MenuTypeEnum) {
              //1、从子菜单，切换到父菜单，去除默认勾选状态，且去除其选中状态
              if (
                value === MenuTypeEnum.SubMenu &&
                getMenuItem(props, 'menuType') === MenuTypeEnum.Menu
              ) {
                setMenuItem(props, 'defaultActive', false);
                const childKey = uuid();
                const defaultChild = [
                  {
                    title: '子菜单1',
                    key: childKey,
                    _key: childKey,
                    menuType: MenuTypeEnum.Menu,
                    children: []
                  }
                ];
                setMenuItem(props, 'children', defaultChild);
                props.output.add(childKey, `点击${getMenuItem(props, 'children')[0].title}`, {
                  type: 'any'
                });
                props.output.remove(getMenuItem(props, '_key'));
                //2、从父菜单，切换到子菜单，去除子项点击事件输出
              } else if (
                value === MenuTypeEnum.Menu &&
                getMenuItem(props, 'menuType') === MenuTypeEnum.SubMenu
              ) {
                props.output.add(getMenuItem(props, '_key'), `点击${getMenuItem(props, 'title')}`, {
                  type: 'any'
                });

                if (
                  getMenuItem(props, 'children') !== undefined ||
                  getMenuItem(props, 'children').length !== 0
                ) {
                  removeKeys(getMenuItem(props, 'children'), props);
                }
                setMenuItem(props, 'children', []);
              }
              setMenuItem(props, 'menuType', value);
            }
          }
        },
        ...subItemArr(props),
        //...groupItemArr(props),
        {
          items: [
            {
              title: '删除',
              type: 'Button',
              value: {
                set(props: EditorResult<Data>) {
                  //1.删除所有项的key
                  props.output.remove(getMenuItem(props).key);
                  if (getMenuItem(props).children) {
                    removeKeys(getMenuItem(props), props);
                  }
                  let newVal = props.data.dataSource.filter((item) => {
                    return item !== getMenuItem(props);
                  });
                  props.data.dataSource = newVal;
                }
              }
            }
          ]
        }
      ];

      cate2.title = '事件';
      cate2.items = [...itemEvent(props), ...subItemsEvent(props), ...groupItemEvent(props)];
    },
    style: [
      {
        items: [
          {
            title: '菜单项',
            catelog: '默认',
            options: [
              { type: 'font', config: { disableTextAlign: true } },
              'border',
              'padding',
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            target({ focusArea }) {
              return `li[data-menu-item="${focusArea.dataset.menuItem}"]:not(.ant-menu-item-selected)`;
            }
          },
          {
            title: '菜单项',
            catelog: '选中',
            options: [
              { type: 'font', config: { disableTextAlign: true } },
              'border',
              'padding',
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            target({ focusArea }) {
              return `li[data-menu-item="${focusArea.dataset.menuItem}"].ant-menu-item-selected`;
            }
          },
          {
            title: '选中标记',
            catelog: '选中',
            options: ['border'],
            target({ focusArea }) {
              return `li[data-menu-item="${focusArea.dataset.menuItem}"].ant-menu-item-selected:after`;
            }
          },
          {
            title: '菜单项',
            catelog: 'Hover',
            options: [
              { type: 'font', config: { disableTextAlign: true } },
              'border',
              'padding',
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            target({ focusArea }) {
              return `li[data-menu-item="${focusArea.dataset.menuItem}"]:hover`;
            }
          }
        ]
      }
    ]
  }
};
