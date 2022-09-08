import { Data } from '../../types';
import { getBtnItemInfo } from '../../utils';
import { InputIds } from '../../constants';

const IndexEditor = [
  {
    title: '前移',
    type: 'Button',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      const { index } = getBtnItemInfo(data, focusArea);
      return focusArea && index !== undefined && index !== 0;
    },
    value: {
      set({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const { index } = getBtnItemInfo(data, focusArea);
        if (index < 1) return;
        const tempOption = data.btnList[index - 1];
        data.btnList[index - 1] = data.btnList[index];
        data.btnList[index] = tempOption;
      }
    }
  },
  {
    title: '后移',
    type: 'Button',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      const { index } = getBtnItemInfo(data, focusArea);
      return index !== undefined && index + 1 !== data.btnList.length;
    },
    value: {
      set({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const { index } = getBtnItemInfo(data, focusArea);
        if (index === data.btnList.length - 1) return;
        const tempOption = data.btnList[index + 1];
        data.btnList[index + 1] = data.btnList[index];
        data.btnList[index] = tempOption;
      }
    }
  },
  {
    title: '删除',
    type: 'Button',
    value: {
      set({ data, output, input, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const { item, index } = getBtnItemInfo(data, focusArea);
        output.remove(item.key);
        input.remove(`${InputIds.SetOutputVal}_${item.key}`);
        input.remove(`${InputIds.SetDisable}_${item.key}`);
        input.remove(`${InputIds.SetEnable}_${item.key}`);
        input.remove(`${InputIds.SetHidden}_${item.key}`);
        input.remove(`${InputIds.SetVisible}_${item.key}`);
        data.btnList.splice(index, 1);
      }
    }
  }
];

export default IndexEditor;
