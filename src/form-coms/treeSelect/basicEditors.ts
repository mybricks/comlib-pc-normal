import { TreeSelect } from 'antd';
import { InputIds, OutputIds } from '../types';
import { Data } from './types';
import { RuleKeys, defaultRules } from '../utils/validator';

const items = [
  {
    title: '提示内容',
    type: 'Text',
    options: {
      locale: true
    },
    description: '该提示内容会在值为空时显示',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.config.placeholder;
      },
      set({ data }: EditorResult<Data>, value: string) {
        data.config.placeholder = value;
      }
    }
  },
  {
    title: '显示清除图标',
    type: 'switch',
    description: '可以点击清除图标删除内容',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.config.allowClear;
      },
      set({ data }: EditorResult<Data>, value: boolean) {
        data.config.allowClear = value;
      }
    }
  },
  {
    title: '显示下拉箭头',
    type: 'switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.config.showArrow;
      },
      set({ data }: EditorResult<Data>, value: boolean) {
        data.config.showArrow = value;
      }
    }
  },
  {
    title: '下拉菜单和选择器同宽',
    type: 'switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.config.dropdownMatchSelectWidth;
      },
      set({ data }: EditorResult<Data>, value: boolean) {
        data.config.dropdownMatchSelectWidth = value;
      }
    }
  },
  {
    title: '禁用状态',
    type: 'switch',
    description: '是否禁用状态',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.config.disabled;
      },
      set({ data }: EditorResult<Data>, value: boolean) {
        data.config.disabled = value;
      }
    }
  },
  {
    title: '默认展开深度',
    type: 'InputNumber',
    description: '0表示全部折叠, -1表示全部展开',
    options: [{ min: -1, max: 20, width: 100 }],
    value: {
      get({ data }: EditorResult<Data>) {
        return [data.openDepth];
      },
      set({ data }: EditorResult<Data>, value: number[]) {
        data.openDepth = value[0];
      }
    }
  },
  {
    title: '多选',
    type: 'Switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.config.multiple;
      },
      set({ data, input, output }: EditorResult<Data>, value: boolean) {
        data.config.multiple = value;
        data.config.treeCheckable = value;
        if (value) {
          const valueSchema = {
            type: 'array',
            items: {
              type: 'string'
            }
          };
          input.get(InputIds.SetValue).setSchema(valueSchema);
          output.get(OutputIds.OnChange).setSchema(valueSchema);
          output.get(OutputIds.ReturnValue).setSchema(valueSchema);
          output.get(OutputIds.OnValidate).setSchema(valueSchema);
        } else {
          const valueSchema = {
            type: 'string'
          };
          input.get(InputIds.SetValue).setSchema(valueSchema);
          output.get(OutputIds.OnChange).setSchema(valueSchema);
          output.get(OutputIds.ReturnValue).setSchema(valueSchema);
          output.get(OutputIds.OnValidate).setSchema(valueSchema);
        }
      }
    }
  },
  {
    title: '节点数配置',
    type: "Radio",
    description: '多选结点是自适应还是自定义',
    ifVisible({ data }: EditorResult<Data>) {
      return data.config.multiple;
    },
    options: [
      {
        label: "自适应",
        value: "isResponsive"
      },
      {
        label: "自定义",
        value: "isCustom"
      }
    ],
    value: {
      get({ data }: EditorResult<Data>) {
        return data.maxTagCountType;
      },
      set({ data }: EditorResult<Data>, value: 'isResponsive' | 'isCustom') {
        data.maxTagCountType = value;
        if (data.maxTagCountType == "isResponsive") {
          data.config.maxTagCount = 'responsive';
        } else {
          data.config.maxTagCount = 0;
        }
      }
    }
  },
  {
    title: '最多显示数量',
    type: 'InputNumber',
    description: '当选中个数大于设置值时，会只显示选中数量',
    options: [{ min: 0 }],
    ifVisible({ data }: EditorResult<Data>) {
      return data.config.multiple && data.maxTagCountType === "isCustom";
    },
    value: {
      get({ data }: EditorResult<Data>) {
        return [data.config.maxTagCount];
      },
      set({ data }: EditorResult<Data>, value: number[]) {
        data.config.maxTagCount = value[0];
      }
    }
  },
  {
    title: '输出内容',
    type: 'Select',
    options: [
      { label: '只输出子节点', value: TreeSelect.SHOW_CHILD },
      { label: '只输出父节点', value: TreeSelect.SHOW_PARENT },
      { label: '输出父节点和子节点', value: TreeSelect.SHOW_ALL }
    ],
    ifVisible({ data }: EditorResult<Data>) {
      return data.config.multiple;
    },
    value: {
      get({ data }: EditorResult<Data>) {
        return data.config.showCheckedStrategy;
      },
      set({ data }: EditorResult<Data>, value: string) {
        data.config.showCheckedStrategy = value as any;
      }
    }
  },
  {
    title: '校验规则',
    description: '提供快捷校验配置',
    type: 'ArrayCheckbox',
    options: {
      checkField: 'status',
      visibleField: 'visible',
      getTitle: ({ title }: any) => {
        return title;
      },
      items: [
        // {
        //   title: '提示文字',
        //   description: '提示文字的表达式（{}, =, <, >, ||, &&）, 例：${label}不能为空',
        //   type: 'EXPRESSION',
        //   options: {
        //     autoSize: true,
        //     placeholder: '例：${label}不能为空',
        //     // suggestions: getSuggestions(true),
        //   },
        //   value: 'message'
        // },
        {
          title: '提示文字',
          type: 'Text',
          options: {
            locale: true
          },
          value: 'message',
          ifVisible(item: any, index: number) {
            return item.key === RuleKeys.REQUIRED;
          }
        },
        {
          title: '编辑校验规则',
          type: 'code',
          options: {
            language: 'javascript',
            enableFullscreen: false,
            title: '编辑校验规则',
            width: 600,
            minimap: {
              enabled: false
            },
            babel: true,
            eslint: {
              parserOptions: {
                ecmaVersion: '2020',
                sourceType: 'module'
              }
            }
          },
          ifVisible(item: any, index: number) {
            return item.key === RuleKeys.CODE_VALIDATOR;
          },
          value: 'validateCode'
        }
      ]
    },
    value: {
      get({ data }) {
        return data?.rules?.length > 0 ? data.rules : defaultRules;
      },
      set({ data }, value: any) {
        data.rules = value;
      }
    }
  },
  {
    title: '校验触发事件',
    type: '_event',
    ifVisible({ data }: EditorResult<Data>) {
      const customRule = (data.rules || defaultRules).find(
        (i) => i.key === RuleKeys.CUSTOM_EVENT
      );
      return !!customRule?.status;
    },
    options: {
      outputId: OutputIds.OnValidate
    }
  },
  {
    title: '事件',
    items: [
      {
        title: '值初始化',
        type: '_event',
        options: {
          outputId: 'onInitial'
        }
      },
      {
        title: '值更新',
        type: '_event',
        options: {
          outputId: 'onChange'
        }
      },
    ]
  }
];

export default items;