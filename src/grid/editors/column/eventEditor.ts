import { Data } from '../../constants';

const EventEditor = (item) => [
  {
    title: '点击',
    type: 'Switch',
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        return item?.useClick;
      },
      set({ data, focusArea, output }: EditorResult<Data>, value: boolean) {
        if (!focusArea) return;
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
      return !!item?.useClick;
    },
    options({ data, focusArea }: EditorResult<Data>) {
      return {
        outputId: item.key
      };
    }
  }
];

export default EventEditor;
