import { uuid } from '../../utils';
import { Data, ToolbarType } from '../constants';
import StepEditor from './step';
import ActionEditor from './action';

const DefaultSchema = {
  type: 'any'
};

export default {
  ':root': ({ }, cate1, cate2, cate3) => {
    cate1.title = "常规"
    cate1.items = [
      {
        title: '类型',
        type: 'Select',
        options: [
          { label: '默认', value: 'default' },
          { label: '导航类型', value: 'navigation' }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.steps.type;
          },
          set({ data }: EditorResult<Data>, value: 'default' | 'navigation') {
            data.steps.type = value;
          }
        }
      },
      {
        title: '尺寸',
        type: 'Select',
        options: [
          { label: '默认', value: 'default' },
          { label: '迷你', value: 'small' }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.steps.size;
          },
          set({ data }: EditorResult<Data>, value: 'default' | 'small') {
            data.steps.size = value;
          }
        }
      },
      {
        title: '方向',
        type: 'Select',
        options: [
          { label: '水平', value: 'horizontal' },
          { label: '竖直', value: 'vertical' }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.steps.direction;
          },
          set({ data }: EditorResult<Data>, value: 'horizontal' | 'vertical') {
            data.steps.direction = value;
          }
        }
      },
      {
        title: '描述',
        type: 'switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.steps.showDesc;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.steps.showDesc = value;
          }
        }
      },
      {
        title: '添加步骤',
        type: 'Button',
        value: {
          set({ data, slots, output, input }: EditorResult<Data>) {
            const id = uuid();
            slots.add({
              id,
              title: `内容区【${data.stepAry.length + 1}】`,
              type: 'scope',
              inputs: [
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
            output.add(id, `提交_${id}`, DefaultSchema);
            //设置跳转title
            input.setTitle('jumpTo', `跳转（0～${data.stepAry.length}）`)
            data.stepAry.push({
              id,
              title: '新步骤',
              description: '新添加的步骤',
              index: data.stepAry.length
            });
            data.stepAry.forEach((item, idx) => {
              output.setTitle(
                item.id,
                idx === data.stepAry.length - 1 ? '提交' : `第${idx + 1}步 -> 下一步`
              );
            });
          }
        }
      }
    ]
    cate2.title = "高级"
    cate2.items = [
      {
        title: '操作栏',
        type: 'select',
        options: {
          options: [
            {
              label: "默认",
              value: "default"
            },
            {
              label: "自定义",
              value: "custom"
            },
            {
              label: "无操作",
              value: "never"
            }
          ]
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.toolbar.type;
          },
          set({ data, slots }: EditorResult<Data>, val: ToolbarType) {
            data.toolbar.type = val
            if (val === "custom") {
              slots.add({
                id: "customToolbar",
                title: "自定义操作栏",
                type: "scope"
              })
            } else {
              const customToolbarSlot = slots.get('customToolbar')
              if (customToolbarSlot) {
                slots.remove("customToolbar")
              }
            }
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
        title: '全量提交',
        type: 'Switch',
        description:
          '当最后一步仍然需要数据记录时打开，会在最后一步数据校验通过后触发全量提交，通常最后一步只用于确认，则不需要开启',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.fullSubmit;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.fullSubmit = value;
          }
        }
      },
      {
        title: '事件',
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.fullSubmit;
        },
        items: [
          {
            title: '数据提交',
            type: '_Event',
            options: () => {
              return {
                outputId: 'submit'
              };
            }
          }
        ]
      }
    ]
  },
  ...StepEditor,
  ...ActionEditor
};
