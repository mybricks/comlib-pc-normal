import { Data, InputIds, OutputIds, SlotIds } from '../constants';
import TabEditor from './tab';
import { createItem } from './common';
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
          title: '添加卡片',
          type: 'Button',
          description: '增加一个卡片插槽',
          value: {
            set({ data, slots, output, env }: EditorResult<Data>) {
              const newItem = createItem(data);
              slots.add({
                id: newItem.id,
                title: newItem.name
              });
              const slotInstance = slots.get(newItem.id);
              setSlotLayout(slotInstance, data.slotStyle);
              data.tabList.push(newItem);
              // slots.add({
              //   id,
              //   title: `卡片${data.tabList.length + 1}`,
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
          title: '可新增',
          type: 'switch',
          description: '开启后，可以点击新增卡片',
          value: {
            get({ data }: EditorResult<Data>) {
              return !data.hideAdd;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              data.hideAdd = !val;
            }
          }
        },
        // {
        //   title: '可删除',
        //   type: 'switch',
        //   description: '开启后，可以点击删除按钮删除卡片',
        //   value: {
        //     get({ data }: EditorResult<Data>) {
        //       return !!data.closable;
        //     },
        //     set({ data }: EditorResult<Data>, val: boolean) {
        //       data.closable = val;
        //       data.tabList = data.tabList.map((tab) => {
        //         tab.closable = val;
        //         return tab;
        //       });
        //     }
        //   }
        // },
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
          title: '事件',
          items: [
            {
              title: '卡片新增',
              type: '_Event',
              description: '新增卡片时触发【卡片新增】输出项事件',
              options() {
                return {
                  outputId: OutputIds.AddTab
                };
              }
            },
            {
              title: '卡片删除',
              type: '_Event',
              description: '删除卡片时触发【卡片删除】输出项事件',
              options() {
                return {
                  outputId: OutputIds.RemoveTab
                };
              }
            },
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
        title: '卡片头',
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
        title: '卡片',
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
          title: '卡片文本',
          target: ({ id }: EditorResult<Data>) =>
            `.ant-tabs .ant-tabs-nav-wrap .ant-tabs-tab-active${getFilterSelector(
              id
            )} div.ant-tabs-tab-btn span`
        })
      },
      {
        catelog: '激活',
        ...createStyleForActive({
          title: '卡片',
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
