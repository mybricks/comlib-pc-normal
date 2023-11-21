import { uuid } from '../utils';
import { Data, Children } from './runtime';

interface Result {
  data: Data;
  input: any;
  output: any;
  focusArea: any;
}

const defaultItems = [
  {
    content: '标题1',
    fieldName: 'text',
    order: 'disorder'
  }
];

const addItem = (data) => {
  defaultItems.forEach((item) => {
    const key = uuid();
    data.children.push({
      ...item,
      key
    });
  });
};

function findConfig(
  { data, focusArea }: { data: Data; focusArea: any },
  configName: string | { (arg0: Children): void }
) {
  if (!focusArea) return;
  const key = focusArea.dataset['sort'];
  const index = data.children.findIndex((item) => item.key === key);
  if (index === -1) return;
  if (typeof configName === 'string') {
    return data.children[index][configName];
  } else if (typeof configName === 'function') {
    configName(data.children[index]);
  }
}

export default {
  '@init': ({ data }) => {
    if (!data.children.length) {
      addItem(data);
    }
  },
  ':root': [
    {
      title: '添加',
      type: 'Button',
      value: {
        set({ data }: Result) {
          const key = uuid();
          const content = `标题${data.children.length + 1}`;
          const fieldName = uuid();
          const order = 'disorder';

          data.children.push({
            key,
            content,
            fieldName,
            order
          });
        }
      }
    },
    {
      title: '事件',
      items: [
        {
          title: '主动输出',
          type: 'Switch',
          description: '开启后,不点击便会主动输出组件参数',
          value: {
            get({ data }: Result) {
              return data.isSettingsSubmit;
            },
            set({ data }: Result, value: boolean) {
              data.isSettingsSubmit = value;
            }
          }
        },
        {
          title: '点击排序',
          type: '_Event',
          options: () => {
            return {
              outputId: 'settingsSubmit'
            };
          }
        }
      ]
    }
  ],
  '[data-sort]': {
    title: '子项操作',
    items: [
      {
        title: '标题',
        type: 'Text',
        options: {
          locale: true
        },
        value: {
          get({ data, focusArea }: Result) {
            return findConfig({ data, focusArea }, 'content');
          },
          set({ data, focusArea }: Result, value: string) {
            findConfig({ data, focusArea }, (config) => {
              config.content = value;
            });
          }
        }
      },
      {
        title: '字段名',
        type: 'Text',
        value: {
          get({ data, focusArea }) {
            return findConfig({ data, focusArea }, 'fieldName');
          },
          set({ data, focusArea }, value) {
            findConfig({ data, focusArea }, (config) => {
              config.fieldName = value;
            });
          }
        }
      },
      {
        title: '删除',
        type: 'Button',
        value: {
          set({ data, focusArea, output }: Result) {
            data.children = data.children.filter((i) => i.key !== focusArea.dataset['sort']);
            output.remove(focusArea.dataset?.sort);
          }
        }
      }
    ]
  }
};
