import { Data, DefaultStyle } from '../constants';
import IndexEditor from './indexEditor';

const getTitleItem = ({ data, focusArea }: { data: Data; focusArea: any }) => {
  const dataset = 'menuTitleItem';
  const key = focusArea.dataset[dataset];
  const slotItem = data.slotList.find((slot) => slot.key === key);
  return slotItem;
};
export default [
  {
    title: '名称',
    type: 'Text',
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        const item = getTitleItem({ data, focusArea });
        return item?.title;
      },
      set({ data, focusArea, slot }: EditorResult<Data>, value: string) {
        const item = getTitleItem({ data, focusArea });
        if (item) {
          item.title = value;
          slot.setTitle(item.slotId, `${value}内容`);
        }
      }
    }
  },
  {
    title: '应用全部',
    type: 'Button',
    value: {
      set({ data, focusArea }: EditorResult<Data>) {
        const item = getTitleItem({ data, focusArea });
        data.slotList.forEach((temp) => {
          temp.activeStyle = {
            ...item?.activeStyle
          };
          temp.style = {
            ...item?.style
          };
        });
      }
    }
  },
  {
    title: '样式',
    catelogChange: {
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          const item = getTitleItem({ data, focusArea });
          return item?.styleCatelog;
        },
        set({ data, focusArea, catelog }: EditorResult<Data>) {
          const item = getTitleItem({ data, focusArea });
          if (item) {
            item.styleCatelog = catelog;
          }
        }
      }
    },
    items: [
      {
        type: 'Style',
        catelog: '默认样式',
        options: {
          plugins: ['Font', 'Padding', 'BgColor', 'BgImage', 'Border'],
          fontProps: {
            fontFamily: false
          }
        },
        value: {
          get: ({ data, focusArea }: EditorResult<Data>) => {
            const item = getTitleItem({ data, focusArea });
            return item?.style || { ...DefaultStyle };
          },
          set: ({ data, focusArea }: EditorResult<Data>, value) => {
            const item = getTitleItem({ data, focusArea });
            if (item) {
              item.style = value;
            }
          }
        }
      },
      {
        type: 'style',
        catelog: '激活样式',
        options: {
          plugins: ['Font', 'Padding', 'BgColor', 'BgImage', 'Border'],
          fontProps: {
            fontFamily: false
          }
        },
        value: {
          get: ({ data, focusArea }: EditorResult<Data>) => {
            const item = getTitleItem({ data, focusArea });
            return item?.activeStyle || { ...DefaultStyle };
          },
          set: ({ data, focusArea }: EditorResult<Data>, value) => {
            const item = getTitleItem({ data, focusArea });
            if (item) {
              item.activeStyle = value;
            }
          }
        }
      }
    ]
  },
  ...IndexEditor
];
