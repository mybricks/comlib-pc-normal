import { Data, InputIds, OutputIds, SlotIds } from '../constants';
import TabEditor from './tab';
import { createItem, addEventIO } from './common';
import { createStyleForDefault, createStyleForActive, createStyleForBar } from './utils';
import { getFilterSelector } from '../../utils/cssSelector';

export default {
  ':root': {
    items({}: EditorResult<Data>, cate1, cate2, cate3) {
      cate1.title = '常规';
      cate1.items = [
        {
          title: '添加标签页',
          type: 'Button',
          value: {
            set({ data, slots, output }: EditorResult<Data>) {
              const newItem = createItem(data);
              slots.add({
                id: newItem.id,
                title: newItem.name
              });
              addEventIO(output, newItem);
              data.tabList.push(newItem);
              // slots.add({
              //   id,
              //   title: `标签页${data.tabList.length + 1}`,
              //   type: 'scope',
              //   inputs: [
              //     {
              //       id: `${id}_render`,
              //       title: '首次显示',
              //       schema: DefaultSchema
              //     },
              //     {
              //       id: `${id}_into`,
              //       title: '显示',
              //       schema: DefaultSchema
              //     },
              //     {
              //       id: `${id}_leave`,
              //       title: '隐藏',
              //       schema: DefaultSchema
              //     }
              //   ]
              // });
            }
          }
        },
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
          title: '标签位置',
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
                  input.add({
                    id: InputIds.SetShowTab,
                    title: '设置显示tab',
                    schema: {
                      type: 'array',
                      items: {
                        title: '显示tab的Id',
                        type: 'number'
                      }
                    },
                    desc: '设置显示的标签页，下标从0开始'
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
        },
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
    },
    style: [
      {
        catelog: "默认",
        ... createStyleForDefault({
          initValue: {
            color: 'rgba(0,0,0,.85)'
          },
          target: ({ id }: EditorResult<Data>) =>
            `.ant-tabs .ant-tabs-nav-wrap .ant-tabs-tab:not(.ant-tabs-tab-active)${getFilterSelector(
              id
            )}`
        }),
      },
      {
        catelog: "默认",
        ...createStyleForBar()
      },
      {
        catelog: "激活",
        ...createStyleForActive({
          initValue: {
            color: '#1890ff'
          },
          target: ({ id }: EditorResult<Data>) =>
            `.ant-tabs .ant-tabs-nav-wrap .ant-tabs-tab-active${getFilterSelector(id)}`
        })
      }
    ]
  },
  ...TabEditor
};
