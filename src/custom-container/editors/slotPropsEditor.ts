import { Data, InputIds } from '../constants';

export const SlotPropsEditor = [
  {
    title: '插槽数据传入',
    type: 'Switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.useSlotProps;
      },
      set({ data, input }: EditorResult<Data>, value: boolean) {
        data.useSlotProps = value;
        const isHas = input.get(InputIds.SlotProps);
        if (value) {
          !isHas && input.add(InputIds.SlotProps, '插槽数据', { type: "any" });
        } else {
          isHas && input.remove(InputIds.SlotProps);
        }
      }
    }
  }
];
