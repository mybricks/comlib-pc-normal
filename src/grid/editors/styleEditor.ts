import { Data, WidthUnitEnum } from '../constants';

const StyleEditor = [
  {
    title: '容器',
    type: 'style',
    options: ['BgColor', 'Border', 'BgImage'],
    value: {
      get({ data }: EditorResult<Data>) {
        return data.style;
      },
      set({ data }: EditorResult<Data>, value: any) {
        data.style = {
          ...value
        };
      }
    }
  },
  {
    title: '单元格',
    type: 'style',
    options: ['BgColor', 'Border', 'BgImage', 'Padding'],
    value: {
      get({ data }: EditorResult<Data>) {
        return data.globalColStyle;
      },
      set({ data }: EditorResult<Data>, value: any) {
        data.rows.forEach((row) => {
          row.columns.forEach((col) => {
            col.colStyle = {
              ...col.colStyle,
              ...value
            };
          });
        });
        data.globalColStyle = {
          ...value
        };
      }
    }
  },
  {
    title: '宽度设置',
    items: [
      {
        type: 'Select',
        options: [
          { value: WidthUnitEnum.Percent, label: '百分比宽度' },
          { value: WidthUnitEnum.Px, label: '固定宽度' }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.widthUnit;
          },
          set({ data, style }: EditorResult<Data>, value: string) {
            data.widthUnit = value;
            style.width = parseInt(style.width, 10) + value;
          }
        }
      },
      {
        title: '百分比宽度(%)',
        type: 'Text',
        options: {
          type: 'number',
          placeholder: '设置百分比宽度/%'
        },
        ifVisible({ data }: EditorResult<Data>) {
          return data.widthUnit === WidthUnitEnum.Percent;
        },
        value: {
          get({ style }: EditorResult<Data>) {
            return parseInt(style.width, 10);
          },
          set({ style }: EditorResult<Data>, value: string) {
            style.width = value ? `${value}%` : '100%';
          }
        }
      },
      {
        title: '固定宽度(px)',
        type: 'Text',
        options: {
          type: 'number',
          placeholder: '设置固定宽度/px'
        },
        ifVisible({ data }: EditorResult<Data>) {
          return data.widthUnit === WidthUnitEnum.Px;
        },
        value: {
          get({ style }: EditorResult<Data>) {
            return parseInt(style.width, 10);
          },
          set({ style }: EditorResult<Data>, value: string) {
            style.width = value ? `${value}px` : '100%';
          }
        }
      }
    ]
  }
];

export default StyleEditor;
