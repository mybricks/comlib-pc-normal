import { Layout } from './../constants';
import { Data, OutputIds, Schemas, Option } from '../constants';
import { unitConversion } from '../../utils';

export const LayoutEditor = [
  {
    title: '布局',
    items: [
      {
        title: '布局类型',
        type: 'select',
        options: [
          { label: '横向布局', value: Layout.Horizontal },
          { label: '纵向布局', value: Layout.Vertical },
          { label: '栅格布局', value: Layout.Grid }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.layout;
          },
          set({ data }: EditorResult<Data>, val: Layout) {
            data.layout = val;
          }
        }
      },
      {
        title: '换行',
        type: 'switch',
        description: '容器宽度不足时列表项是否自动换行，不换行默认横向滚动',
        ifVisible({ data }: EditorResult<Data>) {
          return data.layout === Layout.Horizontal;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.isAuto;
          },
          set({ data }: EditorResult<Data>, val: boolean) {
            data.isAuto = val;
          }
        }
      },
      {
        title: '列表项宽度',
        type: 'text',
        description: '横向布局且不换行时列表项的宽度，支持px, %及计算值',
        ifVisible({ data }: EditorResult<Data>) {
          return data.layout === Layout.Horizontal && !data.isAuto;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.itemWidth;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.itemWidth = unitConversion(value)
          }
        }
      },
      {
        title: '列数',
        type: 'InputNumber',
        ifVisible({ data }: EditorResult<Data>) {
          return data.layout === Layout.Grid && !data.isResponsive;
        },
        options: [{ min: 1, max: 1000, width: 100 }],
        value: {
          get({ data }: EditorResult<Data>) {
            return [data.grid.column];
          },
          set({ data, output }: EditorResult<Data>, val) {
            data.grid.column = val[0];
            const canSort = !!(data.layout === Layout.Grid && data.grid.column === 1);
            if (!canSort) {
              output.remove(OutputIds.SortComplete);
            }
          }
        }
      },
      {
        title: '移动端列数',
        type: 'InputNumber',
        ifVisible({ data }: EditorResult<Data>) {
          return data.layout === Layout.Grid && !data.isResponsive;
        },
        options: [{ min: 1, max: 1000, width: 100 }],
        value: {
          get({ data }: EditorResult<Data>) {
            return [data.grid.mobileColumn];
          },
          set({ data }: EditorResult<Data>, val) {
            data.grid.mobileColumn = val[0];
          }
        }
      },
      {
        title: '可拖拽排序',
        type: 'switch',
        ifVisible({ data }: EditorResult<Data>) {
          const canSort = !!(
            data.layout === Layout.Grid &&
            data.grid.column === 1 &&
            !data.isResponsive
          );
          if (!canSort) {
            data.canSort = canSort;
          }
          return canSort;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return !!data.canSort;
          },
          set({ data, output }: EditorResult<Data>, val: boolean) {
            data.canSort = val;
            if (val && data.canSort) {
              output.add(OutputIds.SortComplete, '拖拽完成', Schemas.Array);
            } else {
              output.remove(OutputIds.SortComplete);
            }
          }
        }
      },
      {
        title: '响应式',
        type: 'switch',
        ifVisible({ data }: EditorResult<Data>) {
          return data.layout === Layout.Grid;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.isResponsive;
          },
          set({ data }: EditorResult<Data>, val: boolean) {
            data.isResponsive = val;
          }
        }
      },
      // {
      //   title: '自定义断点',
      //   type: 'switch',
      //   description: '开启后可以自定义配置断点位置, 及列表列数',
      //   ifVisible({ data }: EditorResult<Data>) {
      //     return data.layout === Layout.Grid && !!data.isResponsive;
      //   },
      //   value: {
      //     get({ data }: EditorResult<Data>) {
      //       return data.isCustomPoints;
      //     },
      //     set({ data }: EditorResult<Data>, val) {
      //       data.isCustomPoints = val;
      //     }
      //   }
      // },
      {
        title: '断点列数',
        type: 'InputNumber',
        description:
          'xs:<576px 展示的列数; sm:≥576px 展示的列数; md:≥768px 展示的列数; ld:≥992px 展示的列数; xl:≥1200px 展示的列数; xxl:≥1600px 展示的列数',
        options: [
          { min: 0, max: 100, width: 100, title: '超小(xs)' },
          { min: 0, max: 100, width: 100, title: '小(sm)' },
          { min: 0, max: 100, width: 100, title: '中(md)' },
          { min: 0, max: 100, width: 100, title: '大(lg)' },
          { min: 0, max: 100, width: 100, title: '超大(xl)' },
          { min: 0, max: 100, width: 100, title: '超大型(xxl)' }
        ],
        ifVisible({ data }: EditorResult<Data>) {
          return data.layout === Layout.Grid && !!data.isResponsive && !data.isCustomPoints;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            if (Array.isArray(data.bootstrap)) {
              return data.bootstrap;
            }
          },
          set({ data }: EditorResult<Data>, val) {
            data.bootstrap = val;
          }
        }
      },
      // {
      //   title: '断点配置',
      //   type: 'Array',
      //   description: '自定义配置项, 配置断点位置及列数, 如果对应断点区间没有配置列数, 默认为1',
      //   ifVisible({ data }: EditorResult<Data>) {
      //     return data.layout === Layout.Grid && !!data.isResponsive && !!data.isCustomPoints;
      //   },
      //   options: {
      //     getTitle: ({ point, relation, columns }) => {
      //       return `${relation}${point}px的列数为${columns}`;
      //     },
      //     onAdd: () => {
      //       const defaultOption = {
      //         point: 1000,
      //         relation: '≥',
      //         columns: 5
      //       };
      //       return defaultOption;
      //     },
      //     items: [
      //       {
      //         title: '断点位置',
      //         type: 'Text',
      //         value: 'point',
      //         options: {
      //           type: 'number'
      //         }
      //       },
      //       {
      //         title: '关系',
      //         type: 'Select',
      //         options: [
      //           { label: '≥', value: '≥' },
      //           { label: '<', value: '<' }
      //         ],
      //         value: 'relation'
      //       },
      //       {
      //         title: '列数',
      //         type: 'Text',
      //         value: 'columns',
      //         options: {
      //           type: 'number'
      //         }
      //       }
      //     ]
      //   },
      //   value: {
      //     get({ data }: EditorResult<Data>) {
      //       return data.customOptions;
      //     },
      //     set({ data }: EditorResult<Data>, options: Option[]) {
      //       data.customOptions = options;
      //     }
      //   }
      // },
      {
        title: '列表项间隔',
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
  }
];
