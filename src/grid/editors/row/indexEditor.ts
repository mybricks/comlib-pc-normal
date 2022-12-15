import { Data } from '../../constants';
import { addColumn, copyRow, divideColumnByAuto, getRowIndex, getRowItem, updateCol } from '../utils';

const IndexEditor = [
  {
    title: '行操作',
    items: [
      {
        title: '前面添加行',
        type: 'Button',
        value: {
          set(props: EditorResult<Data>, val: string) {
            copyRow(props, 'before')
          }
        }
      },
      {
        title: '后面添加行',
        type: 'Button',
        value: {
          set(props: EditorResult<Data>, val: string) {
            copyRow(props, 'after')
          }
        }
      },
      {
        title: '上移',
        type: 'Button',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const index = getRowIndex(data, focusArea);
          return index !== undefined && index > 0;
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const index = getRowIndex(data, focusArea);
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
          const index = getRowIndex(data, focusArea);
          return index !== undefined && index < data.rows.length - 1;
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const index = getRowIndex(data, focusArea);
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
            const index = getRowIndex(data, focusArea);
            item.columns.forEach((columnItem) => {
              slot.remove(columnItem.slot);
            });
            data.rows.splice(index, 1);
          }
        }
      }
    ]
  },
  {
    title: '列操作',
    items: [
      {
        title: '添加列',
        type: 'Button',
        value: {
          set(props: EditorResult<Data>) {
            addColumn(props);
            //最后一列“自动填充”需求
            const { data, focusArea, slot } = props
            if (!focusArea) return;
            const row = getRowItem(data, focusArea);
            updateCol(row, slot);
          }
        }
      },
      {
        title: '列等分',
        type: 'Button',
        value: {
          set(props: EditorResult<Data>) {
            divideColumnByAuto(props);
          }
        }
      }]
  },
];
export default IndexEditor;
