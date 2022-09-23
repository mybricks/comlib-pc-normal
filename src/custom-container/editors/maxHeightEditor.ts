import { unitConversion } from '../../utils';
import { Data } from '../constants';

export const MaxHeightEditor = [
  {
    title: '最大/最小宽高设置',
    items: [
      {
        title: '最小宽度',
        type: 'text',
        description: '组件宽度需设置为适应内容/最大可能的宽度',
        options: {
          placeholder: '组件最小宽度，例如：100px/100%/calc(100px)'
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.style?.minWidth;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.style.minWidth = unitConversion(value) || '';
          }
        }
      },
      {
        title: '最小高度',
        type: 'text',
        description: '组件高度需设置为适应内容/最大可能的高度',
        options: {
          placeholder: '组件最小高度，例如：100px/100%/calc(100px)'
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.style?.minHeight;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.style.minHeight = unitConversion(value) || '';
          }
        }
      },
      {
        title: '最大宽度',
        type: 'text',
        description: '组件宽度需设置为适应内容/最大可能的宽度',
        options: {
          placeholder: '组件最大宽度，例如：100px/100%/calc(100px)'
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.style?.maxWidth;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.style.maxWidth = unitConversion(value) || '';
          }
        }
      },
      {
        title: '最大高度',
        type: 'text',
        description: '组件高度需设置为适应内容/最大可能的高度',
        options: {
          placeholder: '组件最大高度，例如：100px/100%/calc(100px)'
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.style?.maxHeight;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.style.maxHeight = unitConversion(value) || '';
          }
        }
      }
    ]
  }
];
