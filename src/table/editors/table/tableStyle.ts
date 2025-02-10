import { InputIds, OutputIds } from '../../constants';
import { Schemas } from '../../schema';
import { unitConversion } from '../../../utils';
import { Data, SizeEnum } from '../../types';
import { getFilterSelector } from '../../../utils/cssSelector';
import { createStyleForTableContent } from '../../utils';

const tableStyleEditor = {
  title: '表格样式',
  items: [
    {
      title: '布局风格',
      type: 'Select',
      options: [
        { value: SizeEnum.Default, label: '默认' },
        { value: SizeEnum.Middle, label: '适中布局' },
        { value: SizeEnum.Small, label: '紧凑布局' }
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.size;
        },
        set({ data }: EditorResult<Data>, value: SizeEnum) {
          data.size = value;
        }
      }
    },
    {
      title: '显示边框',
      description: '开启后，显示表格边框，默认开启',
      type: 'Switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.bordered;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.bordered = value;
        }
      }
    },
    {
      title: '固定表头',
      type: 'Switch',
      description:
        '开启后，表头固定，表格内容支持滚动。可以设置编辑项【可滚动最大高度】和【固定高度】来控制滚动',
      ifVisible({ style }: EditorResult<Data>) {
        return !!style.height;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.fixedHeader;
        },
        set({ data, input, output, style}: EditorResult<Data>, value: boolean) {
          data.fixedHeader = value;
          const event1 = input.get(InputIds.TABLE_HEIGHT);
          const event2 = output.get(InputIds.TABLE_HEIGHT);
          if (value) {
            !event1 && input.add(InputIds.TABLE_HEIGHT, '设置表格高度', Schemas.TABLE_HEIGHT);
            !event2 && output.add(OutputIds.TABLE_HEIGHT, '表格高度', Schemas.TABLE_HEIGHT);
            input.get(InputIds.TABLE_HEIGHT).setRels([OutputIds.TABLE_HEIGHT]);
          } else {
            data.fixedHeight= ''
            data.scroll.y = ''
            style.height = "fit-content"
            event1 && input.remove(InputIds.TABLE_HEIGHT);
            event2 && output.remove(OutputIds.TABLE_HEIGHT);
          }
        }
      }
    },
    {
      title: '可滚动最大高度',
      description: '设置表格的可滚动最大高度，开启固定表头后生效',
      type: 'Text',
      ifVisible({ data, style }: EditorResult<Data>) {
        return data.fixedHeader && !!style.height;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.scroll.y;
        },
        set({ data }: EditorResult<Data>, value) {
          data.scroll.y = unitConversion(value);
        }
      }
    },
    {
      title: '固定高度',
      type: 'text',
      description: '设置表格的固定高度，开启固定表头后生效',
      ifVisible({ data, style }: EditorResult<Data>) {
        console.log("style.height", style.height)
        return data.fixedHeader && !!style.height;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.fixedHeight;
        },
        set({ data, input }: EditorResult<Data>, val: string) {
          data.fixedHeight = unitConversion(val);
        }
      }
    },
    {
      title: '斑马纹',
      type: 'Switch',
      description: '开启后，可以设置表格的单双行采用不同样式',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.enableStripe;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.enableStripe = value;
        }
      }
    },
    {
      title: '单行',
      ifVisible({ data }: EditorResult<Data>) {
        return data.enableStripe;
      },
      options: [{ type: 'background', config: { disableBackgroundImage: true } }],
      target: ({ id }) => `table tbody tr.mybricks-table-row-single td${getFilterSelector(id)}`
    },
    {
      title: '双行',
      ifVisible({ data }: EditorResult<Data>) {
        return data.enableStripe;
      },
      options: [{ type: 'background', config: { disableBackgroundImage: true } }],
      target: ({ id }) => `table tbody tr.mybricks-table-row-double td${getFilterSelector(id)}`
    },
    {
      title: '单元格选中状态',
      type: 'switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.enableCellFocus;
        },
        set({ data, output, ...res }: EditorResult<Data>, value: boolean) {
          data.enableCellFocus = value;
        }
      }
    },
    // {
    //   title: '边框间距',
    //   type: 'inputnumber',
    //   description: '指定相邻单元格边框之间的距离，分别配置上下和左右',
    //   options: [
    //     { min: 0, max: 200, width: 60 },
    //     { min: 0, max: 200, width: 60 }
    //   ],
    //   ifVisible({ data, style }: EditorResult<Data>) {
    //     return !!data.columns.length && style?.height === 'auto';
    //   },
    //   value: {
    //     get({ data }: EditorResult<Data>) {
    //       return data?.borderSpacing || [0, 0];
    //     },
    //     set({ data, output, ...res }: EditorResult<Data>, value: Data['borderSpacing']) {
    //       data.borderSpacing = value;
    //     }
    //   }
    // },
    {
      //title: '表格样式控制',
      items: createStyleForTableContent()
    }
  ]
};

export default tableStyleEditor;
