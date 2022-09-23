import { Data } from '../../types';

const toolAreaEditor = {
  title: '操作区配置',
  items: [
    {
      title: '列设置按钮',
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
