import { Data } from '../../constants';
import { addColumn, copyRow, divideColumn, getRowIndex, getRowItem } from '../utils';

const IndexEditor = [
  {
    title: '添加列',
    type: 'Button',
    value: {
      set(props: EditorResult<Data>) {
        addColumn(props);
      }
    }
  },
  {
    title: '列等分',
    type: 'Button',
    value: {
      set(props: EditorResult<Data>) {
        divideColumn(props);
      }
    }
  },
  {
    title: '复制当前行',
    type: 'Button',
    value: {
      set(props: EditorResult<Data>) {
        copyRow(props);
      }
    }
  },
  {
    title: '上移',
    type: 'Button',
    ifVisible({ focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      const index = getRowIndex(focusArea);
      return index !== undefined && index !== 0;
    },
    value: {
      set({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const index = getRowIndex(focusArea);
        if (index < 1) return;
        const oldRow = data.rows[index - 1];
        data.rows[index - 1] = data.rows[index];
        data.rows[index] = oldRow;
      }
    }
  },
  {
    title: '下移',
    type: 'Button',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      const index = getRowIndex(focusArea);
      return index !== undefined && index + 1 !== data.rows.length;
    },
    value: {
      set({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const index = getRowIndex(focusArea);
        if (index === data.rows.length - 1) return;
        const oldRow = data.rows[index + 1];
        data.rows[index + 1] = data.rows[index];
        data.rows[index] = oldRow;
      }
    }
  },
  {
    title: '删除',
    type: 'Button',
    value: {
      set({ data, slot, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getRowItem(data, focusArea);
        const index = getRowIndex(focusArea);
        item.columns.forEach((columnItem) => {
          slot.remove(columnItem.slot);
        });
        data.rows.splice(index, 1);
      }
    }
  }
];
export default IndexEditor;
