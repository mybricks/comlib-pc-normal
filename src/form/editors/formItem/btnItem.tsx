import { Data } from '../../runtime';

const findTailBtnById = ({
  data,
  focusArea
}: {
  data: Data;
  focusArea: any;
}) => {
  const id = focusArea?.dataset?.btnId;
  let tailBtn;
  data.formItems.forEach((item) => {
    if (id && !tailBtn && item.tailBtns) {
      tailBtn = item.tailBtns.find((btn) => btn.id === id);
    }
  });
  return tailBtn;
};

export default {
  '[data-btn-id]': {
    title: '按钮',
    items: [
      {
        title: '名称',
        type: 'Text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            return findTailBtnById({ data, focusArea }).title;
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const btnItem = findTailBtnById({ data, focusArea });
            btnItem.title = value;
          }
        }
      },
      {
        title: '基础样式',
        items: [
          {
            title: '风格',
            type: 'Select',
            options: [
              { label: '默认', value: 'default' },
              { label: '主按钮', value: 'primary' },
              { label: '虚线按钮', value: 'dashed' },
              { label: '危险按钮', value: 'danger' },
              { label: '链接按钮', value: 'link' },
              { label: '文字按钮', value: 'text' }
            ],
            value: {
              get({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                return findTailBtnById({ data, focusArea }).btnType;
              },
              set({ data, focusArea }: EditorResult<Data>, value) {
                if (!focusArea) return;
                const btnItem = findTailBtnById({ data, focusArea });
                btnItem.btnType = value;
              }
            }
          }
        ]
      },
      {
        title: '事件',
        items: [
          {
            title: '单击',
            type: '_Event',
            options: ({ data, focusArea }: EditorResult<Data>) => {
              if (!focusArea) return;
              const btnItem = findTailBtnById({ data, focusArea });
              return {
                outputId: btnItem.id
              };
            }
          }
        ]
      }
    ]
  }
};
