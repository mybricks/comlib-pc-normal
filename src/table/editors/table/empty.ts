import { Data } from '../../types';

export const emptyEditor = [
  {
    title: '自定义空状态图片',
    type: 'switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.isImage;
      },
      set({ data }: EditorResult<Data>, value: boolean) {
        data.isImage = value;
      }
    }
  },
  {
    title: '图片地址',
    type: 'ImageSelector',
    ifVisible({ data }: EditorResult<Data>) {
      return !!data.isImage;
    },
    value: {
      get({ data }: EditorResult<Data>) {
        return data.image;
      },
      set({ data }: EditorResult<Data>, value: string) {
        data.image = value;
      }
    }
  },
  {
    title: '空状态文案',
    type: 'Text',
    description: '自定义描述内容',
    options: {
      placeholder: '自定义描述内容'
    },
    value: {
      get({ data }: EditorResult<Data>) {
        return data.description;
      },
      set({ data }: EditorResult<Data>, value: string) {
        data.description = value;
      }
    }
  }
];

export const emptyStyleEditor = {
  items:[
    {
      title: '空状态图片',
      options: ['size','border', { type: 'background', config: { disableBackgroundImage: true } }],
      target: ['.ant-empty-image > svg', '.ant-empty-image > img']
    },
    {
      title: '空状态文案',
      options: ['font'],
      target: [`.ant-empty-description`]
    }
  ]
};