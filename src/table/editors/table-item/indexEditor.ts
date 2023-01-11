import { setCol, setDataSchema } from '../../schema';
import { ContentTypeEnum, Data } from '../../types';
import { getColumnItem, getColumnItemInfo, getNewColumn } from '../../utils';

const IndexEditor = [
  {
    title: '前移',
    type: 'Button',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      const { index } = getColumnItemInfo(data, focusArea);
      return focusArea && index !== undefined && index !== 0;
    },
    value: {
      set({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const { index, parent } = getColumnItemInfo(data, focusArea);
        if (index < 1) return;
        const tempOption = parent[index - 1]; //存储前一个
        parent[index - 1] = parent[index];
        parent[index] = tempOption;
      }
    }
  },
  {
    title: '后移',
    type: 'Button',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      const { index, parent } = getColumnItemInfo(data, focusArea);
      return focusArea && index !== undefined && index + 1 !== parent.length;
    },
    value: {
      set({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const { index, parent } = getColumnItemInfo(data, focusArea);
        if (index === parent.length - 1) return; // -1 无操作  -2 有操作
        const tempOption = parent[index + 1]; //存储后一个
        parent[index + 1] = parent[index];
        parent[index] = tempOption;
      }
    }
  },
  {
    title: '列前添加列',
    type: 'Button',
    value: {
      set({ data, focusArea, output, input, ...res }: EditorResult<Data>) {
        if (!focusArea) return;
        const { index, parent } = getColumnItemInfo(data, focusArea);
        parent.splice(index, 0, getNewColumn(data));
        setDataSchema({ data, focusArea, output, input, ...res });
      }
    }
  },
  {
    title: '列后添加列',
    type: 'Button',
    value: {
      set({ data, focusArea, output, input, ...res }: EditorResult<Data>) {
        if (!focusArea) return;
        const { index, parent } = getColumnItemInfo(data, focusArea);
        parent.splice(index + 1, 0, getNewColumn(data));
        setDataSchema({ data, focusArea, output, input, ...res });
      }
    }
  },
  {
    title: '删除',
    type: 'Button',
    value: {
      set({ data, focusArea, input, slot, ...res }: EditorResult<Data>) {
        if (!focusArea) return;
        const { index, parent, column } = getColumnItemInfo(data, focusArea);
        parent.splice(index, 1);
        if (column.slotId && slot.get(column.slotId)) {
          slot.remove(column.slotId);
        }
        setDataSchema({ data, focusArea, input, slot, ...res });
      }
    }
  },
  {
    title: '隐藏',
    type: 'Button',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      const item = getColumnItem(data, focusArea);
      return (
        item.visible !== false &&
        ![ContentTypeEnum.Group, ContentTypeEnum.SlotItem].includes(item.contentType)
      );
    },
    value: {
      set({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        setCol({ data, focusArea }, 'visible', false);
      }
    }
  }
];

export default IndexEditor;
