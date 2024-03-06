import { uuid } from '../utils';
import { message, Result } from 'antd';
import { Data } from './runtime';
import { unitConversion } from '../utils';

interface Result {
  data: Data;
  input: any;
  output: any;
  focusArea?: any;
  style: any;
}

const addBtn = ({
  data,
  output,
  type = 'btn',
  input,
  text,
  btnType
}: {
  data: Data;
  output: any;
  input: any;
  type?: string;
  text?: string;
  btnType?: string;
}) => {
  const id = uuid();
  const title = text || '按钮';
  const schema = {
    type: type === 'btn' ? 'number' : 'follow'
  };
  const defaultBtn = {
    id,
    title,
    icon: '',
    outVal: 0,
    useIcon: false,
    showText: true,
    size: 'small',
    type: 'default',
    shape: '',
    dataType: 'number'
  };
  output.add(id, title, schema);
  data.tools.push({ ...defaultBtn, type: btnType || 'default', margin: [0, 0] });
};

const get = (data: Data, focusArea: any, dataset: string, val = 'obj', cb?: any) => {
  if (!focusArea) return;
  const key = focusArea.dataset[dataset];
  const index = data.tools.findIndex((def) => def.id === key);
  if (index === -1) return;
  if (cb) cb(index);
  if (val === 'obj') {
    return data.tools[index];
  }
  return data.tools[index][val];
};

const moveDelete = (dataset: string) => {
  return [
    {
      title: '前移',
      type: 'Button',
      ifVisible({ data, focusArea }: Result) {
        let bool = false;
        get(data, focusArea, dataset, 'obj', (index) => {
          if (data.tools.length > 1 && index !== 0) {
            bool = true;
          }
        });
        return bool;
      },
      value: {
        set({ data, focusArea }: Result) {
          get(data, focusArea, dataset, 'obj', (index) => {
            const tool = data.tools[index];
            data.tools.splice(index, 1);
            data.tools.splice(index - 1, 0, tool);
          });
        }
      }
    },
    {
      title: '后移',
      type: 'Button',
      ifVisible({ data, focusArea }: Result) {
        let bool = false;
        get(data, focusArea, dataset, 'obj', (index) => {
          if (data.tools.length > 1 && index !== data.tools.length - 1) {
            bool = true;
          }
        });
        return bool;
      },
      value: {
        set({ data, focusArea }: Result) {
          get(data, focusArea, dataset, 'obj', (index) => {
            const tool = data.tools[index];
            data.tools.splice(index, 1);
            data.tools.splice(index + 1, 0, tool);
          });
        }
      }
    },
    {
      title: '删除',
      type: 'Button',
      value: {
        set({ data, focusArea, output }: Result) {
          get(data, focusArea, dataset, 'obj', (index) => {
            output.remove(data.tools[index].id);
            data.tools.splice(index, 1);
          });
        }
      }
    }
  ];
};

export default {
  '@init': ({ data, output, input, style }: Result) => {
    style.position = 'fixed';
    style.left = 0;
    style.bottom = 0;
    style.height = 64;
    if (data.tools.length === 0) {
      addBtn({ data, output, input, text: '主按钮', btnType: 'primary' });
      addBtn({ data, output, input, text: '次按钮', btnType: 'default' });
    }
  },
  ':root': [
    {
      title: '对齐方式',
      type: 'Select',
      options: [
        {
          label: '居左',
          value: 'flex-start'
        },
        {
          label: '居中',
          value: 'center'
        },
        {
          label: '居右',
          value: 'flex-end'
        }
      ],
      value: {
        get({ data }: Result) {
          return data.layout;
        },
        set({ data }: Result, value: string) {
          data.layout = value;
        }
      }
    },
    {
      title: '高度',
      type: 'inputnumber',
      options: [{ min: 64, max: 200, width: 60 }],
      value: {
        get({ data, style }: Result) {
          style.height = data.height || 64;
          return [data.height || 64];
        },
        set({ data, style }: Result, value: number[]) {
          data.height = value[0];
          style.height = value[0];
        }
      }
    },
    {
      title: '宽度',
      type: 'Text',
      value: {
        get({ data }: Result) {
          return data.width || '100%';
        },
        set({ data, style }: Result, value: string) {
          // style.left = void 0
          data.width = unitConversion(value);
        }
      }
    },
    {
      title: '自定义挂载父节点',
      type: 'Text',
      description: '可填写想要挂载的父节点ID',
      value: {
        get({ data }: Result) {
          return data.parentId;
        },
        set({ data }, value: string) {
          data.parentId = value;
        }
      }
    },
    {
      title: '添加按钮',
      type: 'Button',
      description: '在工具栏中添加按钮，在逻辑视图中会增加一个对应的输出项目。',
      value: {
        set({ data, output, input }: Result) {
          addBtn({ data, output, input });
        }
      }
    }
  ],
  '[data-btn-id]': {
    title: '按钮',
    items: [
      {
        title: '名称',
        type: 'Text',
        options: {
          locale: true
        },
        value: {
          get({ data, focusArea }: Result) {
            return get(data, focusArea, 'btnId', 'title');
          },
          set({ data, focusArea, input, output, env }: Result, value: string) {
            if (typeof env.i18n(value) !== 'string' || env.i18n(value).trim() === '') {
              throw new Error('请输入正确的按钮标题');
            }
            const res = get(data, focusArea, 'btnId', 'obj', (index) => {
              output.setTitle(data.tools[index].id, value);
              input.setTitle(`display${data.tools[index].id}`, `显示${value}`);
              input.setTitle(`hidden${data.tools[index].id}`, `隐藏${value}`);
              input.setTitle(`disable${data.tools[index].id}`, `控制禁用${value}`);
            });
            res.title = value;
          }
        }
      },
      {
        title: '支持动态显示/隐藏',
        type: 'Switch',
        value: {
          get({ data, focusArea }: Result) {
            return get(data, focusArea, 'btnId', 'dynamicDisplay');
          },
          set({ data, focusArea, input, output }: Result, value: boolean) {
            const res = get(data, focusArea, 'btnId', 'obj', (index) => {
              // output.setTitle(data.tools[index].id, value);
              const schema = {
                type: 'follow'
              };
              if (value) {
                input.add(
                  `display${data.tools[index].id}`,
                  `显示${data.tools[index].title}`,
                  schema
                );
                input.add(
                  `hidden${data.tools[index].id}`,
                  `隐藏${data.tools[index].title}`,
                  schema
                );
              } else {
                input.remove(`display${data.tools[index].id}`);
                input.remove(`hidden${data.tools[index].id}`);
              }
            });
            res.dynamicDisplay = value;
          }
        }
      },
      {
        title: '支持动态控制禁用',
        type: 'Switch',
        value: {
          get({ data, focusArea }: Result) {
            return get(data, focusArea, 'btnId', 'dynamicDisabled');
          },
          set({ data, focusArea, input, output }: Result, value: boolean) {
            const res = get(data, focusArea, 'btnId', 'obj', (index) => {
              // output.setTitle(data.tools[index].id, value);
              const schema = {
                type: 'any'
              };
              if (value) {
                input.add(
                  `disable${data.tools[index].id}`,
                  `控制禁用${data.tools[index].title}`,
                  schema
                );
              } else {
                input.remove(`disable${data.tools[index].id}`);
              }
            });
            res.dynamicDisabled = value;
          }
        }
      },
      {
        title: '基础样式',
        items: [
          {
            title: '风格',
            type: 'Select',
            options: [
              { label: '默认', value: 'default' },
              { label: '主按钮', value: 'primary' },
              { label: '虚线按钮', value: 'dashed' },
              { label: '危险按钮', value: 'danger' },
              { label: '链接按钮', value: 'link' },
              { label: '文字按钮', value: 'text' }
            ],
            value: {
              get({ data, focusArea }: Result) {
                return get(data, focusArea, 'btnId', 'type');
              },
              set({ data, focusArea }: Result, value: string) {
                const res = get(data, focusArea, 'btnId', 'obj');
                res.type = value;
              }
            }
          },
          {
            title: '尺寸',
            description: '全局设置表单项尺寸, 默认是中(middle)',
            type: 'Select',
            options: [
              {
                label: '大',
                value: 'large'
              },
              {
                label: '中',
                value: 'middle'
              },
              {
                label: '小',
                value: 'small'
              }
            ],
            value: {
              get({ data, focusArea }: EditorResult<Data>) {
                return get(data, focusArea, 'btnId', 'size');
              },
              set({ data, focusArea }: EditorResult<Data>, val: 'large' | 'middle' | 'small') {
                const res = get(data, focusArea, 'btnId', 'obj');
                res.size = val;
              }
            }
          },
          {
            title: '形状',
            type: 'Select',
            options: [
              { label: '默认', value: '' },
              { label: '(椭)圆', value: 'circle' },
              { label: '圆角矩阵', value: 'round' }
            ],
            value: {
              get({ data, focusArea }: Result) {
                return get(data, focusArea, 'btnId', 'shape');
              },
              set({ data, focusArea }: Result, value: string) {
                const res = get(data, focusArea, 'btnId', 'obj');
                res.shape = value;
              }
            }
          },
          {
            title: '间距',
            type: 'Inputnumber',
            options: [
              { title: '左', min: 0, max: 50, width: 50 },
              { title: '右', min: 0, max: 50, width: 50 }
            ],
            value: {
              get({ data, focusArea }: Result) {
                return get(data, focusArea, 'btnId', 'margin');
              },
              set({ data, focusArea }: Result, value: number[]) {
                const res = get(data, focusArea, 'btnId', 'obj');
                res.margin = value;
              }
            }
          }
        ]
      },
      ...moveDelete('btnId'),
      {
        title: '事件',
        items: [
          {
            title: '单击',
            type: '_Event',
            options: ({ data, focusArea }) => {
              const res = get(data, focusArea, 'btnId', 'id');
              return {
                outputId: res
              };
            }
          }
        ]
      }
    ]
  }
};
