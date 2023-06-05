import { Data, WidthUnitEnum, IRow } from '../../constants';
const StyleEditor = (row: IRow) => [
  {
    title: '自动换行',
    type: 'Switch',
    value: {
      get({}: EditorResult<Data>) {
        return row?.wrap;
      },
      set({}: EditorResult<Data>, value: boolean) {
        row.wrap = value;
      }
    }
  },
  {
    title: '间距配置',
    items: [
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
        value: {
          get({}: EditorResult<Data>) {
            return row?.gutter[0];
          },
          set({}: EditorResult<Data>, value: string) {
            row.gutter[0] = value;
          }
        }
      },
      {
        title: '垂直间隔',
        type: 'Slider',
        options: [
          {
            max: 1000,
            min: 0,
            step: 1,
            formatter: WidthUnitEnum.Px
          }
        ],
        value: {
          get({}: EditorResult<Data>) {
            return row?.gutter[1];
          },
          set({}: EditorResult<Data>, value: string) {
            row.gutter[1] = value;
          }
        }
      }
    ]
  }
];
export default StyleEditor;
