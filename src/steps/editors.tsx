import { uuid } from '../utils';

interface stepsList {
  id: string;
  title: string;
  description: string;
  subTitle?: string;
  index: number;
}

interface Toolbar {
  showDesc: number;
  size: string;
  type: string;
  submit: boolean;
  reset: boolean;
  showSecondBtn: boolean;
  actionAlign?: string;
  showActions?: boolean;
  primaryBtnText?: string;
  secondBtnText?: string;
  resetText?: string;
  submitText?: string;
}

interface Data {
  current: number;
  stepAry: stepsList[];
  toolbar: Toolbar;
  fullSubmit: boolean;
  useSubmitBtnLoading: boolean;
  hideSlots?: boolean
}

interface Result {
  data: Data;
  focusArea: any;
  slot: any;
  output: any;
}

const DefaultSchema = {
  type: 'follow'
};

export default {
  // '@outputConnected': ({data, input, output}, from, to) => {
  //   output.get(from.id).setSchema(to.schema)
  // },
  // '@outputDisConnected': ({data, input, output}, from, to) => {
  //   output.get(from.id).setSchema(DefaultSchema)
  // },
  '@init': ({ data, input, output }, from, to) => {
    const { stepAry } = data;
    const { id } = stepAry[0];

    output.add(0, '提交_0', DefaultSchema);
  },
  ':root': [
    {
      title: '描述',
      type: 'Select',
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
      value: {
        get({ data }: Result) {
          return data.toolbar.showDesc;
        },
        set({ data }: Result, value: number) {
          data.toolbar.showDesc = value;
        },
      },
    },
    {
      title: '类型',
      type: 'Select',
      options: [
        { label: '默认', value: 'default' },
        { label: '导航类型', value: 'navigation' },
      ],
      value: {
        get({ data }: Result) {
          return data.toolbar.type;
        },
        set({ data }: Result, value: string) {
          data.toolbar.type = value;
        },
      },
    },
    {
      title: '尺寸',
      type: 'Select',
      options: [
        { label: '默认', value: 'default' },
        { label: '迷你', value: 'small' },
      ],
      value: {
        get({ data }: Result) {
          return data.toolbar.size;
        },
        set({ data }: Result, value: string) {
          data.toolbar.size = value;
        },
      },
    },
    {
      title: '隐藏插槽占位',
      type: 'Switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return !!data.hideSlots
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.hideSlots = value
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
        },
      },
    },
    {
      title: '全量提交',
      type: 'Switch',
      description:
        '当最后一步仍然需要数据记录时打开，会在最后一步数据校验通过后触发全量提交，通常最后一步只用于确认，则不需要开启',
      value: {
        get({ data }: Result) {
          return data.fullSubmit;
        },
        set({ data, output }: Result, value: boolean) {
          data.fullSubmit = value;

          // if (value) {
          //   output.add('fullSubmit', '全量提交', DefaultSchema);
          // } else {
          //   output.remove('fullSubmit');
          // }
        },
      },
    },
    {
      title: '添加步骤',
      type: 'Button',
      value: {
        set({ data, slot, output }: Result) {
          const id = uuid();

          slot.add(id);
          // const key = data.stepAry.length - 1
          output.add(id, `提交_${id}`, DefaultSchema);
          data.stepAry.push({
            id,
            title: '新步骤',
            description: '新添加的步骤',
            index: data.stepAry.length,
          });
          data.stepAry.forEach((item, idx) => {
            output.setTitle(
              item.id,
              idx === data.stepAry.length - 1 ? '提交' : `第${idx + 1}步 -> 下一步`
            );
          });
        },
      },
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
    // {
    //   title: '是否有提交按钮',
    //   type: 'Switch',
    //   value: {
    //     get({data}: Result){
    //       return data.toolbar.submit
    //     },
    //     set ({data}: Result, value: boolean) {
    //       data.toolbar.submit = value
    //     }
    //   }
    // },
    // {
    //   title: '是否有取消按钮',
    //   type: 'Switch',
    //   value: {
    //     get({data}: Result){
    //       return data.toolbar.reset
    //     },
    //     set ({data}: Result, value: boolean) {
    //       data.toolbar.reset = value
    //     }
    //   }
    // },
  ],
  '[data-item-type="step"]': {
    title: '步骤',
    items: [
      function ({ data, focusArea }: Result) {
        data.current = focusArea.index;
      },
      {
        title: '标题',
        type: 'Text',
        value: {
          get({ data, focusArea }: Result) {
            const { index } = focusArea;
            return data.stepAry[index].title;
          },
          set({ data, focusArea }: Result, values: string) {
            const { index } = focusArea;
            data.stepAry[index].title = values;
          },
        },
      },
      {
        title: '子标题',
        type: 'Text',
        value: {
          get({ data, focusArea }: Result) {
            const { index } = focusArea;
            return data.stepAry[index].subTitle;
          },
          set({ data, focusArea }: Result, values: string) {
            const { index } = focusArea;
            data.stepAry[index].subTitle = values;
          },
        },
      },
      {
        title: '描述',
        type: 'Text',
        value: {
          get({ data, focusArea }: Result) {
            const { index } = focusArea;
            return data.stepAry[index].description;
          },
          set({ data, focusArea }: Result, values: string) {
            const { index } = focusArea;
            data.stepAry[index].description = values;
          },
        },
      },
      {
        title: '删除',
        type: 'Button',
        value: {
          set({ data, focusArea, output, slot }: Result) {
            if (data.stepAry.length === 1) return;
            const step = data.stepAry[focusArea.index];
            output.remove(step.id);
            slot.remove(step.id);
            data.stepAry.splice(focusArea.index, 1);
            if (data.stepAry.length > 0) {
              if (focusArea.index == 0) {
                data.current = 0;
              } else {
                data.current = data.current - 1;
              }
            } else {
              data.current = -1;
            }

            data.stepAry.forEach((item, idx) => {
              output.setTitle(
                item.id,
                idx === data.stepAry.length - 1 ? '提交' : `第${idx + 1}步 -> 下一步`
              );
            });
          },
        },
        // value: {
        //   set ({data, focusArea, output, slot}: Result) {
        //     if(data.stepAry.length === 1) return

        //     const step = data.stepAry[focusArea.index]
        //     const brr: any[] = []
        //     let count = 1
        //     let index = 0
        //     data.stepAry.forEach((item, idx) => {
        //       if (item.id === step.id) {
        //         slot.remove(step.id)
        //         output.remove(step.id)
        //       } else {
        //         output.rename(item.id, `第${count++}步 > 下一步`)
        //         brr.push({...item, index: index++})
        //       }
        //     })

        //     if (brr.length > 0) {
        //       if (focusArea.index == 0) {
        //         data.current = 0
        //       } else {
        //         data.current = data.current - 1
        //       }
        //     } else {
        //       data.current = -1
        //     }

        //     data.stepAry = brr
        //   }
        // }
      },
    ],
  },
  '[data-item-type="stepActions"]': {
    title: '操作项',
    items: [
      {
        title: '显示副按钮',
        type: 'Switch',
        value: {
          set({ data, output }: EditorResult<Data>, value: boolean) {
            data.toolbar.showSecondBtn = value;
          },
          get({ data }: EditorResult<Data>) {
            return data.toolbar.showSecondBtn;
          },
        },
      },
      {
        title: '显示重置按钮',
        type: 'Switch',
        value: {
          set({ data, output }: EditorResult<Data>, value: boolean) {
            data.toolbar.reset = value;
          },
          get({ data }: EditorResult<Data>) {
            return data.toolbar.reset;
          },
        },
      },
      {
        title: '按钮组对齐',
        type: 'Select',
        options: [
          { label: '左对齐', value: 'flex-start' },
          { label: '居中', value: 'center' },
          { label: '右对齐', value: 'flex-end' },
        ],
        value: {
          set({ data }: EditorResult<Data>, value: string) {
            data.toolbar.actionAlign = value;
          },
          get({ data }: EditorResult<Data>) {
            return data.toolbar.actionAlign;
          },
        },
      },
    ],
  },
  '[data-item-type="next"]': {
    title: '主按钮',
    items: [
      {
        title: '文案',
        type: 'Text',
        value: {
          set({ data, output }: EditorResult<Data>, value: string) {
            if (!value) return;
            data.toolbar.primaryBtnText = value;
          },
          get({ data }: EditorResult<Data>) {
            return data.toolbar.primaryBtnText;
          },
        },
      },
      {
        title: '是否显示加载',
        type: 'Switch',
        ifVisible({ data }: EditorResult<Data>) {
          return typeof data.toolbar.showActions === undefined || data.toolbar.showActions;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useSubmitBtnLoading;
          },
          set({ data, output }: EditorResult<Data>, value: boolean) {
            data.useSubmitBtnLoading = value;
          },
        },
      },
      {
        title: '事件',
        items: [
          {
            title: '点击',
            type: '_Event',
            options: ({ data }) => {
              const id = data.stepAry[data.current]?.id
              return {
                outputId: `${id}`
              };
            }
          },
        ],
      },
    ],
  },
  '[data-item-type="pre"]': {
    title: '副按钮',
    items: [
      {
        title: '文案',
        type: 'Text',
        value: {
          set({ data, output }: EditorResult<Data>, value: string) {
            if (!value) return;
            data.toolbar.secondBtnText = value;
          },
          get({ data }: EditorResult<Data>) {
            return data.toolbar.secondBtnText;
          },
        },
      },
    ],
  },
  '[data-item-type="resetBtn"]': {
    title: '重置按钮',
    items: [
      {
        title: '文案',
        type: 'Text',
        value: {
          set({ data, output }: EditorResult<Data>, value: string) {
            if (!value) return;
            data.toolbar.resetText = value;
          },
          get({ data }: EditorResult<Data>) {
            return data.toolbar.resetText;
          },
        },
      },
    ],
  },
  '[data-item-type="submit"]': {
    title: '提交按钮',
    items: [
      {
        title: '文案',
        type: 'Text',
        value: {
          set({ data, output }: EditorResult<Data>, value: string) {
            if (!value) return;
            data.toolbar.submitText = value;
          },
          get({ data }: EditorResult<Data>) {
            return data.toolbar.submitText;
          },
        },
      },
      {
        title: '事件',
        items: [
          {
            title: '点击',
            type: '_Event',
            options: () => {
              return {
                outputId: 'submit'
              };
            }
          },
        ],
      },
    ],
  },
};
