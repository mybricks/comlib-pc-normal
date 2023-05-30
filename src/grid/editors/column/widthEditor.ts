import { Data, WidthUnitEnum } from '../../constants';
import { getColItem, updateSlotTitle } from '../utils';

const WidthEditor = (item) => [
  {
    title: '宽度填充模式',
    type: 'Select',
    options: [
      { value: WidthUnitEnum.Span, label: '24栅格' },
      { value: WidthUnitEnum.Auto, label: '自动填充' },
      { value: WidthUnitEnum.Px, label: '固定宽度' },
      { value: WidthUnitEnum.Media, label: '响应式宽度' }
    ],
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        return item.widthOption;
      },
      set({ data, slot, focusArea }: EditorResult<Data>, value: WidthUnitEnum) {
        if (!focusArea) return;
        item.widthOption = value;
        updateSlotTitle(item, slot);
      }
    }
  },
  {
    title: '宽度(共24格)',
    type: 'Slider',
    options: [
      {
        max: 24,
        min: 1,
        steps: 1,
        formatter: '/24'
      }
    ],
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      return item?.widthOption === WidthUnitEnum.Span;
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        return item?.span;
      },
      set({ data, slot, focusArea }: EditorResult<Data>, value: number) {
        if (!focusArea) return;
        item.span = value;
        updateSlotTitle(item, slot);
      }
    }
  },
  {
    title: '指定宽度(px)',
    type: 'Text',
    options: {
      type: 'Number'
    },
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      return item?.widthOption === WidthUnitEnum.Px;
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        return item?.width;
      },
      set({ data, slot, focusArea }: EditorResult<Data>, value: number) {
        if (!focusArea) return;
        item.width = value;
        updateSlotTitle(item, slot);
      }
    }
  },
  {
    title: '断点配置(24栅格)',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      return item?.widthOption === WidthUnitEnum.Media;
    },
    items: [
      {
        type: 'Map',
        options: {
          notaddel: true,
          noteditkey: true
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            if (!item.breakPoints) {
              item.breakPoints = {
                'xs <576px': item.span.toString(),
                'sm ≥576px': item.span.toString(),
                'md ≥768px': item.span.toString(),
                'lg ≥992px': item.span.toString(),
                'xl ≥1200px': item.span.toString(),
                'xxl ≥1600px': item.span.toString()
              };
            }
            return item.breakPoints;
          },
          set({ data, focusArea }: EditorResult<Data>, values: any) {
            if (!focusArea) return;
            item.breakPoints = Object.assign(item.breakPoints || {}, values);
          }
        }
      }
    ]
  }
];

export default WidthEditor;
