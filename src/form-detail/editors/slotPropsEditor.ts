import { Data } from '../constants';

export const SlotPropsEditor = [
  {
    title: '读取插槽参数',
    type: 'switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.useSlotProps !== false;
      },
      set({ data }: EditorResult<Data>, value: boolean) {
        data.useSlotProps = value;
      }
    }
  }
];
