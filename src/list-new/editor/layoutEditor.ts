import { LayoutType } from './../constants';
import { Data, OutputIds, Schemas, Option } from '../constants';
import { unitConversion } from '../../utils';

const setSlotLayout = (slot, val) => {
  if (!slot) return;
  if (val.position === 'smart') {
    slot.setLayout('smart');
  } else if (val.position === 'absolute') {
    slot.setLayout(val.position);
  } else if (val.display === 'flex') {
    if (val.flexDirection === 'row') {
      slot.setLayout('flex-row');
    } else if (val.flexDirection === 'column') {
      slot.setLayout('flex-column');
    }
  }
};

export const LayoutEditor = [
  {
    title: '布局',
    items: [
      {
        title: '布局类型',
        type: 'select',
        options: [
          { label: '横向布局', value: LayoutType.Horizontal },
          { label: '纵向布局', value: LayoutType.Vertical },
          { label: '栅格布局', value: LayoutType.Grid }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.layoutType;
            // if (data.isAuto === true && data.isCustom === true) {
            //   return 'grid';
            // } else if (data.isAuto === true && data.layout === 'vertical') {
            //   return 'vertical';
            // } else if (data.layout === 'horizontal') {
            //   return 'horizontal';
            // }
          },
          set({ data }: EditorResult<Data>, val: LayoutType) {
            data.layoutType = val;
            // switch (val) {
            //   case 'grid': {
            //     data.isAuto = true;
            //     data.isCustom = true;
            //     data.layout = '';
            //     break;
            //   }
            //   case 'vertical': {
            //     data.isAuto = true;
            //     data.layout = 'vertical';
            //     data.isCustom = false;
            //     data.isResponsive = false;
            //     break;
            //   }
            //   case 'horizontal': {
            //     data.layout = 'horizontal';
            //     data.isCustom = false;
            //     data.isResponsive = false;
            //     break;
            //   }
            // }
          }
        }
      },
      {
        title: '换行',
        type: 'switch',
        ifVisible({ data }: EditorResult<Data>) {
          return data.layoutType === LayoutType.Horizontal;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.isAutoWrap;
          },
          set({ data }: EditorResult<Data>, val: boolean) {
            data.isAutoWrap = val;
          }
        }
      },
      {
        title: '列数',
        type: 'InputNumber',
        ifVisible({ data }: EditorResult<Data>) {
          return data.layoutType === LayoutType.Grid && !data.isResponsive;
        },
        options: [{ min: 1, max: 1000, width: 100 }],
        value: {
          get({ data }: EditorResult<Data>) {
            return [data.grid.column];
          },
          set({ data, output }: EditorResult<Data>, val) {
            data.grid.column = val[0];
            const canSort = !!(data.layoutType === LayoutType.Grid && data.grid.column === 1);
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
          return data.layoutType === LayoutType.Grid && !data.isResponsive;
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
            data.layoutType === LayoutType.Grid &&
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
          return data.layoutType === LayoutType.Grid;
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
      {
        title: '自定义断点',
        type: 'switch',
        description: '开启后可以自定义配置断点位置, 及列表列数',
        ifVisible({ data }: EditorResult<Data>) {
          return data.layoutType === LayoutType.Grid && !!data.isResponsive;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.isCustomPoints;
          },
          set({ data }: EditorResult<Data>, val) {
            data.isCustomPoints = val;
          }
        }
      },
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
          return data.layoutType === LayoutType.Grid && !!data.isResponsive && !data.isCustomPoints;
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
      {
        title: '断点配置',
        type: 'Array',
        description: '自定义配置项, 配置断点位置及列数, 如果对应断点区间没有配置列数, 默认为1',
        ifVisible({ data }: EditorResult<Data>) {
          return data.layoutType === LayoutType.Grid && !!data.isResponsive && !!data.isCustomPoints;
        },
        options: {
          getTitle: ({ point, relation, columns }) => {
            return `${relation}${point}px的列数为${columns}`;
          },
          onAdd: () => {
            const defaultOption = {
              point: 1000,
              relation: '≥',
              columns: 5
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
                { label: '≥', value: '≥' },
                { label: '<', value: '<' }
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
  },
  // {
  //   title: '列表项布局',
  //   items: [
  //     {
  //       type: 'layout',
  //       options: [],
  //       value: {
  //         get({ data, slots }: EditorResult<Data>) {
  //           const { slotStyle = {} } = data;
  //           // const slotInstance = slots.get('item');
  //           // setSlotLayout(slotInstance, slotStyle);
  //           return slotStyle;
  //         },
  //         set({ data, slots }: EditorResult<Data>, val: any) {
  //           if (!data.slotStyle) {
  //             data.slotStyle = {};
  //           }
  //           data.slotStyle = {
  //             ...data.slotStyle,
  //             ...val
  //           };
  //           const slotInstance = slots.get('item');
  //           setSlotLayout(slotInstance, val);
  //         }
  //       }
  //     }
  //   ]
  // }
];
