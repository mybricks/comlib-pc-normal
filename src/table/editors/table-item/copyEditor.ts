import { setCol } from '../../schema';
import { Data } from '../../types';

const CopyEditor = {
  title: '复制',
  ifVisible({ data, focusArea }: EditorResult<Data>) {
    const item = data.columns[focusArea.dataset.tableThIdx];
    return ['text'].includes(item.contentType);
  },
  items: [
    {
      title: '支持复制',
      type: 'Switch',
      description: '支持复制表单项数据',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = data.columns[focusArea.dataset.tableThIdx];
          return item.supportCopy;
        },
        set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          if (!focusArea) return;
          setCol(data, focusArea, value, 'supportCopy');
        }
      }
    }
  ]
};

export default CopyEditor;
