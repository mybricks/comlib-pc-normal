import { Data } from '../../constants';
import { StyleEditor } from './styleEditor';
import { BaseEditor } from './baseEditor';
import { IndexEditor } from './indexEditor';
import {
  getEleIdx,
  getSpanCount,
  setNextSpan,
  createStyleForItem,
  createStyleForLabel,
  createStyleForContent
} from '../utils';

const itemKey = '.ant-descriptions-item';
export const ItemsEditors = {
  [itemKey]: {
    title: '描述项',
    style: [
      createStyleForItem({
        target({ focusArea, data }) {
          return `.${data.items[getEleIdx({ data, focusArea })].id}-item`;
        }
      }),
      createStyleForLabel({
        target({ focusArea, data }) {
          const selector = `.${
            data.items[getEleIdx({ data, focusArea })].id
          }-item .ant-descriptions-item-label`;
          return selector;
        }
      }),
      createStyleForContent({
        target({ focusArea, data }) {
          const selector = `.${
            data.items[getEleIdx({ data, focusArea })].id
          }-item .ant-descriptions-item-content`;
          return selector;
        }
      })
    ],
    items: ({}: EditorResult<Data>, cate1) => {
      cate1.title = '常规';
      cate1.items = [...BaseEditor, ...StyleEditor, ...IndexEditor];
    }
  }
};
