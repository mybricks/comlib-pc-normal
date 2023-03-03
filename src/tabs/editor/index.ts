import { uuid } from '../../utils';
import { Data, InputIds, OutputIds, SlotIds } from '../constants';
import TabEditor from './tab'

const DefaultSchema = {
  type: 'any'
};

const getId = (data) => {
  const last = data.tabList.slice().pop();
  const index = parseInt(last.id.substring(3)) + 1;
  return `tab${index}`;
};

const addEventIO = (output, id) => {
    output.add(`${id}_into`, `${id}显示`, {type: 'any'})
    output.add(`${id}_leave`, `${id}隐藏`, {type: 'any'})
}

export default {
  ':root': ({}: EditorResult<Data>, cate1, cate2, cate3) => {
    cate1.title = '常规';
    cate1.items = [
      {
        title: '添加标签页',
        type: 'Button',
        value: {
          set({ data, slots, output }: EditorResult<Data>) {
            const key = uuid();
            const id = getId(data);
            slots.add({
              id,
              title: `标签页${data.tabList.length + 1}`
            })
            addEventIO(output, id)
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
            data.tabList.push({
              id,
              key,
              name: '新标签页'
            });
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
  },
  ...TabEditor
};
