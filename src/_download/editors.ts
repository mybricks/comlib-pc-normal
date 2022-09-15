import { Data } from './constants';

const setSchema = (input, status) => {
  if (status === 0) {
    input?.get('url').setSchema({
      title: '输入数据',
      type: 'string'
    });
  }
  if (status === 1) {
    input.get('url').setSchema({
      title: '输入数据',
      type: 'object',
      properties: {
        url: {
          title: '资源链接',
          type: 'string'
        },
        filename: {
          title: '资源文件名',
          type: 'string'
        }
      }
    });
  }
};

export default {
  ':root': [
    {
      title: '文件名配置',
      type: 'select',
      options: [
        {
          key: 0,
          label: '手动配置',
          value: 0
        },
        {
          key: 1,
          label: '动态配置',
          value: 1
        }
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.nameConfig;
        },
        set({ data, input }: EditorResult<Data>, val: 0 | 1) {
          setSchema(input, val);
          data.nameConfig = val;
        }
      }
    },
    {
      title: '名称',
      type: 'text',
      ifVisible({ data }: EditorResult<Data>) {
        return data.nameConfig === 0;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.filename;
        },
        set({ data }: EditorResult<Data>, filename: string) {
          data.filename = filename;
        }
      }
    }
  ]
};
