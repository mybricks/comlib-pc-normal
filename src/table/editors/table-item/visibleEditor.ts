import { setCol } from '../../schema';
import { Data } from '../../types';
import { getColumnItem } from '../../utils';

const VisibleEditor = {
  title: '显示隐藏配置',
  ifVisible({ data, focusArea }: EditorResult<Data>) {
    if (!focusArea) return;
    const item = getColumnItem(data, focusArea);
    return item.contentType !== 'group';
  },
  items: [
    {
      title: '显示',
      type: 'Switch',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          return item.visible;
        },
        set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          if (!focusArea) return;
          setCol(data, focusArea, value, 'visible');
        }
      }
    }
  ]
};

export default VisibleEditor;
