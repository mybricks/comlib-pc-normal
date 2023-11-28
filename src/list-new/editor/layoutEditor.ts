import {
  Data,
  OutputIds,
  Schemas,
  Option
} from '../constants';
import { unitConversion } from '../../utils';

export const LayoutEditor = [
  {
    title: '布局',
    items: [
      {
        title: '响应式布局',
        type: 'switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.isResponsive;
          },
          set({ data }: EditorResult<Data>, val: boolean) {
            data.isResponsive = val;
          }
        }
      },
      {
        title: '自定义断点',
        type: 'switch',
        description: '开启后可以自定义配置断点位置, 及列表列数',
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.isResponsive;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.isCustomPoints;
          },
          set({ data }: EditorResult<Data>, val) {
            data.isCustomPoints = val
          }
        }
      },
      {
        title: '断点列数',
        type: 'InputNumber',
        description: 'xs:<576px 展示的列数; sm:≥576px 展示的列数; md:≥768px 展示的列数; ld:≥992px 展示的列数; xl:≥1200px 展示的列数; xxl:≥1600px 展示的列数',
        options: [
          { min: 0, max: 100, width: 100, title: '超小(xs)' },
          { min: 0, max: 100, width: 100, title: '小(sm)' },
          { min: 0, max: 100, width: 100, title: '中(md)' },
          { min: 0, max: 100, width: 100, title: '大(lg)' },
          { min: 0, max: 100, width: 100, title: '超大(xl)' },
          { min: 0, max: 100, width: 100, title: '超大型(xxl)' }
        ],
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.isResponsive && !data.isCustomPoints;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            if (Array.isArray(data.bootstrap)) {
              return data.bootstrap;
            }
          },
          set({ data }: EditorResult<Data>, val) {
            data.bootstrap = val
          }
        }
      },
      {
        title: '断点配置',
        type: 'Array',
        description: '自定义配置项, 配置断点位置及列数, 如果对应断点区间没有配置列数, 默认为1',
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.isResponsive && !!data.isCustomPoints;
        },
        options: {
          getTitle: ({ point, relation, columns }) => {
            return `${relation}${point}px的列数为${columns}`;
          },
          onAdd: () => {
            const defaultOption = {
              point: 1000,
              relation: '≥',
              columns: 5,
            };
            return defaultOption;
          },
          items: [
            {
              title: '断点位置',
              type: 'Text',
              value: 'point',
              options: {
                type: 'number'
              }
            },
            {
              title: '关系',
              type: 'Select',
              options: [
                { label: '≥', value: "≥" },
                { label: '<', value: "<" }
              ],
              value: 'relation'
            },
            {
              title: '列数',
              type: 'Text',
              value: 'columns',
              options: {
                type: 'number'
              }
            }
          ]
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.customOptions;
          },
          set({ data }: EditorResult<Data>, options: Option[]) {
            data.customOptions = options;
          }
        }
      },
      {
        title: '换行',
        type: 'switch',
        description: '默认自动换行，关闭后不换行, 接着可配置是否需要横向滚动',
        ifVisible({ data }: EditorResult<Data>) {
          return !data.isResponsive;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.isAuto;
          },
          set({ data, output }: EditorResult<Data>, val: boolean) {
            data.isAuto = val;
            const canSort = !!(data.isAuto && data.isCustom && data.grid.column === 1);
            if(!canSort){
              output.remove(OutputIds.SortComplete);
            }
          }
        }
      },
      {
        title: '方向',
        type: 'Radio',
        description: '默认纵向，一行一个元素；横向时，元素横向排列，自动换行',
        ifVisible({ data }: EditorResult<Data>) {
          return !data.isCustom && data.isAuto && !data.isResponsive;
        },
        options: [
          { value: 'horizontal', label: '横向' },
          { value: 'vertical', label: '纵向' }
        ],
        value: {
          get({ data }) {
            return data.layout || 'vertical';
          },
          set({ data }, value: 'horizontal'|'vertical') {
            data.layout = value;
          }
        }
      },
      {
        title: '横向滚动',
        type: 'switch',
        description: '开启后传递的内容超过页面宽度后, 可选择是否需要横向滚动, 开启后横向滚动, 否则隐藏内容',
        ifVisible({ data }: EditorResult<Data>) {
          return !data.isAuto && !data.isResponsive;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.isScroll || false;
          },
          set({ data }: EditorResult<Data>, val: boolean) {
            data.isScroll = val;
          }
        }
      },
      {
        title: '列表项宽度',
        type: 'text',
        description: '开启后传递的内容超过页面宽度后, 可选择是否需要横向滚动, 开启后横向滚动, 否则隐藏内容;支持px, %及计算值',
        ifVisible({ data }: EditorResult<Data>) {
          return !data.isAuto && !data.isResponsive;
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
        title: '列数自定义',
        type: 'switch',
        description: '开启后，可自定义列数',
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.isAuto && !data.isResponsive;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.isCustom || false;
          },
          set({ data, output }: EditorResult<Data>, val: boolean) {
            data.isCustom = val;
            const canSort = !!(data.isAuto && data.isCustom && data.grid.column === 1)
            if(!canSort){
              output.remove(OutputIds.SortComplete);
            }
          }
        }
      },
      {
        title: '列数',
        type: 'InputNumber',
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.isAuto && !!data.isCustom && !data.isResponsive;
        },
        options: [{ min: 1, max: 1000, width: 100 }],
        value: {
          get({ data }: EditorResult<Data>) {
            return [data.grid.column];
          },
          set({ data, output }: EditorResult<Data>, val) {
            data.grid.column = val[0];
            const canSort = !!(data.isAuto && data.isCustom && data.grid.column === 1)
            if(!canSort){
              output.remove(OutputIds.SortComplete);
            }
          }
        }
      },
      {
        title: '移动端列数',
        type: 'InputNumber',
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.isAuto && !!data.isCustom && !data.isResponsive;
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
          const canSort = !!(data.isAuto && data.isCustom && data.grid.column === 1 && !data.isResponsive)
          if (!canSort) {
            data.canSort = canSort
          }
          return canSort;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return !!data.canSort;
          },
          set({ data, output }: EditorResult<Data>, val: boolean) {
            data.canSort = val;
            if(val && data.canSort){
              output.add(OutputIds.SortComplete, '拖拽完成', Schemas.Array);
            }else{
              output.remove(OutputIds.SortComplete);
            }
          }
        }
      },
      {
        title: '间隔',
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
      },
    ]
  }
];
