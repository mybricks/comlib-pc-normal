import { Data } from '../../constants';
import { getEleIdx, setDelete, setExchange, updateIOSchema } from '../utils';

export const IndexEditor = [
  {
    title: '前移',
    type: 'Button',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      const idx1 = getEleIdx({ data, focusArea });
      return idx1 !== 0;
    },
    value: {
      set({ data, focusArea }: EditorResult<Data>) {
        setExchange({ data, focusArea }, 'up');
      }
    }
  },
  {
    title: '后移',
    type: 'Button',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      const idx1 = getEleIdx({ data, focusArea });
      return idx1 !== data.items.length - 1;
    },
    value: {
      set({ data, focusArea }: EditorResult<Data>) {
        setExchange({ data, focusArea }, 'down');
      }
    }
  },
  {
    title: '删除字段',
    type: 'Button',
    value: {
      set({ data, focusArea, input, output }: EditorResult<Data>) {
        if (!focusArea || data.items.length <= 1) return;
        setDelete({ data, focusArea });
        updateIOSchema({ data, input, output });
      }
    }
  }
];
