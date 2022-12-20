import { Data } from './types';
import { uuid } from '../utils';

interface Result {
  data: Data;
  style?: any;
}

let tempOptions = [],
  addOption,
  delOption;

//设置初始的options
const initParams = (data: Data) => {
  tempOptions = data.options || [];
  addOption = (option) => {
    if (!data.options) data.options = [];
    data.options.push(option);
  };
  delOption = (index: number) => {
    data.options.splice(index, 1);
  };
};

export default {
  '@init': ({ data, style }: Result) => {
    style.width = '100%';
  },
  '@resize': {
    options: ['width']
  },
  ':root'({ data }: EditorResult<Data>, ...cate) {
    cate[0].title = '常规';
    cate[0].items = [
      {
        title: '自定义',
        type: 'Switch',
        description: '开启自定义后, 可自定义添加需要组件',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.isCustom;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.isCustom = value;
          }
        }
      },
      //选项弹出位置
      {
        title: '弹出位置',
        type: 'Select',
        description: '选项弹出位置',
        options: [
          { label: '左下方', value: 'bottomLeft' },
          { label: '中下方', value: 'bottomCenter' },
          { label: '右下方', value: 'bottomRight' },
          { label: '左上方', value: 'topLeft' },
          { label: '中上方', value: 'topCenter' },
          { label: '右上方', value: 'topRight' }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.placement;
          },
          set(
            { data }: EditorResult<Data>,
            value:
              | 'bottomLeft'
              | 'bottomCenter'
              | 'bottomRight'
              | 'topLeft'
              | 'topCenter'
              | 'topCenter'
          ) {
            data.placement = value;
          }
        }
      },
      {
        title: '宽度',
        type: 'text',
        description: '搜索框宽度,支持百分比和定宽',
        value: {
          get({ data }: EditorResult<Data>) {
            return String(data.width);
          },
          set({ data }: EditorResult<Data>, value: string) {
            if (/^\d+$/.test(value)) {
              data.width = `${value}px`;
            } else {
              data.width = value;
            }
          }
        }
      },
      //选项的配置
      {
        title: '选项配置',
        type: 'array',
        description: '选项配置跳转链接，可不填',
        options: {
          getTitle: ({ label }) => {
            return label;
          },
          onRemove: (index: number) => {
            delOption(index);
          },
          onAdd: () => {
            const defaultOption = {
              label: `选项${tempOptions.length + 1}`,
              value: uuid()
            };
            addOption(defaultOption);
            return defaultOption;
          },
          items: [
            {
              title: '选项标签',
              type: 'textarea',
              value: 'label'
            },
            {
              title: '跳转链接(可选)',
              type: 'textarea',
              description: '下拉菜单中选项可跳转链接，可不填',
              value: 'value'
            },
            {
              title: '禁用',
              type: 'switch',
              value: 'disabled'
            }
          ]
        },
        value: {
          get({ data }: EditorResult<Data>) {
            //得到一开始设置的option
            initParams(data);
            return data.options;
          },
          set({ data }: EditorResult<Data>, options) {
            // 更新选项
            options = options.map((option) => {
              return {
                ...option
                //checked: option.value === data.value
              };
            });
            data.options = options;
            tempOptions = options;
          }
        }
      },
      {
        title: '选项改变',
        type: '_Event',
        options: () => {
          return {
            outputId: 'onChange'
          };
        }
      }
    ];
  }
};
