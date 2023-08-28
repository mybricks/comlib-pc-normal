import { Data } from '../types';
import { createStyleForDefault } from './util';
export default {
  '[data-item-tag="append"]': {
    title: '新增按钮',
    items({}: EditorResult<Data>, cate1) {
      cate1.title = '常规';
      cate1.items = [
        {
          title: '内容',
          type: 'text',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.appendBtn.text;
            },
            set({ data }: EditorResult<Data>, val: string) {
              data.appendBtn.text = val;
            }
          }
        },
        {
          title: '图标',
          type: 'icon',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.appendBtn.icon;
            },
            set({ data }: EditorResult<Data>, val: string) {
              data.appendBtn.icon = val;
            }
          }
        }
      ];
    },
    style: createStyleForDefault({
      target: 'div[data-root="root"] span[data-item-tag="append"]'
    })
  }
};
