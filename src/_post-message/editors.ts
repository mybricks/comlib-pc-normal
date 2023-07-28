import { Data } from './runtime';

export default {
  ':root': [
    {
      title: '页面目标',
      type: 'select',
      description: '向子页面或者父页面传递数据',
      options: [
        {
          label: '子页面',
          value: 'subPage'
        },
        {
          label: '父页面',
          value: 'parentPage'
        }
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.goal || 'subPage';
        },
        set({ data }: EditorResult<Data>, val: 'subPage' | 'parentPage') {
          data.goal = val;
        }
      }
    },
    {
      title: '子页面id',
      type: 'text',
      description: 'iframe页面的id',
      ifVisible({ data }: EditorResult<Data>) {
        return data.goal !== 'parentPage';
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.iframeId;
        },
        set({ data }: EditorResult<Data>, val: string) {
          data.iframeId  = val;
        }
      }
    }
  ]
};