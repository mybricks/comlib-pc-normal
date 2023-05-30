import { Data, WidthUnitEnum } from '../../constants';
import { getRowItem } from '../utils';

const StyleEditor = [
  {
    title: '自动换行',
    type: 'Switch',
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getRowItem(data, focusArea);
        return item?.wrap;
      },
      set({ data, focusArea }: EditorResult<Data>, value: boolean) {
        if (!focusArea) return;
        const item = getRowItem(data, focusArea);
        item.wrap = value;
      }
    }
  },
  {
    title: '间隔配置',
    items: [
      {
        title: '开启',
        type: 'Switch',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const item = getRowItem(data, focusArea);
            return item?.useGutter;
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            if (!focusArea) return;
            const item = getRowItem(data, focusArea);
            item.useGutter = value;
          }
        }
      },
      {
        title: '水平间隔',
        type: 'Slider',
        options: [
          {
            max: 1000,
            min: 0,
            step: 1,
            formatter: WidthUnitEnum.Px
          }
        ],
        ifVisible({ focusArea, data }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getRowItem(data, focusArea);
          return !!item?.useGutter;
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const item = getRowItem(data, focusArea);
            return item?.gutter[0];
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const item = getRowItem(data, focusArea);
            item.gutter[0] = value;
          }
        }
      }
    ]
  }
];
export default StyleEditor;
