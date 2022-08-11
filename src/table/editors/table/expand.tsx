import { InputIds, SlotIds } from '../../constants';
import { Schemas } from '../../schema';
import { Data } from '../../types';

const expandEditor = [
  {
    title: '表格行展开',
    type: 'switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.useExpand;
      },
      set({ data, slot, input }: EditorResult<Data>, value: boolean) {
        if (value) {
          slot.add(SlotIds.EXPAND_CONTENT, `展开内容`);
          input.add(InputIds.SET_EXPANDED_KEYS, '行展开状态', { title: '行数据/行标识', ...Schemas.Object });
        } else {
          slot.remove(SlotIds.EXPAND_CONTENT);
          input.remove(InputIds.SET_EXPANDED_KEYS);
        }
        data.useExpand = value;
      }
    }
  },
  {
    title: '获取插槽数据',
    type: 'switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.useSlotProps;
      },
      set({ data, input }: EditorResult<Data>, value: boolean) {
        const hasEvent = input.get(InputIds.SLOT_PROPS);
        if (value) {
          !hasEvent &&
            input.add(
              InputIds.SLOT_PROPS,
              `插槽数据`,
              Schemas.SLOT_PROPS(data)
            );
        } else {
          hasEvent && input.remove(InputIds.SLOT_PROPS);
        }
        data.useSlotProps = value;
      }
    }
  }
];

export { expandEditor };
