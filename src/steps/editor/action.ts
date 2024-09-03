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
          description: '按钮组的对齐方式',
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
          description: '操作栏是否置底，置底后，底部距离相对页面而不是步骤条组件',
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
          description: '操作栏置底后距离底部的距离',
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
        title: '操作栏',
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
          description: '自定义操作按钮文案',
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
              description:
                '开启后可以配置当前自定义按钮的点击事件逻辑，如在第一步的下一步按钮的点击事件中可以连线到输入项【下一步】跳转到下一步，同样在第二步的上一步按钮的点击事件中可以连线到输入项【上一步】跳转到上一步，或者使用【跳转】输入项跳转到任意步',
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
          description: '点击删除当前按钮，并移除对应输入输出项',
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
        description: '下一步按钮文案',
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
            description:
              '这一步骤的下一步按钮的点击事件，点击事件中可以连线到输入项【下一步】跳转到下一步，或者使用【跳转】输入项跳转到任意步',
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
        description: '上一步按钮文案',
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
            description: '这一步的提交按钮的点击事件',
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
