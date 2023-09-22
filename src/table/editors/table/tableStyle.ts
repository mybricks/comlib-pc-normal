import { DefaultHeadStyle, DefaultContentStyle } from '../../../table/constants';
import { unitConversion } from '../../../utils';
import { isEqual } from 'lodash';
import { Data, SizeEnum } from '../../types';
import { getFilterSelector } from '../../../utils/cssSelector';
import { createStyleForTableContent } from '../../utils';

export const DEFAULT_COLOR = {
  TitleColor: '#1f1f1f',
  TitleBgColor: '#f5f7f9',
  ContentColor: '#434343'
};

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
      value: {
        get({ data }: EditorResult<Data>) {
          return data.fixedHeader;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.fixedHeader = value;
        }
      }
    },
    {
      title: '设置固定表头可滚动高度',
      type: 'Text',
      ifVisible({ data }: EditorResult<Data>) {
        return data.fixedHeader;
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
      target: ({ id }) => `table tbody tr.mybricks-table-row-double td${getFilterSelector(id)}`,
    },
    {
      title: '表格样式控制',
      items: createStyleForTableContent()
    }
  ]
};

export default tableStyleEditor;
