import { uuid } from '../../utils';
import { Data, Btn } from '../constants';
import StepEditor from './step';
import ActionEditor from './action';
import { addSlot, addEventIO, setDynamicStepsIO } from './util';
import visibleOpt from '../../components/editorRender/visibleOpt';
import css from '../index.less';

const DefaultSchema = {
  type: 'any'
};

export default {
  '@init': ({ style }) => {
    style.height = 'auto';
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':slot': {},
  ':root': {
    style: [
      {
        items: [
          {
            title: '标题',
            catelog: '默认',
            options: [{ type: 'font', config: { disableTextAlign: true } }],
            target:
              '.ant-steps-item-process>.ant-steps-item-container>.ant-steps-item-content>.ant-steps-item-title'
          },
          {
            title: '子标题',
            catelog: '默认',
            options: [{ type: 'font', config: { disableTextAlign: true } }, 'border'],
            target:
              '.ant-steps-item-process>.ant-steps-item-container>.ant-steps-item-content>.ant-steps-item-description'
          },
          {
            title: '步骤图标',
            catelog: '默认',
            options: [{ type: 'background', config: { disableBackgroundImage: true } }, 'border'],
            target: '.ant-steps-item-process>.ant-steps-item-container>.ant-steps-item-icon'
          },
          {
            title: '子步骤',
            catelog: '默认',
            options: [{ type: 'size', config: { disableWidth: true } }],
            ifVisible({ data }: EditorResult<Data>) {
              return data.steps.direction === 'vertical';
            },
            target: '.ant-steps-item'
          },
          {
            title: '内容',
            catelog: '默认',
            options: ['overflow'],
            target: `.${css.stepsContent}`
          },
          {
            catelog: '完成态',
            title: '步骤连线（水平）',
            ifVisible({ data }: EditorResult<Data>) {
              return data.steps.direction === 'horizontal';
            },
            options: [{ type: 'background', config: { disableBackgroundImage: true } }],
            target: '.ant-steps-item-finish .ant-steps-item-title:after'
          },
          {
            catelog: '完成态',
            title: '步骤连线（竖直）',
            ifVisible({ data }: EditorResult<Data>) {
              return data.steps.direction === 'vertical';
            },
            options: [{ type: 'background', config: { disableBackgroundImage: true } }],
            target: '.ant-steps-item-finish .ant-steps-item-tail:after'
          },
          {
            title: '标题',
            catelog: '完成态',
            options: [{ type: 'font', config: { disableTextAlign: true } }],
            target:
              '.ant-steps-item-finish>.ant-steps-item-container>.ant-steps-item-content>.ant-steps-item-title'
          },
          {
            title: '子标题',
            catelog: '完成态',
            options: [{ type: 'font', config: { disableTextAlign: true } }],
            target:
              '.ant-steps-item-finish>.ant-steps-item-container>.ant-steps-item-content>.ant-steps-item-description'
          },
          {
            title: '步骤图标',
            catelog: '完成态',
            options: [{ type: 'background', config: { disableBackgroundImage: true } }, 'border'],
            target: '.ant-steps-item-finish .ant-steps-item-icon'
          },
          {
            title: '对勾',
            catelog: '完成态',
            options: [{ type: 'font', config: { disableTextAlign: true } }],
            target: '.ant-steps-item-finish .ant-steps-item-icon>.ant-steps-icon'
          },
          {
            title: '步骤连线（水平）',
            catelog: '禁用态',
            ifVisible({ data }: EditorResult<Data>) {
              return data.steps.direction === 'horizontal';
            },
            options: [{ type: 'background', config: { disableBackgroundImage: true } }],
            target: '.ant-steps-item-title:after'
          },
          {
            title: '步骤连线（竖直）',
            catelog: '禁用态',
            ifVisible({ data }: EditorResult<Data>) {
              return data.steps.direction === 'vertical';
            },
            options: [{ type: 'background', config: { disableBackgroundImage: true } }],
            target: '.ant-steps-item-tail:after'
          },
          {
            title: '标题',
            catelog: '禁用态',
            options: [{ type: 'font', config: { disableTextAlign: true } }],
            target:
              '.ant-steps-item-wait>.ant-steps-item-container>.ant-steps-item-content>.ant-steps-item-title'
          },
          {
            title: '子标题',
            catelog: '禁用态',
            options: [{ type: 'font', config: { disableTextAlign: true } }],
            target:
              '.ant-steps-item-wait>.ant-steps-item-container>.ant-steps-item-content>.ant-steps-item-description'
          },
          {
            title: '步骤图标',
            catelog: '禁用态',
            options: [{ type: 'background', config: { disableBackgroundImage: true } }, 'border'],
            target: ['.ant-steps-item-wait .ant-steps-item-icon']
          },
          {
            title: '数字',
            catelog: '禁用态',
            options: [{ type: 'font', config: { disableTextAlign: true } }],
            target: '.ant-steps-item-wait .ant-steps-item-icon>.ant-steps-icon'
          }
        ]
      }
    ],
    items: ({ data, output }, cate1, cate2) => {
      cate1.title = '常规';
      cate1.items = [
        {
          title: '类型',
          type: 'Select',
          description: '步骤条类型',
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
          description: '步骤条尺寸',
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
          description: '步骤条方向',
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
          title: '标签放置位置',
          type: 'Select',
          description: '标签放置位置，选择水平标签会在数字图标右侧，选择竖直标签会在数字图标下方',
          options: [
            { label: '水平', value: 'horizontal' },
            { label: '竖直', value: 'vertical' }
          ],
          ifVisible({ data }: EditorResult<Data>) {
            return data.steps.type !== 'dotted' && data.steps.direction !== 'vertical';
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.steps.labelPlacement || 'horizontal';
            },
            set({ data }: EditorResult<Data>, value: 'horizontal' | 'vertical') {
              data.steps.labelPlacement = value;
            }
          }
        },
        {
          title: '描述',
          type: 'switch',
          description: '是否展示每个步骤的描述',
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
          description: '点击步骤条切换步骤',
          value: {
            get({ data }: EditorResult<Data>) {
              return !!data.steps.canClick;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              data.steps.canClick = val;
            }
          }
        },
        {
          title: '操作栏',
          type: 'switch',
          description: '是否显示操作栏',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.toolbar.showActions;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              data.toolbar.showActions = val;
            }
          }
        },
        {
          title: '添加步骤',
          type: 'Button',
          description: '点击按钮添加一个步骤，新增【新步骤】插槽和输出项【步骤几下一步】',
          value: {
            set({ data, slots, output, input }: EditorResult<Data>) {
              const id = uuid();
              data.stepAry.push({
                id,
                title: '新步骤',
                description: '新添加的步骤',
                index: data.stepAry.length
              });
              addSlot(slots, id, `步骤${data.stepAry.length}`);
              output.add(id, `步骤${data.stepAry.length}下一步`, DefaultSchema);
              //添加事件i/0
              addEventIO(output, id, `步骤${data.stepAry.length}`);
              //设置跳转title
              input.setTitle('jumpTo', `跳转（0～${data.stepAry.length - 1}）`);
            }
          }
        },
        {
          title: '按钮组',
          description: '选中拖拽各项左侧手柄，可改变按钮的相对位置',
          type: 'array',
          ifVisible({ data }: EditorResult<Data>) {
            return !!data.toolbar.showActions;
          },
          options: {
            deletable: false,
            addable: true,
            editable: false,
            customOptRender: visibleOpt,
            getTitle: (item) => {
              return item?.label;
            },
            onAdd: (id) => {
              output.add(id, `点击自定义操作${data.toolbar.btns.length - 3}`, { type: 'any' });
              return {
                label: `自定义操作${data.toolbar.btns.length - 3}`,
                value: id,
                visible: true
              };
            }
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.toolbar.btns || [];
            },
            set({ data }: EditorResult<Data>, val: any[]) {
              data.toolbar.btns = val;
            }
          }
        }
        // {
        //   title: '按钮组',
        //   type: 'select',
        //   ifVisible({ data }: EditorResult<Data>) {
        //     return !!data.toolbar.showActions;
        //   },
        //   options: {
        //     options: [
        //       {
        //         label: "上一步",
        //         value: "previous"
        //       },
        //       {
        //         label: "下一步",
        //         value: "next"
        //       },
        //       {
        //         label: "提交",
        //         value: "submit"
        //       },
        //     ],
        //     mode: "multiple"
        //   },
        //   value: {
        //     get({ data }: EditorResult<Data>) {
        //       return data.toolbar.btns || [];
        //     },
        //     set({ data }: EditorResult<Data>, val: Array<Btn>) {
        //       data.toolbar.btns = val
        //     }
        //   }
        // },
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
      ];
      cate2.title = '高级';
      cate2.items = [
        {
          title: '隐藏插槽占位',
          type: 'Switch',
          description: '隐藏步骤条的插槽，通常用于动态步骤条的场景',
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
          title: '动态步骤',
          type: 'switch',
          description:
            '开启后，可以通过逻辑连线连接步骤条的输入项【设置步骤】，可以创建【步骤改变】的交互卡片',
          value: {
            get({ data }: EditorResult<Data>) {
              return !!data.dynamicSteps;
            },
            set(props: EditorResult<Data>, val: boolean) {
              const { data } = props;
              data.dynamicSteps = val;
              setDynamicStepsIO(props, val);
              data.hideSlots = val;
              data.toolbar.showActions = !val;
            }
          }
        },
        {
          title: '步骤改变',
          type: '_Event',
          description: '当步骤发生变化时触发',
          ifVisible({ data }: EditorResult<Data>) {
            return !!data.dynamicSteps;
          },
          options: ({ data }) => {
            return {
              outputId: 'onStepChange'
            };
          }
        }
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
      ];
    }
  },
  ...StepEditor,
  ...ActionEditor
};
