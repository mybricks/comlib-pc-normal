import { Data, Btn } from '../constants';
export default {
  '[data-item-type="stepActions"]': {
    title: '操作项',
    items({ focusArea }: EditorResult<Data>, cate1) {
      if(!focusArea) return
      cate1.title = "操作栏"
      cate1.items = [
        {
          title: '按钮组',
          type: 'select',
          options: {
            options: [
              {
                label: "上一步",
                value: "previous"
              },
              {
                label: "下一步",
                value: "next"
              },
              {
                label: "提交",
                value: "submit"
              },
            ],
            mode: "multiple"
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.toolbar.btns || [];
            },
            set({ data }: EditorResult<Data>, val: Array<Btn>) {
              data.toolbar.btns = val
            }
          }
        },
        {
          title: '对齐方式',
          type: 'Select',
          options: [
            { label: '左对齐', value: 'flex-start' },
            { label: '居中', value: 'center' },
            { label: '右对齐', value: 'flex-end' }
          ],
          value: {
            set({ data }: EditorResult<Data>, value: string) {
              data.toolbar.actionAlign = value;
            },
            get({ data }: EditorResult<Data>) {
              return data.toolbar.actionAlign;
            }
          }
        },
        {
          title: '置底',
          type: 'switch',
          ifVisible({ data }: EditorResult<Data>) {
            return !!data.toolbar.showActions;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return !!data.toolbar.fixed;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              data.toolbar.fixed = val
            }
          }
        },
        {
          title: '底部距离',
          type: 'inputNumber',
          options: [{ min: 0, max: 100, width: 120 }],
          ifVisible({ data }: EditorResult<Data>) {
            return !!data.toolbar.fixed;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return [data.toolbar.bottom];
            },
            set({ data }: EditorResult<Data>, val: number[]) {
              data.toolbar.bottom = val[0]
            }
          }
        }
      ]
    },
    style: [
      {
        title: '样式',
        options: ['padding', { type: 'background', config: { disableBackgroundImage: true } }, 'boxshadow'],
        target: () => '.step-toolbar'
      }
    ]
  },
  '[data-item-type="next"]': {
    title: '主按钮',
    items: [
      {
        title: '文案',
        type: 'Text',
        options: {
          locale: true
        },
        value: {
          set({ data }: EditorResult<Data>, value: string) {
            if (!value) return;
            data.toolbar.primaryBtnText = value;
          },
          get({ data }: EditorResult<Data>) {
            return data.toolbar.primaryBtnText;
          }
        }
      },
      // {
      //   title: '是否显示加载',
      //   type: 'Switch',
      //   ifVisible({ data }: EditorResult<Data>) {
      //     return (
      //       typeof data.toolbar.showActions === undefined ||
      //       data.toolbar.showActions
      //     );
      //   },
      //   value: {
      //     get({ data }: EditorResult<Data>) {
      //       return data.useSubmitBtnLoading;
      //     },
      //     set({ data }: EditorResult<Data>, value: boolean) {
      //       data.useSubmitBtnLoading = value;
      //     }
      //   }
      // },
      {
        title: '事件',
        items: [
          {
            title: '点击',
            type: '_Event',
            options: ({ data }) => {
              const id = data.stepAry[data.current]?.id;
              return {
                outputId: id
              };
            }
          }
        ]
      }
    ]
  },
  '[data-item-type="pre"]': {
    title: '上一步',
    items: [
      {
        title: '文案',
        type: 'Text',
        options: {
          locale: true
        },
        value: {
          set({ data }: EditorResult<Data>, value: string) {
            if (!value) return;
            data.toolbar.secondBtnText = value;
          },
          get({ data }: EditorResult<Data>) {
            return data.toolbar.secondBtnText;
          }
        }
      }
    ]
  },
  '[data-item-type="submit"]': {
    title: '提交按钮',
    items: [
      {
        title: '文案',
        type: 'Text',
        options: {
          locale: true
        },
        value: {
          set({ data }: EditorResult<Data>, value: string) {
            if (!value) return;
            data.toolbar.submitText = value;
          },
          get({ data }: EditorResult<Data>) {
            return data.toolbar.submitText;
          }
        }
      },
      {
        title: '事件',
        items: [
          {
            title: '点击',
            type: '_Event',
            options: ({ data }) => {
              return {
                outputId: 'submit'
              }
            }
          }
        ]
      }
    ]
  },
  // '[data-item-type="extraBtn"]': ({ data, slots, output, input, focusArea }, cate1, cate2) => {
  //   cate1.title = "常规"
  //   cate1.items = [
  //     {
  //       title: '名称',
  //       type: 'text',
  //       value: {
  //         get({ data, focusArea }: EditorResult<Data>) {
  //           const btn = getExtraBtn(data, focusArea)
  //           return btn.text;
  //         },
  //         set({ data, focusArea }: EditorResult<Data>, val: string) {
  //           updateExtraBtn(data, focusArea, { text: val })
  //         }
  //       }
  //     },
  //     {
  //       title: '类型',
  //       type: 'select',
  //       options: {
  //         options: [
  //           { value: 'default', label: '默认' },
  //           { value: 'primary', label: '主按钮' },
  //           { value: 'dashed', label: '虚线按钮' },
  //           { value: 'danger', label: '危险按钮' },
  //           { value: 'link', label: '链接按钮' },
  //           { value: 'text', label: '文字按钮' }
  //         ]
  //       },
  //       value: {
  //         get({ data, focusArea }: EditorResult<Data>) {
  //           const btn = getExtraBtn(data, focusArea)
  //           return btn.type;
  //         },
  //         set({ data, focusArea }: EditorResult<Data>, val: string) {
  //           updateExtraBtn(data, focusArea, { type: val })
  //         }
  //       }
  //     }
  //   ]
  //   cate2.title = "事件"
  //   cate2.items = [
  //     {
  //       title: '事件',
  //       items: [
  //         {
  //           title: '点击',
  //           type: '_Event',
  //           options: ({ data, focusArea }: EditorResult<Data>) => {
  //             const outputId = data.toolbar.extraBtns[focusArea.index].id
  //             const slotId = data.stepAry[data.current].id
  //             return {
  //               outputId,
  //               slotId
  //             };
  //           }
  //         }
  //       ]
  //     }
  //   ]
  // }
};

const getExtraBtn = (data, focusArea) => {
  return data.toolbar.extraBtns[focusArea.index]
}

const updateExtraBtn = (data, focusArea, val) => {
  const btn = getExtraBtn(data, focusArea)
  data.toolbar.extraBtns[focusArea.index] = { ...btn, ...val }
}