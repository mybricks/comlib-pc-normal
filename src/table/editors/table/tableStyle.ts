import { InputIds, OutputIds } from '../../constants';
import { Schemas } from '../../schema';
import { unitConversion } from '../../../utils';
import { isEqual } from 'lodash';
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
      description: '设置表头固定，只滚动数据行。必须同时设置【每一列的宽度】',
      ifVisible({ style }: EditorResult<Data>) {
        return style.height === 'auto';
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.fixedHeader;
        },
        set({ data, input, output }: EditorResult<Data>, value: boolean) {
          data.fixedHeader = value;
          const event1 = input.get(InputIds.TABLE_HEIGHT);
          const event2 = output.get(InputIds.TABLE_HEIGHT);
          if (value) {
            !event1 && input.add(InputIds.TABLE_HEIGHT, '设置表格高度', Schemas.TABLE_HEIGHT);
            !event2 && output.add(OutputIds.TABLE_HEIGHT, '表格高度', Schemas.TABLE_HEIGHT);

            input.get(InputIds.TABLE_HEIGHT).setRels([OutputIds.TABLE_HEIGHT]);
          } else {
            event1 && input.remove(InputIds.TABLE_HEIGHT);
            event2 && output.remove(OutputIds.TABLE_HEIGHT);
          }
        }
      }
    },
    {
      title: '可滚动最大高度',
      type: 'Text',
      ifVisible({ data, style }: EditorResult<Data>) {
        return data.fixedHeader && style.height === 'auto';
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
      ifVisible({ data, style }: EditorResult<Data>) {
        return data.fixedHeader && style.height === 'auto';
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
      title: '开启斑马纹',
      type: 'Switch',
      description: '配置表格的单双行为不同样式',
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
    {
      title: '表格样式控制',
      items: createStyleForTableContent()
    }
  ]
};

export default tableStyleEditor;
