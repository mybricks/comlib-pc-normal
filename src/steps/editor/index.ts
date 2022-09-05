import { uuid } from '../../utils';
import { Data } from '../constants';
import StepEditor from './step'
import ActionEditor from './action'

const DefaultSchema = {
  type: 'follow'
};

export default {
  ':root': [
    {
      title: '描述',
      type: 'Select',
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.toolbar.showDesc;
        },
        set({ data }: EditorResult<Data>, value: number) {
          data.toolbar.showDesc = value;
        }
      }
    },
    {
      title: '类型',
      type: 'Select',
      options: [
        { label: '默认', value: 'default' },
        { label: '导航类型', value: 'navigation' }
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.toolbar.type;
        },
        set({ data }: EditorResult<Data>, value: 'default' | 'navigation') {
          data.toolbar.type = value;
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
          return data.toolbar.size;
        },
        set({ data }: EditorResult<Data>, value: 'default' | 'small') {
          data.toolbar.size = value;
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
          return data.direction || 'horizontal';
        },
        set({ data }: EditorResult<Data>, value: 'horizontal' | 'vertical') {
          data.direction = value;
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
      title: '按钮组',
      type: 'Switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return typeof data.toolbar.showActions === 'undefined' || data.toolbar.showActions;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.toolbar.showActions = value;
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
      title: '添加步骤',
      type: 'Button',
      value: {
        set({ data, slots, output }: EditorResult<Data>) {
          const id = uuid();
          slots.add({
            id,
            title: `内容区【${data.stepAry.length+1}】`,
            type: 'scope',
            // inputs: [
            //     {
            //         id: id+uuid(),
            //         title: "进入",
            //         schema: DefaultSchema
            //     }
            // ]
          });
          slots.get(id).inputs.add(id+uuid(), '进入', { type: 'follow' });
          output.add(id, `提交_${id}`, DefaultSchema);
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
    },
    {
      title: '事件',
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
  ],
  ...StepEditor,
  ...ActionEditor
};
