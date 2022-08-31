import { SlotIds } from '../../constants';
import { Data } from '../../types';

const expandEditor = [
  {
    title: '表格行展开',
    type: 'switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.useExpand;
      },
      set({ data, slot }: EditorResult<Data>, value: boolean) {
        if (value) {
          slot.add(SlotIds.EXPAND_CONTENT, `展开内容`);
        } else {
          slot.remove(SlotIds.EXPAND_CONTENT);
        }
        data.useExpand = value;
      }
    }
  }
];

export { expandEditor };
