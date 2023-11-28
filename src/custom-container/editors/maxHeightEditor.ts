import { unitConversion } from '../../utils';
import { Data } from '../constants';

export const MaxHeightEditor = {
  title: '最大/最小宽高设置',
  items: [
    {
      title: '最小宽度',
      type: 'text',
      description: '组件宽度需设置为适应内容/最大可能的宽度',
      options: {
        placeholder: '组件最小宽度，例如：100px/100%/100vw/calc(100px)'
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.legacyStyle?.minWidth ?? 0;
        },
        set({ data }: EditorResult<Data>, value: string) {
          data.legacyStyle = {
            ...data.legacyStyle,
            minWidth: unitConversion(value) || ''
          }
        }
      }
    },
    {
      title: '最小高度',
      type: 'text',
      description: '组件高度需设置为适应内容/最大可能的高度',
      options: {
        placeholder: '组件最小高度，例如：100px/100%/100vh/calc(100px)'
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.legacyStyle?.minHeight ?? 0;
        },
        set({ data }: EditorResult<Data>, value: string) {
          data.legacyStyle = {
            ...data.legacyStyle,
            minHeight: unitConversion(value) || ''
          }
        }
      }
    },
    {
      title: '最大宽度',
      type: 'text',
      description: '组件宽度需设置为适应内容/最大可能的宽度',
      options: {
        placeholder: '组件最大宽度，例如：100px/100%/100vw/calc(100px)'
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.legacyStyle?.maxWidth ?? '100%';
        },
        set({ data }: EditorResult<Data>, value: string) {
          data.legacyStyle = {
            ...data.legacyStyle,
            maxWidth: unitConversion(value) || ''
          }
        }
      }
    },
    {
      title: '最大高度',
      type: 'text',
      description: '组件高度需设置为适应内容/最大可能的高度',
      options: {
        placeholder: '组件最大高度，例如：100px/100%/100vh/calc(100px)'
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.legacyStyle?.maxHeight ?? '100%';
        },
        set({ data }: EditorResult<Data>, value: string) {
          data.legacyStyle = {
            ...data.legacyStyle,
            maxHeight: unitConversion(value) || ''
          }
        }
      }
    }
  ]
};
