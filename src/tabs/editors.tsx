import { uuid } from '../utils';
import { Data, InputIds, OutputIds, SlotIds } from './constants';

const DefaultSchema = {
  type: 'any'
};

const getId = (data) => {
  const last = data.tabList.slice().pop();
  const index = parseInt(last.id.substring(3)) + 1;
  return `tab${index}`;
};

export default {
  ':root': ({}: EditorResult<Data>, cate1, cate2, cate3) => {
    cate1.title = '常规';
    cate1.items = [
      {
        title: '添加标签页',
        type: 'Button',
        value: {
          set({ data, slots }: EditorResult<Data>) {
            const key = uuid();
            const id = getId(data);
            slots.add({
              id,
              title: `标签页${data.tabList.length + 1}`,
              type: 'scope',
              inputs: [
                {
                  id: `${id}_render`,
                  title: '首次显示',
                  schema: DefaultSchema
                },
                {
                  id: `${id}_into`,
                  title: '显示',
                  schema: DefaultSchema
                },
                {
                  id: `${id}_leave`,
                  title: '隐藏',
                  schema: DefaultSchema
                }
              ]
            });
            data.tabList.push({
              id,
              key,
              name: '新标签页'
            });
          }
        }
      },
      {
        title: '事件',
        items: [
          {
            title: '标签页点击',
            type: '_Event',
            options: () => {
              return {
                outputId: OutputIds.OnTabClick
              };
            }
          }
        ]
      }
    ];
    cate2.title = '样式';
    cate2.items = [
      {
        title: '外观',
        type: 'Select',
        options: [
          { value: 'card', label: '卡片' },
          { value: 'line', label: '简约' }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.type;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.type = value;
          }
        }
      },
      {
        title: '页签位置',
        type: 'Select',
        options: [
          { label: '上', value: 'top' },
          { label: '左', value: 'left' },
          { label: '右', value: 'right' },
          { label: '下', value: 'bottom' }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.tabPosition || 'top';
          },
          set({ data }: EditorResult<Data>, value: 'left' | 'top' | 'bottom' | 'right') {
            data.tabPosition = value;
          }
        }
      },
      {
        title: '标签居中',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.centered;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.centered = value;
          }
        }
      }
    ];

    cate3.title = '高级';
    cate3.items = [
      {
        title: '额外内容',
        items: [
          {
            title: '左侧',
            type: 'Switch',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.useLeftExtra;
              },
              set({ data, slot }: EditorResult<Data>, value: boolean) {
                data.useLeftExtra = value;
                const hasSlot = slot.get(SlotIds.LeftExtra);
                if (value) {
                  !hasSlot && slot.add(SlotIds.LeftExtra, '左侧内容');
                } else {
                  hasSlot && slot.remove(SlotIds.LeftExtra);
                }
              }
            }
          },
          {
            title: '右侧',
            type: 'Switch',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.useRigthExtra;
              },
              set({ data, slot }: EditorResult<Data>, value: boolean) {
                data.useRigthExtra = value;
                const hasSlot = slot.get(SlotIds.RigthExtra);
                if (value) {
                  !hasSlot && slot.add(SlotIds.RigthExtra, '右侧内容');
                } else {
                  hasSlot && slot.remove(SlotIds.RigthExtra);
                }
              }
            }
          }
        ]
      },
      {
        title: '禁止点击切换',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.prohibitClick;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.prohibitClick = value;
          }
        }
      },
      {
        title: '动态设置显示tab',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useDynamicTab;
          },
          set({ data, input }: EditorResult<Data>, value: boolean) {
            const hasEvent = input.get(InputIds.SetShowTab);
            if (value) {
              !hasEvent &&
                input.add(InputIds.SetShowTab, '设置显示tab', {
                  type: 'array',
                  items: {
                    title: '显示tab的Id',
                    type: 'string'
                  }
                });
            } else {
              hasEvent && input.remove(InputIds.SetShowTab);
            }
            data.useDynamicTab = value;
          }
        }
      },
      {
        title: '隐藏插槽占位',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return !!data.hideSlots;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.hideSlots = value;
          }
        }
      }
    ];
  },
  '.ant-tabs-tab': ({}: EditorResult<Data>, cate1, cate2, cate3) => {
    cate1.title = '常规';
    cate1.items = [
      {
        title: '名称',
        type: 'Text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const { index } = focusArea;
            return data.tabList[index]?.name;
          },
          set({ data, focusArea, input }: EditorResult<Data>, title: string) {
            const { index } = focusArea;
            const item = data.tabList[index];
            item.name = title;
            input.setTitle(item.key, `${title}的通知数`);
          }
        }
      },
      {
        title: 'id',
        type: 'Text',
        options: {
          readonly: true
        },
        description: '指定后可作为tab页签的唯一标识，控制页签的激活状态',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const { index } = focusArea;
            return data.tabList[index]?.id;
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            const { index } = focusArea;
            const item = data.tabList[index];
            item.id = value;
          }
        }
      },
      {
        title: '向前移动',
        type: 'Button',
        value: {
          get({ focusArea }: EditorResult<Data>) {
            return focusArea.index;
          },
          set({ data, focusArea }: EditorResult<Data>) {
            const { index } = focusArea;
            const { tabList } = data;
            if (index === 0) return;
            [tabList[index - 1], tabList[index]] = [tabList[index], tabList[index - 1]];
          }
        }
      },
      {
        title: '向后移动',
        type: 'Button',
        value: {
          get({ focusArea }: EditorResult<Data>) {
            return focusArea.index;
          },
          set({ data, focusArea }: EditorResult<Data>) {
            const { index } = focusArea;
            const { tabList } = data;
            if (index === tabList.length - 1) return;
            [tabList[index], tabList[index + 1]] = [tabList[index + 1], tabList[index]];
          }
        }
      },
      {
        title: '删除',
        type: 'Button',
        value: {
          get({ focusArea }: EditorResult<Data>) {
            return focusArea.index;
          },
          set({ data, focusArea, slots }: EditorResult<Data>) {
            if (data.tabList.length > 1) {
              slots.remove(data.tabList[focusArea.index]?.id);
              data.tabList.splice(focusArea.index, 1);
            }
          }
        }
      }
    ];

    cate2.title = '样式';
    cate2.items = [
      {
        title: '显示icon',
        type: 'Switch',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { index } = focusArea;
            return data.tabList[index]?.showIcon;
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            if (!focusArea) return;
            const { index } = focusArea;
            data.tabList[index].showIcon = value;
            data.tabList[index].icon = 'BellOutlined';
          }
        }
      },
      {
        title: '图标自定义',
        type: 'Switch',
        description: '可选择是否需要自定义图标',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          const { index } = focusArea;
          return data.tabList[index].showIcon;
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const { index } = focusArea;
            return data.tabList[index].isChoose;
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            const { index } = focusArea;
            data.tabList[index].isChoose = value;
            if (!data.tabList[index].isChoose) {
              data.tabList[index].icon = 'BellOutlined';
            }
          }
        }
      },
      {
        title: '选择图标',
        type: 'icon',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          const { index } = focusArea;
          return data.tabList[index].isChoose;
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const { index } = focusArea;
            return data.tabList[index].icon;
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            const { index } = focusArea;
            data.tabList[index].icon = value;
          }
        }
      },
      {
        title: '文字提示',
        type: 'TextArea',
        options: {
          placeholder: 'tab标题的文字提示，不填写则不显示'
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { index } = focusArea;
            return data.tabList[index]?.tooltipText;
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const { index } = focusArea;
            data.tabList[index].tooltipText = value;
          }
        }
      },
      {
        title: '支持关闭',
        type: 'Switch',
        ifVisible({ data }: EditorResult<Data>) {
          return data.type === 'editable-card';
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { index } = focusArea;
            return data.tabList[index]?.closable;
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            if (!focusArea) return;
            const { index } = focusArea;
            data.tabList[index].closable = value;
          }
        }
      }
    ];

    cate3.title = '高级';
    cate3.items = [
      {
        title: '支持动态通知显示',
        type: 'Switch',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { index } = focusArea;
            return !!data.tabList[index]?.dynamic;
          },
          set({ data, focusArea, input }: EditorResult<Data>, value: boolean) {
            if (!focusArea) return;
            const { index } = focusArea;
            const item = data.tabList[index];
            data.tabList[index].dynamic = value;
            if (value) {
              input.add(item.key, `${item.name}的通知数`, {
                type: 'string'
              });
            } else {
              input.remove(`${item.key}`);
            }
          }
        }
      },
      {
        title: '权限控制',
        items: [
          {
            title: '权限Key',
            description: '唯一标识的权限key',
            type: 'text',
            value: {
              get({ data, focusArea }) {
                if (!focusArea) return;
                const { index } = focusArea;
                const item = data.tabList[index];
                return item.permissionKey;
              },
              set({ data, focusArea }, value: string) {
                if (!focusArea) return;
                const { index } = focusArea;
                const item = data.tabList[index];
                item.permissionKey = value;
              }
            }
          }
        ]
      }
    ];
    return { title: '标签页' };
  }
};
