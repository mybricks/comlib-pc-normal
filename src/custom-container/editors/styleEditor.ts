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
  {
    title: '最小宽度',
    type: 'text',
    description: '组件宽度需设置为适应内容/最大可能的宽度',
    options: {
      placeholder: '组件最小宽度，例如：100px'
    },
    value: {
      get({ data }: EditorResult<Data>) {
        return data.style?.minWidth;
      },
      set({ data }: EditorResult<Data>, value: string) {
        if (!data.style) {
          data.style = {};
        }
        data.style.minWidth = unitConversion(value) || '';
      }
    }
  },
  {
    title: '最小高度',
    type: 'text',
    description: '组件高度需设置为适应内容/最大可能的高度',
    options: {
      placeholder: '组件最小高度，例如：100px'
    },
    value: {
      get({ data }: EditorResult<Data>) {
        return data.style?.minHeight;
      },
      set({ data }: EditorResult<Data>, value: string) {
        if (!data.style) {
          data.style = {};
        }
        data.style.minHeight = unitConversion(value) || '';
      }
    }
  }
];
