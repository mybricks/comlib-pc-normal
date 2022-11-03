import { Data } from '../constants';

const getTitleItemIdx = ({ data, focusArea }: { data: Data; focusArea: any }) => {
  const dataset = 'menuTitleItem';
  const key = focusArea.dataset[dataset];
  const slotItem = data.slotList.findIndex((slot) => slot.key === key);
  return slotItem;
};

const IndexEditor = [
  {
    title: '前移',
    type: 'Button',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      const index = getTitleItemIdx({ data, focusArea });
      return focusArea && index !== undefined && index !== 0;
    },
    value: {
      set({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const index = getTitleItemIdx({ data, focusArea });
        if (index < 1) return;
        const tempOption = data.slotList[index - 1];
        data.slotList[index - 1] = data.slotList[index];
        data.slotList[index] = tempOption;
      }
    }
  },
  {
    title: '后移',
    type: 'Button',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      const index = getTitleItemIdx({ data, focusArea });
      return index !== undefined && index + 1 !== data.slotList.length;
    },
    value: {
      set({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const index = getTitleItemIdx({ data, focusArea });
        if (index === data.slotList.length - 1) return;
        const tempOption = data.slotList[index + 1];
        data.slotList[index + 1] = data.slotList[index];
        data.slotList[index] = tempOption;
      }
    }
  },
  {
    title: '删除',
    type: 'Button',
    value: {
      set({ data, output, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const index = getTitleItemIdx({ data, focusArea });
        const item = data.slotList[index];
        output.remove(item.slotId);
        data.slotList.splice(index, 1);
      }
    }
  }
];

export default IndexEditor;
