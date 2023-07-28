import { unitConversion } from '../../../utils';
import { Data, OverflowEnum, WidthUnitEnum } from '../../constants';
import { getColItem, updateColStyle } from '../utils';

const StyleEditor = (item) => [
  {
    title: '最小/最大宽度',
    items: [
      {
        title: '单位',
        type: 'Select',
        options: [
          { value: WidthUnitEnum.Percent, label: '百分比' },
          { value: WidthUnitEnum.Px, label: '像素' },
          { value: WidthUnitEnum.Auto, label: '无' }
        ],
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            return item.minMaxWidthOption || WidthUnitEnum.Auto;
          },
          set({ data, focusArea }: EditorResult<Data>, value: WidthUnitEnum) {
            if (!focusArea) return;
            item.minMaxWidthOption = value;
          }
        }
      },
      {
        type: 'InputNumber',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          return (
            item?.minMaxWidthOption === WidthUnitEnum.Px ||
            item?.minMaxWidthOption === WidthUnitEnum.Percent
          );
        },
        options: [
          { title: '最小宽度', min: 0, width: '100px' },
          { title: '最大宽度', min: 0, width: '100px' }
        ],
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            return [item.minWidth, item.maxWidth || 100];
          },
          set({ data, focusArea }: EditorResult<Data>, value: number[]) {
            if (!focusArea) return;
            item.minWidth = value[0];
            item.maxWidth = value[0];
          }
        }
      }
    ]
  },
  {
    title: '滚动设置',
    items: [
      {
        title: '上下滚动',
        type: 'Switch',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            return item?.legacyStyle?.overflowY === OverflowEnum.Auto;
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            if (!focusArea) return;
            updateColStyle(item, { overflowY: value ? OverflowEnum.Auto : OverflowEnum.None });
          }
        }
      },
      {
        title: '左右滚动',
        type: 'Switch',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            return item?.legacyStyle?.overflowX === OverflowEnum.Auto;
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            if (!focusArea) return;
            updateColStyle(item, { overflowX: value ? OverflowEnum.Auto : OverflowEnum.None });
          }
        }
      }
    ]
  }
];

export default StyleEditor;
