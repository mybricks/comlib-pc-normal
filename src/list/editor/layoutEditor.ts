import {
  Data,
  FlexDirectionEnum,
  FlexWrapEnum,
  FlexAlignEnum,
  LayoutTypeEnum
} from '../constants';

const updateFlextStyle = (
  data: Data,
  key: keyof React.CSSProperties,
  value: any
) => {
  data.flexStyle = {
    ...data.flexStyle,
    [key]: value
  };
};
export const LayoutEditor = [
  {
    title: '布局方式',
    type: 'Select',
    options: [
      { label: '栅格布局', value: LayoutTypeEnum.Grid },
      { label: '弹性布局', value: LayoutTypeEnum.Flex }
    ],
    value: {
      get({ data }: EditorResult<Data>) {
        return data.layoutType || LayoutTypeEnum.Grid;
      },
      set({ data }: EditorResult<Data>, val) {
        if (val === LayoutTypeEnum.Flex) {
          data.flexStyle = {};
        }
        data.layoutType = val;
      }
    }
  },
  {
    title: '栅格布局样式',
    ifVisible({ data }: EditorResult<Data>) {
      return data.layoutType !== LayoutTypeEnum.Flex;
    },
    items: [
      {
        title: '布局',
        type: 'Select',
        options: [
          { label: '垂直排列', value: 'vertical' },
          { label: '水平排列', value: 'horizontal' }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.layout;
          },
          set({ data }: EditorResult<Data>, val) {
            data.layout = val;
          }
        }
      },
      {
        title: '列数',
        type: 'InputNumber',
        options: [{ min: 1, max: 1000, width: 100 }],
        value: {
          get({ data }: EditorResult<Data>) {
            return [data.grid.column];
          },
          set({ data }: EditorResult<Data>, val) {
            data.grid.column = val[0];
          }
        }
      },
      {
        title: '栅格间隔',
        type: 'InputNumber',
        options: [
          { min: 0, max: 1000, width: 100, title: '左右' },
          { min: 0, max: 1000, width: 100, title: '上下' }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            if (Array.isArray(data.grid.gutter)) {
              return data.grid.gutter;
            }
            return [data.grid.gutter, 16];
          },
          set({ data }: EditorResult<Data>, val) {
            if (!data.grid) {
              data.grid = {};
            }
            data.grid = {
              ...data.grid,
              gutter: val
            };
          }
        }
      }
    ]
  },
  {
    title: '弹性布局样式',
    ifVisible({ data }: EditorResult<Data>) {
      return data.layoutType === LayoutTypeEnum.Flex;
    },
    items: [
      {
        title: '排列方向',
        type: 'Select',
        options: [
          { label: '水平排列', value: FlexDirectionEnum.Row },
          { label: '垂直排列', value: FlexDirectionEnum.Column }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.flexStyle?.flexDirection || FlexDirectionEnum.Row;
          },
          set({ data }: EditorResult<Data>, val) {
            updateFlextStyle(data, 'flexDirection', val);
          }
        }
      },
      {
        title: '换行配置',
        type: 'Select',
        options: [
          { label: '不换行', value: FlexWrapEnum.Nowrap },
          { label: '自动换行', value: FlexWrapEnum.Wrap }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.flexStyle?.flexWrap || FlexWrapEnum.Nowrap;
          },
          set({ data }: EditorResult<Data>, val) {
            updateFlextStyle(data, 'flexWrap', val);
          }
        }
      },
      {
        title: '水平方向对齐',
        type: 'Select',
        options: [
          { label: '左对齐', value: FlexAlignEnum.FlexStart },
          { label: '居中对齐', value: FlexAlignEnum.Center },
          { label: '右对齐', value: FlexAlignEnum.FlexEnd },
          { label: '两端对齐', value: FlexAlignEnum.SpaceBetween }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.flexAlign || FlexAlignEnum.FlexStart;
          },
          set({ data }: EditorResult<Data>, val) {
            data.flexAlign = val;
          }
        }
      }
    ]
  }
];
