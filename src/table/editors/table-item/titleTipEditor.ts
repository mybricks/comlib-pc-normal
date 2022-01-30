import { Data } from '../../types';

const TitleTipEditor = {
  title: '提示配置',
  items: [
    {
      title: '显示提示',
      type: 'Switch',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          return data.columns[focusArea.dataset.tableThIdx].hasTip;
        },
        set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          if (!focusArea) return;
          data.columns[focusArea.dataset.tableThIdx].hasTip = value;
        }
      }
    },
    {
      title: '提示文案',
      type: 'Textarea',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        return data.columns[focusArea.dataset.tableThIdx].hasTip;
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          return data.columns[focusArea.dataset.tableThIdx].tip;
        },
        set({ data, focusArea }: EditorResult<Data>, value: string) {
          if (!focusArea) return;
          data.columns[focusArea.dataset.tableThIdx].tip = value;
        }
      }
    }
  ]
};

export default TitleTipEditor;
