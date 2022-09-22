import { SlotIds } from '../../constants';
import { Data } from '../../types';

const headerEditor = {
  title: '头部设置',
  items: [
    {
      title: '标题区插槽',
      description: '开启后，支持在表格左上角自定义内容',
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
      description: '开启后，支持在表格右上角自定义内容',
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
    },
    {
      title: '列设置按钮',
      description: '开启后，支持在表格右上角显示列设置按钮，用于调整展示列',
      type: 'Switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.useColumnSetting;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.useColumnSetting = value;
        }
      }
    }
  ]
};

export default headerEditor;
