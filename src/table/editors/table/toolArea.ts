import { Data } from '../../types';

const toolAreaEditor = {
  title: '工具区设置',
  items: [
    {
      title: '自定义列',
      type: 'switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.useColumnSetting;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.useColumnSetting = value;
        }
      }
    }
  ]
};

export default toolAreaEditor;