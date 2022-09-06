import { Data } from '../constants';
import { unitConversion } from '../../utils';

export const StyleEditor = [
  {
    title: '激活样式',
    type: 'Switch',
    value: {
      get: ({ data }: EditorResult<Data>) => {
        return data.useHoverStyle;
      },
      set: ({ data }: EditorResult<Data>, value: boolean) => {
        data.useHoverStyle = value;
      }
    }
  },
  {
    title: '默认样式',
    type: 'style',
    options: {
      plugins: ['padding', 'border', 'bgcolor', 'bgimage']
    },
    ifVisible({ data }: EditorResult<Data>) {
      return !data.useHoverStyle;
    },
    value: {
      get: ({ data }: EditorResult<Data>) => {
        return data.style;
      },
      set: ({ data }: EditorResult<Data>, value) => {
        data.style = value;
      }
    }
  },
  {
    title: '样式',
    ifVisible({ data }: EditorResult<Data>) {
      return data.useHoverStyle;
    },
    catelogChange: {
      value: {
        get({ data }: EditorResult<Data>) {
          return data.styleCatelog;
        },
        set({ data, catelog }: EditorResult<Data>) {
          data.styleCatelog = catelog;
        }
      }
    },
    items: [
      {
        type: 'style',
        catelog: '默认样式',
        options: {
          plugins: ['padding', 'border', 'bgcolor', 'bgimage']
        },
        value: {
          get: ({ data }: EditorResult<Data>) => {
            return data.style;
          },
          set: ({ data }: EditorResult<Data>, value) => {
            data.style = value;
          }
        }
      },
      {
        type: 'style',
        catelog: '激活样式',
        options: {
          plugins: ['border', 'bgcolor']
        },
        value: {
          get: ({ data }: EditorResult<Data>) => {
            return data.hoverStyle;
          },
          set: ({ data }: EditorResult<Data>, value) => {
            data.hoverStyle = value;
          }
        }
      }
    ]
  },
];
