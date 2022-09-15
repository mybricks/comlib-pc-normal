import { Data } from '../../constants';
import { getColItem } from '../utils';

const EventEditor = [
  {
    title: '点击',
    type: 'Switch',
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColItem(data, focusArea);
        return item?.useClick;
      },
      set({ data, focusArea, output }: EditorResult<Data>, value: boolean) {
        if (!focusArea) return;
        const item = getColItem(data, focusArea);
        if (value && !output.get(item.key)) {
          output.add(item.key, '列点击', { type: 'any' });
        }
        if (!value && output.get(item.key)) {
          output.remove(item.key);
        }
        item.useClick = value;
      }
    }
  },
  {
    title: '点击事件',
    type: '_Event',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      const item = getColItem(data, focusArea);
      return !!item?.useClick;
    },
    options({ data, focusArea }: EditorResult<Data>) {
      const item = getColItem(data, focusArea);
      return {
        outputId: item.key
      };
    }
  }
];

export default EventEditor;
