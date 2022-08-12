import { setCol } from '../../schema';
import { Data } from '../../types';
import { getColumnItem } from '../../utils';

const CopyEditor = {
  title: '复制',
  ifVisible({ data, focusArea }: EditorResult<Data>) {
    if (!focusArea) return;
    const item = getColumnItem(data, focusArea);
    return ['text', 'date'].includes(item.contentType);
  },
  items: [
    {
      title: '支持复制',
      type: 'Switch',
      description: '支持复制表单项数据',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
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
