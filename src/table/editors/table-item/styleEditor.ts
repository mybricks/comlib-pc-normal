import { setCol } from '../../schema';
import { OutputIds } from '../../constants';
import {
  AlignEnum,
  ContentTypeEnum,
  Data,
  FixedEnum,
  TableLayoutEnum,
  WidthTypeEnum
} from '../../types';
import { getColumnItem } from '../../utils';

const StyleEditor = [
  {
    title: "开关切换事件",
    type: '_Event',
    ifVisible({ data , focusArea, output, ...res}: EditorResult<Data>) {
      if (!focusArea) return;
      if(getColumnItem(data, focusArea).contentType === ContentTypeEnum.Switch) {
        return true
      }else{
        return false
      }
    },
    options: ({ data, focusArea }: EditorResult<Data>) => {
      const item = getColumnItem(data, focusArea);
      return {
        outputId: `${OutputIds.CELL_SWITCH_CLICK}_${item.key}`,
      };
    }
  },
  {
    title: '内容省略展示',
    type: 'Switch',
    description: '开启后，表格的单元格宽度不够时，内部文本内容可以自动省略、不换行、以省略号结尾',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      return getColumnItem(data, focusArea).contentType === ContentTypeEnum.Text;
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea);
        return item.ellipsis;
      },
      set({ data, focusArea }: EditorResult<Data>, value: boolean) {
        if (!focusArea) return;
        setCol({ data, focusArea }, 'ellipsis', value);
      }
    }
  },
  {
    title: '适应剩余宽度',
    description: "开启后，当前表格列将会填充剩余宽度。关闭时，可以手动设置列宽度，也可以在画布中拖动列的左右边框进行宽度调整",
    type: 'Switch',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      const item = getColumnItem(data, focusArea);
      return item.contentType !== ContentTypeEnum.Group;
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        const item = getColumnItem(data, focusArea);
        return item.width === WidthTypeEnum.Auto;
      },
      set({ data, focusArea }: EditorResult<Data>, value: boolean) {
        if (value) {
          setCol({ data, focusArea }, 'width', WidthTypeEnum.Auto);
        } else {
          setCol({ data, focusArea }, 'width', 140);
        }
      }
    }
  },
  {
    title: '宽度(px)',
    type: 'Text',
    description: "【适应剩余宽度】关闭时，可以在这里修改列的宽度",
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      const item = getColumnItem(data, focusArea);
      return item.contentType !== ContentTypeEnum.Group && item.width !== WidthTypeEnum.Auto;
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        const item = getColumnItem(data, focusArea);
        return item.width;
      },
      set({ data, focusArea }: EditorResult<Data>, value: string) {
        setCol({ data, focusArea }, 'width', +(value || 140));
      }
    }
  },
  {
    title: '固定列',
    type: 'Select',
    description: '对于列数很多的数据，可以固定前后的列，横向滚动查看其它数据',
    options: [
      { value: FixedEnum.Default, label: '默认' },
      { value: FixedEnum.Left, label: '左固定' },
      { value: FixedEnum.Right, label: '右固定' }
    ],
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      const item = getColumnItem(data, focusArea);
      return (
        item.contentType !== ContentTypeEnum.Group && data.tableLayout !== TableLayoutEnum.Auto
      );
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea);
        return item.fixed || FixedEnum.Default;
      },
      set({ data, focusArea }, value: FixedEnum) {
        if (!focusArea) return;
        setCol({ data, focusArea }, 'fixed', value);
      }
    }
  },
];

export default StyleEditor;
