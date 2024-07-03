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
  createStyleForContent,
  updateIOSchema
} from '../utils';

const itemKey = '.ant-descriptions-item';
const itemLabelValue = {
  get({ data, focusArea }: EditorResult<Data>) {
    if (!focusArea) return;
    return data.items[getEleIdx({ data, focusArea })]?.label;
  },
  set({ data, focusArea, input, output, env }: EditorResult<Data>, value: string) {
    if (!focusArea) return;
    const item = data.items[getEleIdx({ data, focusArea })];
    item.label = value;
    const outputId = `${item.id}-suffixClick`;
    if (output.get(outputId)) {
      output.setTitle(outputId, `点击${env.i18n(item.label)}`);
    }
    updateIOSchema({ data, input, output });
  }
}
export const ItemsEditors = {
  '.ant-descriptions-item-label': {
    "@dblclick": {
      type: 'text',
      value: itemLabelValue,
      items: [{
        title: '标签名称',
        type: 'Text',
        options: {
          locale: true
        },
        value: itemLabelValue,
      }]
    },
  },
  '.ant-descriptions-item-content': {
    "@dblclick": {
      type: 'text',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          return data.items[getEleIdx({ data, focusArea })]?.value;
        },
        set({ data, focusArea }: EditorResult<Data>, value: string) {
          if (!focusArea) return;
          data.items[getEleIdx({ data, focusArea })].value = value;
        }
      },
    },
  },
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
          const selector = `.${data.items[getEleIdx({ data, focusArea })].id
            }-item .ant-descriptions-item-label`;
          return selector;
        }
      }),
      createStyleForContent({
        target({ focusArea, data }) {
          const selector = `.${data.items[getEleIdx({ data, focusArea })].id
            }-item .ant-descriptions-item-content`;
          return selector;
        }
      }),
      {
        title: '内容边距',
        options: ['margin'],
        target({ focusArea, data }) {
          return `.${data.items[getEleIdx({ data, focusArea })].id
            }-item .ant-descriptions-item-content .ant-typography p, div.ant-typography`
        }
      }
    ],
    items: ({ }: EditorResult<Data>, cate1) => {
      cate1.title = '常规';
      cate1.items = [...BaseEditor, ...StyleEditor, ...IndexEditor];
    }
  }
};
