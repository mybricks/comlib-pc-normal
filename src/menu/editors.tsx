import {
  Data,
  findMenuItem,
  MenuItem,
  MenuTypeEnum,
  MenuModeEnum,
  OutputIds,
  uuid
} from './constants';

const getMenuItem = (
  { data, focusArea }: EditorResult<Data>,
  path?: keyof MenuItem
) => {
  if (!focusArea) return;
  const key = focusArea.dataset['menuItem'];
  const item = findMenuItem(data.dataSource, key, true);
  if (!path) {
    return item;
  }
  return item?.[path];
};
const setMenuItem = <T extends keyof MenuItem, P extends MenuItem[T]>(
  { data, focusArea }: EditorResult<Data>,
  path: T,
  value: P
) => {
  if (!focusArea) return;
  const key = focusArea.dataset['menuItem'];
  const item = findMenuItem(data.dataSource, key, true);
  if (item && path) {
    item[path] = value;
  }
  data.dataSource = [...data.dataSource];
};
export default {
  '@init': ({ data }: EditorResult<Data>) => {
    data.dataSource = [
      {
        title: '菜单1',
        defaultActive: true,
        key: uuid(),
        menuType: MenuTypeEnum.Menu
      }
    ];
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': [
    {
      title: '静态数据',
      type: 'Array',
      options: {
        getTitle: (item, index) => {
          if (!item.title) {
            item.title = `菜单${index + 1}`;
          }
          if (!item.key) {
            item.key = uuid();
          }
          return item.title;
        },
        onAdd: () => {
          return {
            key: uuid(),
            menuType: MenuTypeEnum.Menu
          };
        },
        items: [
          {
            title: '标题',
            type: 'TextArea',
            value: 'title',
            options: {
              autoSize: { maxRows: 1 }
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
          },
          {
            title: '类型',
            type: 'Select',
            options: [
              { label: '子菜单', value: MenuTypeEnum.Menu },
              { label: '父菜单', value: MenuTypeEnum.SubMenu },
              { label: '分组', value: MenuTypeEnum.Group }
            ],
            value: 'menuType'
          }
          // {
          //   title: '其他数据(Json)',
          //   type: 'Code',
          //   options: {
          //     title: '其他数据(Json)',
          //     language: 'json',
          //     width: 600,
          //     height: 100,
          //     minimap: {
          //       enabled: false
          //     }
          //   },
          //   value: 'value'
          // }
        ]
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.dataSource;
        },
        set({ data }: EditorResult<Data>, val: any[]) {
          data.dataSource = [...val];
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
  '[data-menu-item]': {
    title: '菜单项',
    items: [
      {
        title: '标题',
        type: 'Text',
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
          }
        }
      },
      {
        title: '默认激活',
        type: 'Switch',
        value: {
          get(props: EditorResult<Data>) {
            return getMenuItem(props, 'defaultActive');
          },
          set(props: EditorResult<Data>, value: boolean) {
            setMenuItem(props, 'defaultActive', value);
          }
        }
      },
      {
        title: '类型',
        type: 'Select',
        options: [
          { label: '子菜单', value: MenuTypeEnum.Menu },
          { label: '父菜单', value: MenuTypeEnum.SubMenu },
          { label: '分组', value: MenuTypeEnum.Group }
        ],
        value: {
          get(props: EditorResult<Data>) {
            return getMenuItem(props, 'menuType');
          },
          set(props: EditorResult<Data>, value: MenuTypeEnum) {
            setMenuItem(props, 'menuType', value);
          }
        }
      },
      {
        title: '子菜单配置',
        type: 'Array',
        ifVisible(props: EditorResult<Data>) {
          return (
            getMenuItem(props, 'menuType') === MenuTypeEnum.SubMenu ||
            getMenuItem(props, 'menuType') === MenuTypeEnum.Group
          );
        },
        options: {
          getTitle: (item, index) => {
            if (!item.title) {
              item.title = `子菜单${index + 1}`;
            }
            if (!item.key) {
              item.key = uuid();
            }
            return item.title;
          },
          onAdd: () => {
            return {};
          },
          items: [
            {
              title: '标题',
              type: 'TextArea',
              value: 'title',
              options: {
                autoSize: { maxRows: 1 }
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
            return getMenuItem(props, 'children');
          },
          set(props: EditorResult<Data>, value: any[]) {
            setMenuItem(props, 'children', [...value]);
          }
        }
      }
    ]
  }
};
