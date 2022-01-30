import { setCol } from '../../schema';
import { Data } from '../../types';

const EllipsisEditor = {
  title: '省略换行配置',
  ifVisible({ data, focusArea }: EditorResult<Data>) {
    const item = data.columns[focusArea.dataset.tableThIdx];
    return ['text', 'color', 'link'].includes(item.contentType);
  },
  items: [
    {
      title: '超出时自动省略',
      type: 'Switch',
      description: '内容超出宽度后文本是否自动省略、不换行、以省略号结尾',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = data.columns[focusArea.dataset.tableThIdx];
          return item.ellipsis;
        },
        set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          if (!focusArea) return;
          setCol(data, focusArea, value, 'ellipsis');
        }
      }
    },
    {
      title: '内容省略文字提示',
      type: 'Switch',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        const item = data.columns[focusArea.dataset.tableThIdx];
        return ['text', 'color', 'link'].includes(item.contentType);
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = data.columns[focusArea.dataset.tableThIdx];
          return item.useTooltip;
        },
        set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          if (!focusArea) return;
          setCol(data, focusArea, value, 'useTooltip');
        }
      }
    },
    {
      title: '保留换行',
      type: 'Switch',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        const item = data.columns[focusArea.dataset.tableThIdx];
        return ['text', 'color', 'link'].includes(item.contentType);
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = data.columns[focusArea.dataset.tableThIdx];
          return item.keepWordWrap;
        },
        set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          if (!focusArea) return;
          setCol(data, focusArea, value, 'keepWordWrap');
        }
      }
    }
  ]
};

export default EllipsisEditor;
