import { Data, InputIds, OutputIds, SlotIds } from '../constants';
import TabEditor from './tab';
import { createItem, addEventIO } from './common';
import { createStyleForDefault, createStyleForActive, createStyleForBar, setDynamicTabsIO } from './utils';
import { getFilterSelector } from '../../utils/cssSelector';

const setSlotLayout = (slot, val) => {
  if (!slot) return;
  if (val.position === 'smart') {
    slot.setLayout('smart');
  } else if (val.position === 'absolute') {
    slot.setLayout(val.position);
  } else if (val.display === 'flex') {
    if (val.flexDirection === 'row') {
      slot.setLayout('flex-row');
    } else if (val.flexDirection === 'column') {
      slot.setLayout('flex-column');
    }
  }
};

export default {
  ':slot': {},
  '@resize': {
    options: ['width', 'height']
  },
  ':root': {
    items({ }: EditorResult<Data>, cate1, cate2, cate3) {
      cate1.title = '常规';
      cate1.items = [
        {
          title: '插槽布局',
          type: 'layout',
          ifVisible({ data }: EditorResult<Data>) {
            return !data.hideSlots;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.slotStyle;
            },
            set({ slots, data }: EditorResult<Data>, val: any) {
              if (!data.slotStyle) {
                data.slotStyle = {};
              }
              data.slotStyle = {
                ...data.slotStyle,
                ...val
              };
              data.tabList.forEach(item => {
                const slotInstance = slots.get(item.id);
                setSlotLayout(slotInstance, val);
              })
            }
          }
        },
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
              const slotInstance = slots.get(newItem.id);
              slotInstance.setLayout('smart');
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
            { value: 'editable-card', label: '卡片' },
            { value: 'line', label: '简约' },
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
          title: '尺寸',
          type: 'Select',
          options: [
            {
              label: '大',
              value: 'large'
            },
            {
              label: '中',
              value: 'middle'
            },
            {
              label: '小',
              value: 'small'
            }
          ],
          value: {
            get({ data }: EditorResult<Data>) {
              return data.size || 'middle';
            },
            set({ data }: EditorResult<Data>, val: 'large' | 'middle' | 'small') {
              data.size = val;
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
          title: '标签页隐藏时是否渲染',
          type: 'Switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.forceRender;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.forceRender = value;
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
            set({ data, input, output }: EditorResult<Data>, value: boolean) {
              if (value) {
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
                output.add(OutputIds.SetShowTabComplete, '完成', { type: 'any' });
                input.get(InputIds.SetShowTab).setRels([OutputIds.SetShowTabComplete])
              } else {
                input.remove(InputIds.SetShowTab);
                output.remove(OutputIds.SetShowTabComplete)
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
          title: '动态标签页',
          type: 'switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.dynamicTabs;
            },
            set(props: EditorResult<Data>, val: boolean) {
              const { data } = props
              data.dynamicTabs = val
              data.hideSlots = val
              setDynamicTabsIO(props)
            }
          }
        },
        {
          title: '可新增',
          type: 'switch',
          ifVisible({ data }: EditorResult<Data>) {
            return data.type === 'editable-card';
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return !data.hideAdd;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              data.hideAdd = !val
            }
          }
        },
        {
          title: '可删除',
          type: 'switch',
          ifVisible({ data }: EditorResult<Data>) {
            return data.type === 'editable-card';
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return !!data.closable;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              data.closable = val;
              data.tabList = data.tabList.map((tab) => {
                tab.closable = val
                return tab
              })
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
              title: '标签页新增',
              type: '_Event',
              ifVisible({ data }: EditorResult<Data>) {
                return data.type === 'editable-card';
              },
              options() {
                return {
                  outputId: OutputIds.AddTab
                }
              }
            },
            {
              title: '标签页删除',
              type: '_Event',
              ifVisible({ data }: EditorResult<Data>) {
                return data.type === 'editable-card';
              },
              options() {
                return {
                  outputId: OutputIds.RemoveTab
                }
              }
            },
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
        catelog: '默认',
        ...createStyleForDefault({
          initValue: {
            color: 'rgba(0,0,0,.85)'
          },
          target: ({ id }: EditorResult<Data>) =>
            `.ant-tabs .ant-tabs-nav-wrap .ant-tabs-tab:not(.ant-tabs-tab-active)${getFilterSelector(
              id
            )}`
        })
      },
      {
        catelog: '默认',
        title: '标签头',
        options: ['padding', { type: 'background', config: { disableBackgroundImage: true } }],
        target: '.ant-tabs .ant-tabs-nav-wrap'
      },
      {
        catelog: '默认',
        title: '标签外边距',
        options: ['margin'],
        target: '.ant-tabs:not(.ant-tabs-card) .ant-tabs-nav-wrap .ant-tabs-tab+.ant-tabs-tab'
      },
      {
        catelog: '默认',
        title: '底部横线',
        options: ['border'],
        target: '.ant-tabs-top>.ant-tabs-nav:before'
      },
      {
        catelog: '默认',
        ...createStyleForBar()
      },
      {
        catelog: 'Hover',
        title: '标签',
        options: [
          { type: 'font', config: { disableTextAlign: true } },
          { type: 'background', config: { disableBackgroundImage: true } }
        ],
        target: '.ant-tabs-tab:hover'
      },
      {
        catelog: '激活',
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
