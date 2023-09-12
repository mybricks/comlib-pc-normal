import { Data, WidthUnitEnum } from '../../constants';
import { getColIndex, getColItem, updateCol, addColumnByPosition, canSplit, splitColumn, canMerge, mergeCol } from '../utils';

const IndexEditor = (item) => [
  {
    title: '操作',
    items: [
      {
        title: '前面添加列',
        type: 'Button',
        value: {
          set(props: EditorResult<Data>) {
            addColumnByPosition(props, 'before');
          }
        }
      },
      {
        title: '后面添加列',
        type: 'Button',
        value: {
          set(props: EditorResult<Data>) {
            addColumnByPosition(props, 'after');
          }
        }
      },
      {
        title: '前移',
        type: 'Button',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const [rowIndex, colIndex] = getColIndex(data, focusArea);
          return colIndex !== undefined && colIndex !== 0;
        },
        value: {
          set({ data, focusArea, slot }: EditorResult<Data>) {
            if (!focusArea) return;
            const [rowIndex, colIndex] = getColIndex(data, focusArea);
            if (colIndex < 1) return;
            const row = data.rows[rowIndex];
            const oldColumn = row.columns[colIndex];
            row.columns[colIndex] = row.columns[colIndex - 1];
            row.columns[colIndex - 1] = oldColumn;
            updateCol(row, slot)
          }
        }
      },
      {
        title: '后移',
        type: 'Button',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const [rowIndex, colIndex] = getColIndex(data, focusArea);
          return colIndex !== undefined && colIndex + 1 !== data.rows[rowIndex].columns.length;
        },
        value: {
          set({ data, focusArea, slot }: EditorResult<Data>) {
            if (!focusArea) return;
            const [rowIndex, colIndex] = getColIndex(data, focusArea);
            const row = data.rows[rowIndex];
            if (colIndex === row.columns.length - 1) return;
            const oldColumn = row.columns[colIndex];
            row.columns[colIndex] = row.columns[colIndex + 1];
            row.columns[colIndex + 1] = oldColumn;
            updateCol(row, slot)
          }
        }
      },
      {
        title: '拆分',
        type: 'Button',
        ifVisible(props: EditorResult<Data>) {
          return canSplit(props)
        },
        value: {
          set(props: EditorResult<Data>, val: string) {
            splitColumn(props)
          }
        }
      },
      // {
      //   title: '合并',
      //   type: 'Button',
      //   ifVisible(props: EditorResult<Data>) {
      //     return canMerge(props);
      //   },
      //   value: {
      //     set(props: EditorResult<Data>, val: string) {
      //       mergeCol(props)
      //     }
      //   }
      // },
      {
        title: '删除',
        type: 'Button',
        value: {
          set({ data, slot, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const [rowIndex, colIndex] = getColIndex(data, focusArea);
            slot.remove(item?.slot);
            data.rows[rowIndex].columns.splice(colIndex, 1);
            updateCol(data.rows[rowIndex], slot)
          }
        }
      }
    ]
  }
];

export default IndexEditor;
