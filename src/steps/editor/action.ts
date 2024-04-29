import { Data, Btn } from '../constants';
const createBtnValue = (field: string) => {
  return {
    set({ data }: EditorResult<Data>, value: string) {
      if (!value) return;
      data.toolbar[field] = value;
    },
    get({ data }: EditorResult<Data>) {
      return data.toolbar[field];
    }
  }
}
export default {
  '[data-item-type="stepActions"]': {
    title: '操作项',
    items({ focusArea }: EditorResult<Data>, cate1) {
      if (!focusArea) return
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
    "@dblclick": {
      type: 'text',
      value: createBtnValue(`primaryBtnText`)
    },
    items: [
      {
        title: '文案',
        type: 'Text',
        options: {
          locale: true
        },
        value: createBtnValue(`primaryBtnText`)
      },
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
    "@dblclick": {
      type: 'text',
      value: createBtnValue(`secondBtnText`)
    },
    items: [
      {
        title: '文案',
        type: 'Text',
        options: {
          locale: true
        },
        value: createBtnValue('secondBtnText')
      }
    ]
  },
  '[data-item-type="submit"]': {
    title: '提交按钮',
    "@dblclick": {
      type: 'text',
      value: createBtnValue(`submitText`)
    },
    items: [
      {
        title: '文案',
        type: 'Text',
        options: {
          locale: true
        },
        value: createBtnValue(`submitText`)

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
};

const getExtraBtn = (data, focusArea) => {
  return data.toolbar.extraBtns[focusArea.index]
}

const updateExtraBtn = (data, focusArea, val) => {
  const btn = getExtraBtn(data, focusArea)
  data.toolbar.extraBtns[focusArea.index] = { ...btn, ...val }
}