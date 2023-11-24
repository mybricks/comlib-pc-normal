import { Data } from '../../types';

export const emptyEditor = [
  {
    title: '自定义空白状态',
    type: 'switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.isEmpty || false;
      },
      set({ data }: EditorResult<Data>, value: boolean) {
        data.isEmpty = value;
      }
    }
  },
  {
    title: '图片地址',
    type: 'ImageSelector',
    ifVisible({ data }: EditorResult<Data>) {
      return !!data.isEmpty;
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
      placeholder: '自定义描述内容',
      locale: true
    },
    ifVisible({ data }: EditorResult<Data>) {
      return !!data.isEmpty;
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
  items: [
    {
      title: '空状态图片',
      options: ['size', 'border', { type: 'background', config: { disableBackgroundImage: true } }],
      target: ['.ant-empty-image > svg', '.emptyImage']
    },
    {
      title: '空状态文案',
      options: ['font'],
      target: [`.ant-empty-description`, '.emptyDescription']
    }
  ]
};