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
      set({ data, slot }: EditorResult<Data>, value: boolean) {
        if (value) {
          slot.add(SlotIds.EXPAND_CONTENT, `展开内容`);
        } else {
          slot.remove(SlotIds.EXPAND_CONTENT);
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
