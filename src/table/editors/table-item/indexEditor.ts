import { setDataSchema } from '../../schema';
import { Data } from '../../types';

function removeActionBtns(actionBtns, output) {
  actionBtns.forEach((item) => {
    output.remove(item.id);
  });
}
const IndexEditor = [
  {
    title: '前移',
    type: 'Button',
    ifVisible({ focusArea }: EditorResult<Data>) {
      return focusArea && focusArea.dataset.tableThIdx !== 0;
    },
    value: {
      set({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const index = +focusArea.dataset.tableThIdx;
        // const { index } = focusArea; //获取当前选项对象在数组里面的索引。
        if (index < 1) return;
        const options = [...data.columns];
        const tempOption = options[index - 1]; //存储前一个
        options[index - 1] = options[index];
        options[index] = tempOption;
        data.columns = [...options];
      }
    }
  },
  {
    title: '后移',
    type: 'Button',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      return focusArea && focusArea.dataset.tableThIdx + 1 !== data.columns.length;
    },
    value: {
      set({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const index = +focusArea.dataset.tableThIdx;
        // const { index } = focusArea; //获取当前选项对象在数组里面的索引。
        if (index === data.columns.length - 1) return; // -1 无操作  -2 有操作
        const options = [...data.columns];
        const tempOption = options[index + 1]; //存储后一个
        options[index + 1] = options[index];
        options[index] = tempOption;
        data.columns = [...options];
      }
    }
  },
  {
    title: '删除',
    type: 'Button',
    value: {
      set({ data, focusArea, output, input }: EditorResult<Data>) {
        if (!focusArea) return;
        const index = +focusArea.dataset.tableThIdx;
        // const { index } = focusArea;
        const item = data.columns[index];
        if (item.actionBtns && item.actionBtns.length !== 0) {
          removeActionBtns(item.actionBtns, output);
          data.columns.splice(index, 1);
        } else {
          data.columns.splice(index, 1);
        }
        setDataSchema({ data, output, input });
      }
    }
  }
];

export default IndexEditor;
