import { Data } from '../../../types';

export default {
  title: '输入框配置',
  ifVisible({ data, focusArea }: EditorResult<Data>) {
    if (!focusArea) return;
    const item = data.columns[focusArea.dataset.tableThIdx];
    return item.contentType === 'input';
  },
  items: [
    {
      title: '提示内容',
      type: 'Text',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = data.columns[focusArea.dataset.tableThIdx];
          return item.inputConfig ? item.inputConfig.placeholder : '';
        },
        set({ data, focusArea }, value) {
          if (!focusArea) return;
          const item = data.columns[focusArea.dataset.tableThIdx];
          item.inputConfig = item.inputConfig || {};
          item.inputConfig.placeholder = value;
        }
      }
    }
  ]
};
