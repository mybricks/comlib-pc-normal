import { RuleKeys, defaultValidatorExample, defaultRules } from '../utils/validator';
import { InputIds, OutputIds } from '../types';
import { Data } from './types';
import TreeSelectEditors from './treeSelectEditors';

export default {
  '@resize': {
    options: ['width']
  },
  '@init': ({ style }) => {
    style.width = '100%';
  },
  ':root'({ data }: EditorResult<{ type }>, ...catalog) {
    catalog[0].title = '常规';

    catalog[0].items = [
      {
        title: '提示内容',
        type: 'Text',
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
      ...TreeSelectEditors,
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

    catalog[1].title = '高级'
    catalog[1].items = [
      {
        title: '标题字段',
        type: 'Text',
        options: {
          placeholder: '默认值为 label'
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.labelFieldName
          },
          set({ data, input, output }: EditorResult<Data>, value: string) {
            data.labelFieldName = value
            refreshSchema(data, input, output)
          }
        }
      },
      {
        title: '值字段',
        type: 'Text',
        options: {
          placeholder: '默认值为 value'
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.valueFieldName
          },
          set({ data, input, output }: EditorResult<Data>, value: string) {
            data.valueFieldName = value
            refreshSchema(data, input, output)
          }
        }
      },
      {
        title: '叶子节点字段',
        type: 'Text',
        options: {
          placeholder: '默认值为 children'
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.childrenFieldName
          },
          set({ data, input, output }: EditorResult<Data>, value: string) {
            data.childrenFieldName = value
            refreshSchema(data, input, output)
          }
        }
      },
      {
        title: '异步加载',
        type: 'Switch',
        description: '开启后可配置子节点异步加载',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useLoadData;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.useLoadData = value;
          }
        }
      },
      {
        title: '仅首次加载',
        type: 'Switch',
        description: '关闭后，每次展开节点，都会重新触发异步加载',
        ifVisible({ data }: EditorResult<Data>) {
          return data.useLoadData
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.loadDataOnce;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.loadDataOnce = value;
          }
        }
      },
      {
        title: '异步加载输出',
        type: '_event',
        ifVisible({ data }: EditorResult<Data>) {
          return data.useLoadData
        },
        options: {
          outputId: 'loadData'
        }
      },
    ]
  }
}

const refreshSchema = (data: Data, input, output) => {

  const trueValueFieldName = data.valueFieldName || 'value';
  const trueLabelFieldName = data.labelFieldName || 'label';
  const trurChildrenFieldName = data.childrenFieldName || 'children';

  const schema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        [trueLabelFieldName]: {
          title: '标签',
          type: 'string'
        },
        [trueValueFieldName]: {
          title: '值',
          type: 'string'
        },
        isLeaf: {
          title: '是否叶子节点',
          type: 'boolean'
        },
        [trurChildrenFieldName]: {
          title: '子项',
          type: 'array',
          items: {
            type: 'object',
            properties: {}
          }
        }
      }
    }
  }

  const setOptionsPin = input.get('setOptions')
  const setLoadDataPin = input.get('setLoadData')
  const loadDataPin = output.get('loadData')

  if (setOptionsPin) {
    setOptionsPin.setSchema(schema)
  }

  if (setLoadDataPin) {
    setLoadDataPin.setSchema(schema.items)
  }

  if (loadDataPin) {
    loadDataPin.setSchema(schema.items)
  }
}