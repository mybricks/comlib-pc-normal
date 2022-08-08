import { unitConversion } from '../../utils';
import { Data, InputIds } from '../constants';

export const MaxHeightEditor = [
  {
    title: '最大高度设置',
    items: [
      {
        title: '最大高度',
        type: 'text',
        description: '组件高度需设置为适应内容高度',
        options: {
          placeholder: '组件高度需设置为适应内容高度'
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.style?.maxHeight;
          },
          set({ data }: EditorResult<Data>, value: string) {
            if (!data.style) {
              data.style = {};
            }
            data.style.maxHeight = unitConversion(value) || '';
          }
        }
      },
      {
        title: '动态设置',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useSetMaxHeight;
          },
          set({ data, input }: EditorResult<Data>, value: boolean) {
            const hasEvent = input.get(InputIds.SetMaxHeight);
            if (value) {
              !hasEvent &&
                input.add(InputIds.SetMaxHeight, '设置最大高度', {
                  type: 'string'
                });
            } else {
              hasEvent && input.remove(InputIds.SetMaxHeight);
            }
            data.useSetMaxHeight = value;
          }
        }
      }
    ]
  }
];
