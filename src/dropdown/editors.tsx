import { Data } from './types';
import { uuid } from '../utils';
import { onClickSchema,  dynamicOnClickSchema } from './types'

interface Result {
  data: Data;
  style?: any;
}

let tempOptions: any = [],
  addOption,
  delOption;

const contentValue = {
  get({ data }: EditorResult<Data>) {
    return data.content;
  },
  set({ data }: EditorResult<Data>, value: string) {
    data.content = value;
  }
};

const itemLabelValue = {
  get({ data, focusArea }: EditorResult<Data>) {
    return get(data, focusArea, 'menuItem', 'label');
  },
  set({ data, focusArea }: EditorResult<Data>, value: string) {
    const res = get(data, focusArea, 'menuItem', 'obj');
    res.label = value;
  }
};

//设置初始的options
const initParams = (data: Data) => {
  tempOptions = data.options || [];
  addOption = (option) => {
    if (!data.options) data.options = [];
    data.options.push(option);
  };
  delOption = (index: number) => {
    data.options.splice(index, 1);
  };
};

function get(data: Data, focusArea: any, dataset: string, val: any, cb?: any) {
  if (!focusArea) return;
  const key = focusArea.dataset[dataset];
  const index = data.options.findIndex((def) => def.key === key);
  if (index === -1) return;
  if (cb) cb(index);
  if (val === 'obj') {
    return data.options[index] || {};
  }
  return data.options[index][val];
}

export default {
  '@inputConnected'({ data, input, output, slots }, fromPin, toPin) {
    if (toPin.id === 'setDynamicOptions' && data.isItem) {
      let itemSchema = {};
      if (fromPin.schema.type === 'array') {
        itemSchema = fromPin.schema.items;
        input.get('setDynamicOptions').setSchema(fromPin.schema);
        slots.get('item').inputs.get('itemData').setSchema(itemSchema);
      }
    }
  },
  '@init': ({ data, style }: Result) => {
    style.width = 'fit-content';
  },
  '@resize': {
    options: ['width']
  },
  '.ant-space-item': {
    '@dblclick': {
      type: 'text',
      value: contentValue
    }
  },
  ':root': {
    style: [
      {
        title: '展示区域',
        items: [
          {
            title: '提示内容',
            catelog: '默认',
            options: [{ type: 'font', config: { disableTextAlign: true } }],
            global: true,
            target({ id }) {
              return `.{id} .ant-dropdown-trigger`;
            }
          },
          {
            catelog: '默认',
            options: [{ type: 'border' }],
            global: true,
            target({ id }) {
              return `.{id} .dropdown`;
            }
          },
          {
            title: '提示内容箭头',
            catelog: '默认',
            options: [{ type: 'font', config: { disableTextAlign: true } }],
            global: true,
            target({ id }) {
              return `.{id} .anticon-down`;
            }
          },
        ]
      },
      {
        title: '下拉区域',
        items: [
          {
            title: '菜单',
            catelog: '默认',
            options: [{ type: 'background', config: { disableBackgroundImage: true } }],
            global: true,
            target({ id }) {
              return `.{id} .ant-dropdown-menu`;
            }
          },
          {
            title: '箭头',
            catelog: '默认',
            options: [{ type: 'background', config: { disableBackgroundImage: true } }],
            global: true,
            target({ id }) {
              return `.{id} .ant-dropdown-arrow:before`;
            }
          },
          {
            catelog: '默认',
            options: [{ type: 'border' }],
            global: true,
            target({ id }) {
              return `.{id} .ant-dropdown-arrow`;
            }
          },
          {
            title: '选项',
            catelog: '默认',
            options: [
              { type: 'font', config: { disableTextAlign: true } },
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            global: true,
            target({ id }) {
              return `.{id} .ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title`;
            }
          },
        ]
      },
      {
        title: '提示内容',
        catelog: 'Hover',
        options: [{ type: 'font', config: { disableTextAlign: true } }],
        global: true,
        target({ id }) {
          return `.{id} .ant-dropdown-trigger:hover`;
        }
      },
      {
        title: '提示内容箭头',
        catelog: 'Hover',
        options: [{ type: 'font', config: { disableTextAlign: true } }],
        global: true,
        target({ id }) {
          return `.{id} .ant-dropdown-trigger:hover .anticon-down`;
        }
      },
      {
        title: '选项',
        catelog: 'Hover',
        options: [
          { type: 'font', config: { disableTextAlign: true } },
          { type: 'background', config: { disableBackgroundImage: true } }
        ],
        global: true,
        target({ id }) {
          return `.{id} .ant-dropdown-menu-item:hover, .ant-dropdown-menu-submenu-title`;
        },
        domTarget({ focusArea, id }) {
          return `.{id} .ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title`;
        }
      },
      {
        title: '选项',
        catelog: '禁用',
        options: [
          { type: 'font', config: { disableTextAlign: true } },
          { type: 'background', config: { disableBackgroundImage: true } }
        ],
        global: true,
        target({ id }) {
          return `.{id} .ant-dropdown-menu-item-disabled`;
        }
      }
    ],
    items: ({ data, env }: EditorResult<Data>, ...cate) => {
      cate[0].title = '常规';
      cate[0].items = [
        {
          title: '提示内容',
          type: 'Text',
          options: {
            locale: true
          },
          description: '自定义开关关闭时, 可编辑提示内容',
          ifVisible({ data }: EditorResult<Data>) {
            return !data.isCustom;
          },
          value: contentValue
        },
        {
          title: '自定义',
          type: 'Switch',
          description: '开启后, 可在提示内容区自定义添加需要组件',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.isCustom;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.isCustom = value;
            }
          }
        },
        {
          title: '子项配置',
          type: 'Switch',
          description: '开启子项配置后, 可聚焦子项单独进行配置',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.isChildCustom;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.isChildCustom = value;
            }
          }
        },
        {
          title: '触发方式',
          type: 'Select',
          description: '触发下拉的行为,有悬浮、点击两种',
          options: [
            {
              label: '悬浮',
              value: 'hover'
            },
            {
              label: '点击',
              value: 'click'
            }
          ],
          value: {
            get({ data }: EditorResult<Data>) {
              return data.trigger || 'hover';
            },
            set({ data }: EditorResult<Data>, val: 'hover' | 'click') {
              data.trigger = val;
            }
          }
        },
        //选项弹出位置
        {
          title: '弹出位置',
          type: 'Select',
          description: '选项弹出位置，包括左下方、中下方、右下方、左上方、中上方、右上方',
          options: [
            { label: '左下方', value: 'bottomLeft' },
            { label: '中下方', value: 'bottomCenter' },
            { label: '右下方', value: 'bottomRight' },
            { label: '左上方', value: 'topLeft' },
            { label: '中上方', value: 'topCenter' },
            { label: '右上方', value: 'topRight' }
          ],
          value: {
            get({ data }: EditorResult<Data>) {
              return data.placement;
            },
            set(
              { data }: EditorResult<Data>,
              value:
                | 'bottomLeft'
                | 'bottomCenter'
                | 'bottomRight'
                | 'topLeft'
                | 'topCenter'
                | 'topCenter'
            ) {
              data.placement = value;
            }
          }
        },
        {
          title: '宽度',
          type: 'text',
          description: '下拉区域宽度,支持百分比和定宽',
          value: {
            get({ data }: EditorResult<Data>) {
              return String(data.width);
            },
            set({ data }: EditorResult<Data>, value: string) {
              if (/^\d+$/.test(value)) {
                data.width = `${value}px`;
              } else {
                data.width = value;
              }
            }
          }
        },
        {
          title: '选项配置',
          type: 'array',
          description: '配置选项，跳转链接可不填',
          options: {
            getTitle: ({ label }) => {
              return env.i18n(label);
            },
            onAdd: () => {
              const defaultOption = {
                label: `选项${tempOptions.length + 1}`,
                link: '',
                useIcon: false,
                icon: 'HomeOutlined',
                iconColor: 'rgba(0, 0, 0, 0.85)',
                key: uuid()
              };
              addOption(defaultOption);
              return defaultOption;
            },
            items: [
              {
                title: '选项标签',
                type: 'textarea',
                options: {
                  locale: true
                },
                value: 'label'
              },
              {
                title: '跳转链接(可选)',
                type: 'textarea',
                description: '下拉菜单中选项可跳转链接，可不填',
                value: 'link'
              },
              {
                title: '唯一标识',
                type: 'text',
                value: 'key'
              },
              {
                title: '禁用',
                type: 'switch',
                value: 'disabled'
              },
              {
                title: '图标',
                type: 'switch',
                value: 'useIcon'
              },
              {
                title: '图标库',
                type: 'icon',
                ifVisible(item) {
                  return item.useIcon || false;
                },
                value: 'icon'
              }
            ]
          },
          value: {
            get({ data }: EditorResult<Data>) {
              //得到一开始设置的option
              initParams(data);
              return data.options;
            },
            set({ data }: EditorResult<Data>, options) {
              // 更新选项
              options = options.map((option) => {
                return {
                  ...option
                  //checked: option.value === data.value
                };
              });
              data.options = options;
              tempOptions = options;
            }
          }
        },
        {
          title: '点击',
          type: '_Event',
          description: '选项点击事件',
          options: () => {
            return {
              outputId: 'onChange'
            };
          }
        }
      ];
      cate[1].title = '高级';
      cate[1].items = [
        {
          title: '动态选项',
          items:[
            //选项的配置
            {
              title: '动态选项',
              type: 'switch',
              description: '开启后，可以通过逻辑连线连接下拉菜单的输入项【设置选项】，传入动态选项数据',
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.isDynamic;
                },
                set({ data, input, output }: EditorResult<Data>, val: boolean) {
                  data.isDynamic = val;
                  const schema = {
                    title: '设置选项',
                    type: 'array',
                    items: {
                      title: '列项数据',
                      type: 'object',
                      properties: {
                        value: {
                          type: 'any'
                        },
                        disabled: {
                          type: 'boolean'
                        }
                      }
                    }
                  };
                  if (val) {
                    !input.get('setDynamicOptions') &&
                      input.add('setDynamicOptions', '设置选项', schema);
                    !output.get('setDynamicOptionsDone') &&
                      output.add('setDynamicOptionsDone', '设置选项完成', schema);

                    input.get('setDynamicOptions').setRels(['setDynamicOptionsDone']);

                    output.get("onChange")?.setSchema(dynamicOnClickSchema);
                  } else {
                    input.get('setDynamicOptions') && input.remove('setDynamicOptions');
                    output.get('setDynamicOptionsDone') && output.remove('setDynamicOptionsDone');
                    
                    output.get("onChange")?.setSchema(onClickSchema);
                  }
                }
              }
            },
            {
              title: '完整子项',
              type: 'switch',
              ifVisible({ data }: EditorResult<Data>) {
                return data.isDynamic;
              },
              description: '默认关闭, 作用域插槽内当前项为value字段, 打开后传递完整item',
              value: {
                get({ data }) {
                  return data.isItem;
                },
              set({ data }, value: boolean) {
                  data.isItem = value;
                }}
            }
          ]
        },
        {
          title: '冒泡',
          items:[
            {
              title: '提示内容禁止冒泡',
              description: '触发方式为点击时，默认关闭，阻止提示内容的点击事件冒泡',
              type:'switch',
              ifVisible({ data }: EditorResult<Data>) {
                return data.trigger === 'click';
              },
              value: {
                get({ data }) {
                  return data.contentBubble;
                },
               set({ data }, value: boolean) {
                  data.contentBubble = value;
                }}
            },
            {
              title: '选项禁止冒泡',
              description: '默认关闭，阻止选项的点击事件冒泡',
              type:'switch',
              value: {
                get({ data }) {
                  return data.eventBubble;
                },
               set({ data }, value: boolean) {
                  data.eventBubble = value;
                }}
            },
          ]
        }
      ]
    }
  },
  '[data-menu-item]': {
    title: '菜单项',
    style: [
      {
        title: '选项',
        catelog: '默认',
        options: [
          { type: 'font', config: { disableTextAlign: true } },
          { type: 'background', config: { disableBackgroundImage: true } }
        ],
        global: true,
        target({ focusArea, id }) {
          return `.{id} li[data-menu-item="${focusArea.dataset.menuItem}"]`;
        }
      },
      {
        title: '选项',
        catelog: 'Hover',
        options: [
          { type: 'font', config: { disableTextAlign: true } },
          { type: 'background', config: { disableBackgroundImage: true } }
        ],
        global: true,
        target({ focusArea, id }) {
          return `.{id} li[data-menu-item="${focusArea.dataset.menuItem}"]:hover`;
        },
        domTarget({ focusArea, id }) {
          return `.{id} li[data-menu-item="${focusArea.dataset.menuItem}"]`;
        }
      }
    ],
    items: ({}: EditorResult<Data>, cate1) => {
      (cate1.title = '菜单项'),
        (cate1.items = [
          {
            title: '选项标签',
            type: 'Text',
            options: {
              locale: true
            },
            value: itemLabelValue
          },
          {
            title: '跳转链接(可选)',
            type: 'Text',
            value: {
              get({ data, focusArea }: EditorResult<Data>) {
                return get(data, focusArea, 'menuItem', 'link');
              },
              set({ data, focusArea }: EditorResult<Data>, value: string) {
                const res = get(data, focusArea, 'menuItem', 'obj');
                res.link = value;
              }
            }
          },
          {
            title: '唯一标识',
            type: 'Text',
            value: {
              get({ data, focusArea }: EditorResult<Data>) {
                return get(data, focusArea, 'menuItem', 'key');
              },
              set({ data, focusArea }: EditorResult<Data>, value: string) {
                const res = get(data, focusArea, 'menuItem', 'obj');
                res.key = value;
              }
            }
          },
          {
            title: '禁用',
            type: 'switch',
            value: {
              get({ data, focusArea }: EditorResult<Data>) {
                return get(data, focusArea, 'menuItem', 'disabled');
              },
              set({ data, focusArea }: EditorResult<Data>, value: string) {
                const res = get(data, focusArea, 'menuItem', 'obj');
                res.disabled = value;
              }
            }
          },
          {
            title: '图标',
            type: 'switch',
            value: {
              get({ data, focusArea }: EditorResult<Data>) {
                return get(data, focusArea, 'menuItem', 'useIcon');
              },
              set({ data, focusArea }: EditorResult<Data>, value: string) {
                const res = get(data, focusArea, 'menuItem', 'obj');
                res.useIcon = value;
              }
            }
          },
          {
            title: '图标库',
            type: 'icon',
            ifVisible({ data, focusArea }: EditorResult<Data>) {
              return get(data, focusArea, 'menuItem', 'useIcon');
            },
            value: {
              get({ data, focusArea }: EditorResult<Data>) {
                return get(data, focusArea, 'menuItem', 'icon');
              },
              set({ data, focusArea }: EditorResult<Data>, value: string) {
                const res = get(data, focusArea, 'menuItem', 'obj');
                res.icon = value;
              }
            }
          }
        ]);
    }
  }
};
