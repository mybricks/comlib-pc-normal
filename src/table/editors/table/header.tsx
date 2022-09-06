import { SlotIds } from '../../constants';
import { Data } from '../../types';

const headerEditor = {
  title: '头部设置',
  items: [
    {
      title: '标题区插槽',
      type: 'switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.useHeaderTitleSlot;
        },
        set({ data, slot }: EditorResult<Data>, value: boolean) {
          if (value) {
            slot.add(SlotIds.HEADER_TITLE, '标题区插槽');
          } else {
            slot.remove(SlotIds.HEADER_TITLE);
          }
          data.useHeaderTitleSlot = value;
        }
      }
    },
    {
      title: '操作区插槽',
      type: 'switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.useHeaderOperationSlot;
        },
        set({ data, slot }: EditorResult<Data>, value: boolean) {
          if (value) {
            slot.add(SlotIds.HEADER_OPERATION, '操作区插槽');
          } else {
            slot.remove(SlotIds.HEADER_OPERATION);
          }
          data.useHeaderOperationSlot = value;
        }
      }
    }
  ]
};

export default headerEditor;
