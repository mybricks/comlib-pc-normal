import visibleOpt from '../../components/editorRender/visibleOpt';
import { Data } from '../constants';
import { getButton } from '../utils';
const createBtnValue = (buttonType: string) => {
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
    items({ data, output, focusArea }: EditorResult<Data>, cate1) {
      if (!focusArea) return;
      cate1.title = '操作栏';
      cate1.items = [
        {
          title: '按钮组',
          description: '选中拖拽各项左侧手柄，可改变按钮的相对位置',
          type: 'array',
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
  '[data-item-type^=custom]': {
    title: '自定义操作',
    '@dblclick': {
      type: 'text',
      value: {
        set({ data, output, focusArea }: EditorResult<Data>, value: string) {
          const id = focusArea.dataset['itemType'];
          const btn = data.toolbar.btns.find(
            (item) => item.value === id.substring('custom-'.length)
          );
          if (!value || !btn) return;
          output.get(btn.value).setTitle(value);
          btn.label = value;
        },
        get({ data, focusArea }: EditorResult<Data>) {
          const id = focusArea.dataset['itemType'];
          const btn = data.toolbar.btns.find(
            (item) => item.value === id.substring('custom-'.length)
          );
          return btn?.label;
        }
      }
    },
    //  ({ data, output, focusArea }: EditorResult<Data>, cate1, cate2, cate3) => {
    //   if (!focusArea) return;
    //   console.log('focusArea', focusArea);
    //   const id = focusArea.dataset['itemType'];
    //   const btn = data.toolbar.btns.find((item) => item.value === id.substring('custom-'.length));
    //   console.log('btn', btn);

    //   if (!btn) return;

    //   cate1.items = [
    //     {
    //       type: 'text',
    //       value: {
    //         set({ data }: EditorResult<Data>, value: string) {
    //           if (!value || !btn) return;
    //           btn.label = value;
    //         },
    //         get({ data }: EditorResult<Data>) {
    //           return btn?.label;
    //         }
    //       }
    //     }
    //   ];
    // }
    items: ({ data, output, focusArea }: EditorResult<Data>, cate1, cate2, cate3) => {
      if (!focusArea) return;
      const id = focusArea.dataset['itemType'];
      const btn = data.toolbar.btns.find((item) => item.value === id.substring('custom-'.length));

      if (!btn) return;

      cate1.items = [
        {
          title: '文案',
          type: 'Text',
          options: {
            locale: true
          },
          value: {
            set({ data, output }: EditorResult<Data>, value: string) {
              if (!value || !btn) return;
              output.get(btn.value).setTitle(value);
              btn.label = value;
            },
            get({ data }: EditorResult<Data>) {
              return btn?.label;
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
                  outputId: btn.value
                };
              }
            }
          ]
        },
        {
          title: '删除',
          type: 'Button',
          value: {
            set({ data, output, focusArea }: EditorResult<Data>) {
              const index = data.toolbar.btns.findIndex((item) => item.value === btn.value);
              output.remove(btn.value);
              data.toolbar.btns.splice(index, 1);
            }
          }
        }
      ];
    }
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
