import { setDataSchema } from '../../../schema';
import { ContentTypeEnum, Data } from '../../../types';
import { getColumnItem, getNewColumn } from '../../../utils';

export default {
  title: '分组配置',
  ifVisible({ data, focusArea }: EditorResult<Data>) {
    if (!focusArea) return;
    const item = getColumnItem(data, focusArea);
    return item.contentType === ContentTypeEnum.Group;
  },
  items: [
    {
      title: '添加子项',
      type: 'Button',
      value: {
        set({ data, focusArea, output, input, ...res }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          item.children = [...(item.children || []), getNewColumn(data)];
          setDataSchema({ data, focusArea, output, input, ...res });
          data.columns = [...data.columns];
        }
      }
    }
  ]
};
