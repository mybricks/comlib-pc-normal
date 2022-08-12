import { Data } from '../../../types';
import { getColumnItem } from '../../../utils';

const SlotEditor = {
  title: '插槽配置',
  ifVisible({ data, focusArea }: EditorResult<Data>) {
    if (!focusArea) return;
    const column = getColumnItem(data, focusArea);
    return column.contentType === 'slotItem';
  },
  items: [
    {
      title: '选择组件',
      type: 'comSelector',
      options: {
        schema: 'parent-schema'
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.selectComNameSpace;
        },
        set({ data, slot, focusArea }: EditorResult<Data>, namespace) {
          if (!focusArea) return;
          const column = getColumnItem(data, focusArea);
          data.selectComNameSpace = namespace;
          slot.get(column.slotId).addCom(namespace, false, { deletable: true });
        }
      }
    }
  ]
};

export default SlotEditor;
