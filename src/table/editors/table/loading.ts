import { InputIds } from '../../constants';
import { Data } from '../../types';
import { Schemas } from '../../schema';

const LoadingEditor = [
  {
    title: '动态设置loading',
    type: 'Switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.useLoading;
      },
      set({ data, input }: EditorResult<Data>, value: boolean) {
        const event1 = input.get(InputIds.END_LOADING);
        const event2 = input.get(InputIds.START_LOADING);

        if (value) {
          !event1 && input.add(InputIds.END_LOADING, '关闭loading', Schemas.Void);
          !event2 && input.add(InputIds.START_LOADING, '开启loading', Schemas.Void);
        } else {
          event1 && input.remove(InputIds.END_LOADING);
          event2 && input.remove(InputIds.START_LOADING);
        }

        data.useLoading = value;
      }
    }
  },
  {
    title: '加载自定义文案',
    type: 'Text',
    description: '显示在loading图标下的文案',
    ifVisible({ data }) {
      return data.useLoading;
    },
    value: {
      get({ data }: EditorResult<Data>) {
        return data.loadingTip;
      },
      set({ data }: EditorResult<Data>, value: string) {
        data.loadingTip = value;
      }
    }
  }
];
export default LoadingEditor;
