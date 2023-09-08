import { SlotIds, OutputIds } from '../../constants';
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
        set({ data, slot, output }: EditorResult<Data>, value: boolean) {
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
        set({ data, output }: EditorResult<Data>, value: boolean) {
          if (value && !output.get(OutputIds.COLUMNS_CHANGE)) {
            output.add(OutputIds.COLUMNS_CHANGE, '列结构变化', {
              type: 'array'
            });
          }
          data.useColumnSetting = value;
        }
      }
    },
    {
      title: '列结构变化事件',
      type: '_Event',
      ifVisible({ data }: EditorResult<Data>) {
        return data.useColumnSetting;
      },
      options: () => {
        return {
          outputId: OutputIds.COLUMNS_CHANGE
        };
      }
    }
  ]
};

export default headerEditor;
