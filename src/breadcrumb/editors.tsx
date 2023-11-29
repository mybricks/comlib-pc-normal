import { uuid } from '../utils';
import { Data } from './constants';

const defaultItems = [
  {
    key: 'page-0',
    label: 'page-0',
    event: {}
  },
  {
    key: 'page-1',
    label: 'page-1',
    event: {}
  }
];

const addItem = ({ data, output }) => {
  defaultItems.forEach((item) => {
    const key = uuid();
    data.children.push({
      ...item,
      key
    });
    output.add(key, '点击事件', { type: 'any' });
  });
};
function findConfig({ data, focusArea }, propKey?: string) {
  if (!focusArea) return;
  const key = focusArea.dataset['breadcrumb'];
  const index = data.children.findIndex((item) => item.key === key);
  if (index === -1) return;
  if (typeof propKey === 'string') {
    return data.children[index][propKey];
  }
  return data.children[index];
}

export default {
  '@init': ({ data, output }) => {
    if (!data.children.length) {
      addItem({ data, output });
    }
  },
  ':root': [
    {
      title: '分割符',
      type: 'Select',
      description: '切分面包屑每一项的符号，可自定义设置',
      options: [
        { value: '/', label: '/' },
        { value: '>', label: '>' },
        { value: 'custom', label: '自定义' }
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.separator;
        },
        set({ data }: EditorResult<Data>, value: string) {
          data.separator = value;
        }
      }
    },
    {
      title: '自定义分割符',
      type: 'Text',
      ifVisible({ data }: EditorResult<Data>) {
        return data.separator === 'custom';
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.customSeparator;
        },
        set({ data }: EditorResult<Data>, value: string) {
          data.customSeparator = value;
        }
      }
    },
    {
      title: '内边距',
      type: 'Slider',
      options: [
        {
          min: 0,
          step: 5,
          formatter: 'px'
        }
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.padding;
        },
        set({ data }: EditorResult<Data>, value: number) {
          data.padding = value;
        }
      }
    },
    {
      title: '添加',
      type: 'Button',
      value: {
        set({ data, output }: EditorResult<Data>) {
          const key = uuid();
          const label = '面包屑';

          data.children.push({
            key,
            label,
            outputValue: '',
            event: {}
          });
          output.add(key, '面包屑点击', { type: 'string' });
        }
      }
    }
  ],
  '[data-breadcrumb]': {
    title: '面包屑操作',
    style: [
      {
        title: '文本',
        options: [
          {
            type: 'font',
            config: {
              disableTextAlign: true
            }
          }
        ],
        target({ data, focusArea }) {
          return `.${findConfig({ data, focusArea }).key}`;
        }
      }
    ],
    items: [
      {
        title: '名称',
        type: 'Text',
        options: {
          locale: true
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return findConfig({ data, focusArea }, 'label');
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            findConfig({ data, focusArea }).label = value;
          }
        }
      },
      {
        title: '事件',
        items: [
          {
            title: '点击',
            type: '_Event',
            options: ({ focusArea }: EditorResult<Data>) => {
              return {
                outputId: focusArea.dataset?.breadcrumb
              };
            }
          }
        ]
      },
      {
        title: '删除',
        type: 'Button',
        value: {
          set({ data, focusArea, output }: EditorResult<Data>) {
            data.children = data.children.filter((i) => i.key !== focusArea.dataset['breadcrumb']);
            output.remove(focusArea.dataset?.breadcrumb);
          }
        }
      }
    ]
  }
};
