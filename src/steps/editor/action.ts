import visibleOpt from '../../components/editorRender/visibleOpt';
import { Data, BtnType } from '../constants';
import { getButton } from '../utils';
const createBtnValue = (buttonType: BtnType) => {
  return {
    set({ data }: EditorResult<Data>, value: string) {
      const btn = getButton(data.toolbar.btns, buttonType);
      if (!value || !btn) return;
      btn.label = value;
    },
    get({ data }: EditorResult<Data>) {
      const btn = getButton(data.toolbar.btns, buttonType);
      return btn?.label;
    }
  };
};
export default {
  '[data-item-type="stepActions"]': {
    title: '操作项',
    items({ focusArea }: EditorResult<Data>, cate1) {
      if (!focusArea) return;
      cate1.title = '操作栏';
      cate1.items = [
        {
          title: '按钮组',
          description: '选中拖拽各项左侧手柄，可改变按钮的相对位置',
          type: 'array',
          options: {
            deletable: false,
            addable: false,
            editable: false,
            customOptRender: visibleOpt,
            getTitle: (item) => {
              return item?.label;
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
        },
        // {
        //   title: '按钮组',
        //   type: 'select',
        //   options: {
        //     options: [
        //       {
        //         label: '上一步',
        //         value: 'previous'
        //       },
        //       {
        //         label: '下一步',
        //         value: 'next'
        //       },
        //       {
        //         label: '提交',
        //         value: 'submit'
        //       }
        //     ],
        //     mode: 'multiple'
        //   },
        //   value: {
        //     get({ data }: EditorResult<Data>) {
        //       return data.toolbar.btns || [];
        //     },
        //     set({ data }: EditorResult<Data>, val: Array<Btn>) {
        //       data.toolbar.btns = val;
        //     }
        //   }
        // },
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
              data.toolbar.fixed = val;
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
              data.toolbar.bottom = val[0];
            }
          }
        }
      ];
    },
    style: [
      {
        title: '样式',
        options: [
          'padding',
          { type: 'background', config: { disableBackgroundImage: true } },
          'boxshadow'
        ],
        target: () => '.step-toolbar'
      }
    ]
  },
  '[data-item-type="cancel"]': {
    title: '取消',
    '@dblclick': {
      type: 'text',
      value: createBtnValue('cancel')
    },
    items: [
      {
        title: '文案',
        type: 'Text',
        options: {
          locale: true
        },
        value: createBtnValue('cancel')
      },
      {
        title: '事件',
        items: [
          {
            title: '点击',
            type: '_Event',
            options: ({ data }) => {
              return {
                outputId: 'cancel'
              };
            }
          }
        ]
      }
    ]
  },
  '[data-item-type="next"]': {
    title: '下一步',
    '@dblclick': {
      type: 'text',
      value: createBtnValue('next')
    },
    items: [
      {
        title: '文案',
        type: 'Text',
        options: {
          locale: true
        },
        value: createBtnValue('next')
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
    '@dblclick': {
      type: 'text',
      value: createBtnValue('previous')
    },
    items: [
      {
        title: '文案',
        type: 'Text',
        options: {
          locale: true
        },
        value: createBtnValue('previous')
      }
    ]
  },
  '[data-item-type="submit"]': {
    title: '提交',
    '@dblclick': {
      type: 'text',
      value: createBtnValue('submit')
    },
    items: [
      {
        title: '文案',
        type: 'Text',
        options: {
          locale: true
        },
        value: createBtnValue('submit')
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
              };
            }
          }
        ]
      }
    ]
  }
};

// const getExtraBtn = (data, focusArea) => {
//   return data.toolbar.extraBtns[focusArea.index];
// };

// const updateExtraBtn = (data, focusArea, val) => {
//   const btn = getExtraBtn(data, focusArea);
//   data.toolbar.extraBtns[focusArea.index] = { ...btn, ...val };
// };
