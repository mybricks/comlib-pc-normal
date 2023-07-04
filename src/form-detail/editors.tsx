import { Data } from './constants';
import { BaseEditor } from './editors/baseEditor';
import { ItemsEditors } from './editors/item';
import {
  createStyleForItem,
  createStyleForLabel,
  createStyleForContent,
  createItem,
  updateIOSchema
} from './editors/utils';

export default {
  '@init': ({ data, input, output }: EditorResult<Data>) => {
    data.items.push(createItem({ data }));
    updateIOSchema({ data, input, output });
  },
  ':root': {
    items({}: EditorResult<Data>, cate1) {
      cate1.title = '常规';
      cate1.items = [...BaseEditor];
      return { title: '描述列表' };
    },
    style: [
      createStyleForItem({
        target: '.ant-descriptions .ant-descriptions-view .ant-descriptions-item'
      }),
      createStyleForLabel({
        target:
          '.ant-descriptions .ant-descriptions-view .ant-descriptions-item .ant-descriptions-item-label'
      }),
      createStyleForContent({
        target:
          '.ant-descriptions .ant-descriptions-view .ant-descriptions-item .ant-descriptions-item-content'
      })
    ]
  },
  ...ItemsEditors
};
