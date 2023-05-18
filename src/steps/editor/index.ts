import { uuid } from '../../utils';
import { Data } from '../constants';
import StepEditor from './step';
import ActionEditor from './action';
import { addSlot, addEventIO } from './util'

const DefaultSchema = {
  type: 'any'
};

export default {
  ':root': ({ }, cate1, cate2) => {
    cate1.title = "常规"
    cate1.items = [
      {
        title: '类型',
        type: 'Select',
        options: [
          { label: '默认', value: 'default' },
          { label: '导航类型', value: 'navigation' },
          { label: '点状类型', value: 'dotted' }
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
        title: '点击切换',
        type: 'switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return !!data.steps.canClick;
          },
          set({ data }: EditorResult<Data>, val: boolean) {
            data.steps.canClick = val
          }
        }
      },
      {
        title: '操作栏',
        type: 'switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.toolbar.showActions;
          },
          set({ data }: EditorResult<Data>, val: boolean) {
            data.toolbar.showActions = val
          }
        }
      },
      // {
      //   title: '添加操作',
      //   type: 'button',
      //   ifVisible({ data }: EditorResult<Data>) {
      //     return !!data.toolbar.showActions;
      //   },
      //   value: {
      //     set({ data, output }: EditorResult<Data>, val: string) {
      //       const id = uuid()
      //       if (!data.toolbar.extraBtns) {
      //         data.toolbar.extraBtns = []
      //       }
      //       data.toolbar.extraBtns?.push({
      //         id,
      //         type: 'default',
      //         text: `按钮${data.toolbar.extraBtns.length + 1}`
      //       })
      //       output.add(id, '点击', { type: "any" })
      //     }
      //   }
      // },
      {
        title: '添加步骤',
        type: 'Button',
        value: {
          set({ data, slots, output, input }: EditorResult<Data>) {
            const id = uuid();
            data.stepAry.push({
              id,
              title: '新步骤',
              description: '新添加的步骤',
              index: data.stepAry.length
            });
            addSlot(slots, id, `步骤${data.stepAry.length}`)
            output.add(id, `步骤${data.stepAry.length}下一步`, DefaultSchema);
            //添加事件i/0
            addEventIO(output, id, `步骤${data.stepAry.length}`)
            //设置跳转title
            input.setTitle('jumpTo', `跳转（0～${data.stepAry.length - 1}）`)
          }
        }
      }
    ]
    cate2.title = "高级"
    cate2.items = [
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
      // {
      //   title: '全量提交',
      //   type: 'Switch',
      //   description:
      //     '当最后一步仍然需要数据记录时打开，会在最后一步数据校验通过后触发全量提交，通常最后一步只用于确认，则不需要开启',
      //   value: {
      //     get({ data }: EditorResult<Data>) {
      //       return !!data.fullSubmit;
      //     },
      //     set({ data }: EditorResult<Data>, value: boolean) {
      //       data.fullSubmit = value;
      //     }
      //   }
      // }
    ]
  },
  ...StepEditor,
  ...ActionEditor
};