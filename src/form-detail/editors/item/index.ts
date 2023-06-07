import { Data } from '../../constants';
import { StyleEditor } from './styleEditor';
import { BaseEditor } from './baseEditor';
import { IndexEditor } from './indexEditor';
import { getEleIdx, getSpanCount, setNextSpan } from '../utils';

const itemKey = '.ant-descriptions-item';
export const ItemsEditors = {
  [itemKey]: {
    title: '描述项',
    style: [
      {
        title: '标签',
        options: ['font'],
        target({ focusArea, data }) {
          return `.${data.items[getEleIdx({ data, focusArea })].id}-label`
        }
      },
      {
        title: '内容',
        options: ['font'],
        target({ focusArea, data }){
          return `.${data.items[getEleIdx({ data, focusArea })].id}-content`
        }
      },
      ...StyleEditor
    ],
    items: ({ }: EditorResult<Data>, cate1) => {
      cate1.title = '常规';
      cate1.items = [...BaseEditor, ...IndexEditor];
    }
  }
};
