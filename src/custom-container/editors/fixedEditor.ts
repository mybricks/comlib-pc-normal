import { Data } from '../constants';

export const FixedEditor = [
  {
    title: '固定',
    type: 'Switch',
    description: '在自由布局条件下需要固定时开启',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.useFixed;
      },
      set({ data }: EditorResult<Data>, value: boolean) {
        data.useFixed = value;
      }
    }
  }
];
