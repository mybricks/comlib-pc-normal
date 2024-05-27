import { DataType } from './constants';

export default {
  ':slot': {},
  '@init'({ style }) {
    style.width = '100%';
    style.height = 'fit-content';
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': {
    style: [
      {
        title: '标题',
        type: 'style',
        ifVisible({ data }: EditorResult<DataType>) {
          return data.type === 'horizontal';
        },
        options: [{ type: 'font', config: { disableTextAlign: true } }],
        target: '.ant-divider-inner-text'
      },
      {
        title: '分割线',
        type: 'style',
        ifVisible({ data }: EditorResult<DataType>) {
          return data.type === 'horizontal';
        },
        options: ['margin'],
        target: '.ant-divider-horizontal'
      },
      {
        title: '分割线',
        type: 'style',
        ifVisible({ data }: EditorResult<DataType>) {
          return data.type === 'vertical';
        },
        options: ['margin'],
        target: '.ant-divider-vertical'
      }
    ],
    items: [
      {
        title: '分割线',
        items: [
          {
            title: '是否虚线',
            type: 'Switch',
            value: {
              get({ data }: EditorResult<DataType>) {
                return data?.dashed;
              },
              set({ data }: EditorResult<DataType>, value: DataType['dashed']) {
                data.dashed = value;
              }
            }
          },
          {
            title: '方向',
            type: 'Select',
            options: [
              { value: 'horizontal', label: '水平' },
              { value: 'vertical', label: '垂直' }
            ],
            value: {
              get({ data }: EditorResult<DataType>) {
                return data.type;
              },
              set({ data }: EditorResult<DataType>, value: DataType['type']) {
                data.type = value;
              }
            }
          },
          {
            title: '颜色',
            type: 'colorPicker',
            value: {
              get({ data }: EditorResult<DataType>) {
                return data.style?.borderTopColor;
              },
              set({ data }: EditorResult<DataType>, value: string) {
                const newStyle = { ...data.style };
                newStyle.borderTopColor = value;
                data.style = newStyle;
              }
            }
          }
        ]
      },
      {
        title: '标题',
        ifVisible({ data }: EditorResult<DataType>) {
          return data.type === 'horizontal';
        },
        items: [
          {
            title: '标题',
            type: 'Text',
            value: {
              get({ data }: EditorResult<DataType>) {
                return data?.children;
              },
              set({ data }: EditorResult<DataType>, value: string) {
                data.children = value;
              }
            }
          },
          {
            title: '标题位置',
            type: 'Select',
            options: [
              { value: 'left', label: '左' },
              { value: 'center', label: '中' },
              { value: 'right', label: '右' }
            ],
            value: {
              get({ data }: EditorResult<DataType>) {
                return data?.orientation;
              },
              set({ data }: EditorResult<DataType>, value: DataType['orientation']) {
                data.orientation = value;
              }
            }
          },
          {
            title: '与最近的左右边缘间距',
            type: 'inputNumber',
            description: '标题和最近 left/right 边框之间的距离，单位 px',
            ifVisible({ data }: EditorResult<DataType>) {
              return data.orientation !== 'center';
            },
            options: [{ min: -Infinity, max: Infinity, width: 120 }],
            value: {
              get({ data }: EditorResult<DataType>) {
                return [data?.orientationMargin || 0];
              },
              set({ data }: EditorResult<DataType>, value: number[]) {
                data.orientationMargin = value[0];
              }
            }
          },
          {
            title: '自定义标题',
            type: 'Switch',
            value: {
              get({ data }: EditorResult<DataType>) {
                return data?.customizableTitle;
              },
              set({ data }: EditorResult<DataType>, value: DataType['customizableTitle']) {
                data.customizableTitle = value;
              }
            }
          }
        ]
      }
    ]
  },
  '.ant-divider-inner-text': {
    '@dblclick': {
      type: 'text',
      value: {
        get({ data }: EditorResult<DataType>) {
          return data?.children;
        },
        set({ data }: EditorResult<DataType>, value: string) {
          data.children = value;
        }
      }
    }
  }
};
