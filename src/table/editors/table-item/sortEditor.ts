import { Data, SorterType } from '../../types';
import { getColumnItem } from '../../utils';

const SortEditor = {
  title: '排序',
  ifVisible({ data, focusArea }: EditorResult<Data>) {
    if (!focusArea) return;
    const item = getColumnItem(data, focusArea);
    return (
      item &&
      ['text', 'color', 'link', 'tag', 'badge', 'date'].includes(item.contentType)
    );
  },
  items: [
    {
      title: '使用排序',
      type: 'Switch',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          return item.sorter?.enable;
        },
        set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          if (item.sorter) {
            item.sorter.enable = value;
          } else {
            item.sorter = {
              enable: value,
              type: 'length'
            };
          }
        }
      }
    },
    {
      title: '排序方式',
      type: 'Select',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea);
        return item && item.sorter?.enable;
      },
      options: [
        { label: '字符长度', value: 'length' },
        { label: '数字大小', value: 'size' },
        { label: '时间前后', value: 'date' },
        { label: '请求接口', value: 'request' }
      ],
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          return item.sorter?.type;
        },
        set({ data, focusArea }: EditorResult<Data>, value: SorterType) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          if (item.sorter) {
            item.sorter.type = value;
          }
        }
      }
    }
  ]
};

export default SortEditor;
