import { setDataSchema } from '../../../schema';
import { Data } from '../../../types';
import { getColumnItem, getNewColumn } from '../../../utils';

export default {
  title: '分组配置',
  ifVisible({ data, focusArea }: EditorResult<Data>) {
    if (!focusArea) return;
    const item = getColumnItem(data, focusArea);
    return item.contentType === 'group';
  },
  items: [
    {
      title: '添加子项',
      type: 'Button',
      value: {
        set({ data, focusArea, output, input }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          item.children = [...item.children, getNewColumn()];
          setDataSchema({ data, output, input });
          data.columns = [...data.columns];
        }
      }
    }
  ]
};
