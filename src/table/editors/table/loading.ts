import { InputIds } from '../../constants';
import { Data } from '../../types';
import { Schemas } from '../../schema';

const LoadingEditor = [
  {
    title: '动态设置loading',
    description: '开启后，支持通过逻辑连线设置表格为loading状态',
    type: 'Switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.useLoading;
      },
      set({ data, input, output }: EditorResult<Data>, value: boolean) {
        const event1 = input.get(InputIds.END_LOADING);
        const event2 = input.get(InputIds.START_LOADING);

        if (value) {
          if (!event1) {
            input.add(InputIds.END_LOADING, '关闭loading', Schemas.Void);
            output.add(InputIds.END_LOADING, '关闭loading后', { type: 'any' });
            input.get(InputIds.END_LOADING).setRels([InputIds.END_LOADING]);
          }
          if (!event2) {
            input.add(InputIds.START_LOADING, '开启loading', Schemas.Void);
            output.add(InputIds.START_LOADING, '开启loading后', { type: 'any' });
            input.get(InputIds.START_LOADING).setRels([InputIds.START_LOADING]);
          }
        } else {
          if (event1) {
            input.remove(InputIds.END_LOADING);
            output.remove(InputIds.END_LOADING);
          }
          if (event2) {
            input.remove(InputIds.START_LOADING);
            output.remove(InputIds.START_LOADING);
          }
        }

        data.useLoading = value;
      }
    }
  },
  {
    title: '自定义loading文案',
    type: 'Text',
    description: 'loading文案',
    options: {
      placeholder: 'loading文案',
      locale: true,
    },
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
