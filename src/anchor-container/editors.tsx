import { Data, InputIds, OutputIds } from './constants';

export default {
  '@inputConnected'({ data, input, output, slots }, fromPin, toPin) {
    if (toPin.id === InputIds.DATA_SOURCE) {
      let itemSchema = {};
      if (fromPin.schema.type === 'array') {
        itemSchema = fromPin.schema.items;
        input.get('dataSource').setSchema(fromPin.schema);
        slots.get('item').inputs.get('itemData').setSchema(itemSchema);
      }
    }
  },
  '@resize': {
    options: ['width']
  },
  ':root': ({ }: EditorResult<Data>, cate1) => {
    cate1.title = '高级';
    // cate1.items = [
    //   {
    //     title: 'loading',
    //     type: 'Switch',
    //     value: {
    //       get({ data }: EditorResult<Data>) {
    //         return data.useLoading;
    //       },
    //       set({ data, input, output }: EditorResult<Data>, val: boolean) {
    //         data.useLoading = val;
    //         if (val) {
    //           !input.get(InputIds.LOADING) &&
    //             input.add(InputIds.LOADING, '设置loading', { type: 'boolean' });
    //           !output.get('setLoadingDone') &&
    //             output.add('setLoadingDone', '设置loading完成', { type: 'boolean' });
    //           input.get(InputIds.LOADING).setRels(['setLoadingDone']);
    //         } else {
    //           input.get(InputIds.LOADING) && input.remove(InputIds.LOADING);
    //           output.get('setLoadingDone') && output.remove('setLoadingDone');
    //         }
    //       }
    //     }
    //   },
    //   {
    //     title: '加载中文案',
    //     type: 'text',
    //     ifVisible({ data }: EditorResult<Data>) {
    //       return data.useLoading;
    //     },
    //     value: {
    //       get({ data }: EditorResult<Data>) {
    //         return data.loadingTip;
    //       },
    //       set({ data }: EditorResult<Data>, val: string) {
    //         data.loadingTip = val;
    //       }
    //     }
    //   }
    // ];
  }
};
