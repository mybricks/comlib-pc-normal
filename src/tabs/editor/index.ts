import { Data, InputIds, OutputIds, SlotIds } from '../constants';
import TabEditor from './tab';
import { createItem, addEventIO } from './common';
import {
  createStyleForDefault,
  createStyleForActive,
  createStyleForBar,
  setDynamicTabsIO,
  createFontStyleForActive
} from './utils';
import { getFilterSelector } from '../../utils/cssSelector';
import { setSlotLayout } from '../../utils/editorTools'

export default {
  ':slot': {},
  '@resize': {
    options: ['width', 'height']
  },
  '@init': ({ style }) => {
    style.height = 'auto';
  },
  ':root': {
    items({ }: EditorResult<Data>, cate1, cate2, cate3) {
      cate1.title = '常规';
      cate1.items = [
        {
          title: '插槽布局',
          type: 'layout',
          description: '配置插槽内部的布局类型',
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

              data.slotStyle = val

              data.tabList.forEach((item) => {
                const slotInstance = slots.get(item.id);
                setSlotLayout(slotInstance, val);
              });
            }
          }
        },
        {
          title: '新增分页面版',
          type: 'Button',
          description: '新增分页面版，增加一个标签页插槽、标签页显示和隐藏输出',
          value: {
            set({ data, slots, output, env }: EditorResult<Data>) {
              const newItem = createItem(data);
              slots.add({
                id: newItem.id,
                title: newItem.name
              });
              const slotInstance = slots.get(newItem.id);
              setSlotLayout(slotInstance, data.slotStyle);
              addEventIO(output, newItem, env);
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
          title: '尺寸',
          type: 'Select',
          description: '标签页大小, 默认是中(middle)',
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
          description: '标签位置, 默认是上部(top)',
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
          description: '标签页是否居中',
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
          description: '开启后，禁止点击切换标签页',
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
          title: '隐藏时是否渲染内容',
          type: 'Switch',
          description: '标签页被隐藏时是否渲染 DOM 结构',
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
          description:
            '开启后，可以通过逻辑连线连接标签页的输入项【设置显示tab】设置显示（激活）的标签页',
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
                input.get(InputIds.SetShowTab).setRels([OutputIds.SetShowTabComplete]);
              } else {
                input.remove(InputIds.SetShowTab);
                output.remove(OutputIds.SetShowTabComplete);
              }
              data.useDynamicTab = value;
            }
          }
        },
        {
          title: '隐藏插槽占位',
          type: 'Switch',
          description: '是否隐藏插槽占位',
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
          description: '开启后，可以通过逻辑连线连接标签页的输入项【设置标签页数据】动态设置标签页',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.dynamicTabs;
            },
            set(props: EditorResult<Data>, val: boolean) {
              const { data } = props;
              data.dynamicTabs = val;
              data.hideSlots = val;
              setDynamicTabsIO(props);
            }
          }
        },
        {
          title: '可新增',
          type: 'switch',
          description: '开启后，可以点击新增标签页',
          value: {
            get({ data }: EditorResult<Data>) {
              return !data.hideAdd;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              data.hideAdd = !val;
            }
          }
        },
        {
          title: '新增插槽',
          type: 'switch',
          description: '开启后，可以通过插槽配置新增按钮',
          ifVisible({ data }: EditorResult<Data>) {
            return !data.hideAdd;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.useAddIcon;
            },
            set({ data, slot }: EditorResult<Data>, val: boolean) {
              data.useAddIcon = val;
              const hasSlot = slot.get(SlotIds.AddIcon);
              if (val) {
                !hasSlot && slot.add(SlotIds.AddIcon, '新增按钮');
              } else {
                hasSlot && slot.remove(SlotIds.AddIcon);
              }
            }
          }
        },
        {
          title: '可删除',
          type: 'switch',
          description: '开启后，可以点击删除按钮删除标签页',
          value: {
            get({ data }: EditorResult<Data>) {
              return !!data.closable;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              data.closable = val;
              data.tabList = data.tabList.map((tab) => {
                tab.closable = val;
                return tab;
              });
            }
          }
        },
        {
          ifVisible({ data }: EditorResult<Data>) {
            return data.closable;
          },
          title: '点击删除按钮时',
          type: "radio",
          description: "如选择自定义删除，需要手动处理删除逻辑",
          options: [
            { label: "直接删除", value: false },
            { label: "自定义", value: true },
          ],
          value: {
            get({ data }: EditorResult<Data>) {
              return data.useCustomClose ?? false;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.useCustomClose = value;
            }
          }
        },
        {
          title: "不展示「更多」按钮",
          description: "开启后，当标签项较多时，支持滚动，但不展示「更多」按钮",
          type: "Switch",
          value: {
            get({ data }: EditorResult<Data>) {
              return data.hideMoreIcon;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.hideMoreIcon = value;
            }
          }
        },
        {
          title: '额外内容',
          items: [
            {
              title: '左侧',
              type: 'Switch',
              description: '开启后，左侧新增【左侧内容】插槽',
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
              description: '开启后，右侧新增【右侧内容】插槽',
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
            },
            {
              ifVisible({ data }: EditorResult<Data>) {
                return data.useRigthExtra;
              },
              title: "右侧额外内容位置",
              type: "radio",
              description: "如果「标签位置」为左、右时，则浮动方向对应为上浮动，下浮动",
              options: [
                { label: "左浮动", value: "left" },
                { label: "右浮动", value: "right" },
              ],
              value: {
                get({ data }) {
                  return data.rightExtraPosition || "right";
                },
                set({ data }, value) {
                  data.rightExtraPosition = value;
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
              description: '新增标签页时触发【标签页新增】输出项事件',
              options() {
                return {
                  outputId: OutputIds.AddTab
                };
              }
            },
            {
              title: '标签页删除',
              type: '_Event',
              description: '删除标签页时触发【标签页删除】输出项事件',
              options() {
                return {
                  outputId: OutputIds.RemoveTab
                };
              }
            },
            {
              title: '标签页点击',
              type: '_Event',
              description: '点击标签页时触发【标签页点击】输出项事件',
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
        title: '外边距',
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
        ...createFontStyleForActive({
          initValue: {
            color: '#1890ff'
          },
          title: '标签文本',
          target: ({ id }: EditorResult<Data>) =>
            `.ant-tabs .ant-tabs-nav-wrap .ant-tabs-tab-active${getFilterSelector(
              id
            )} div.ant-tabs-tab-btn span`
        })
      },
      {
        catelog: '激活',
        ...createStyleForActive({
          title: '标签',
          initValue: {
            color: '#1890ff'
          },
          target: ({ id }: EditorResult<Data>) =>
            `.ant-tabs .ant-tabs-nav-wrap .ant-tabs-tab-active${getFilterSelector(id)}`
        })
      },
      {
        catelog: '激活',
        ...createStyleForBar()
      }
    ]
  },
  ...TabEditor
};
