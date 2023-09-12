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
import { getFilterSelector } from '../utils/cssSelector';

export default {
  '@init': ({ data, input, output }: EditorResult<Data>) => {
    data.items.push(createItem({ data }));
    updateIOSchema({ data, input, output });
  },
  '@resize': {
    options: ['width']
  },
  ':root': {
    items({}: EditorResult<Data>, cate1) {
      cate1.title = '常规';
      cate1.items = [...BaseEditor];
      return { title: '描述列表' };
    },
    style: [
      createStyleForItem({
        target: ({ id }: EditorResult<Data>) =>
          `.ant-descriptions .ant-descriptions-view .ant-descriptions-item${getFilterSelector(id)}`
      }),
      createStyleForLabel({
        target: ({ id }: EditorResult<Data>) =>
          `.ant-descriptions .ant-descriptions-view .ant-descriptions-item .ant-descriptions-item-label${getFilterSelector(
            id
          )}`
      }),
      createStyleForContent({
        target: ({ id }: EditorResult<Data>) =>
          `.ant-descriptions .ant-descriptions-view .ant-descriptions-item .ant-descriptions-item-content${getFilterSelector(
            id
          )}`
      })
    ]
  },
  ...ItemsEditors
};
