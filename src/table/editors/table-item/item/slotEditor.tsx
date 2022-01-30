import { Data } from '../../../types';

const SlotEditor = {
  title: '插槽配置',
  ifVisible({ data, focusArea }: EditorResult<Data>) {
    if (!focusArea) return;
    const column = data.columns[focusArea.dataset.tableThIdx];
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
          const column = data.columns[focusArea.dataset.tableThIdx];
          data.selectComNameSpace = namespace;
          slot.get(column.slotId).addCom(namespace, false, { deletable: true });
        }
      }
    }
  ]
};

export default SlotEditor;
