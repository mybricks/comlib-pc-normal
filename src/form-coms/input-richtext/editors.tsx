import { OutputIds } from '../types';
import { RuleKeys, defaultValidatorExample, defaultRules } from '../utils/validator';
import { Data } from './types';
export default {
  '@resize': {
    options: ['width']
  },
  '@init'({ data, input, output }) {
    input.add('uploadResponse', '上传响应', {
      type: 'object',
      properties: {
        url: {
          title: 'url',
          type: 'string'
        }
      }
    });
    output.add('upload', '上传', {
      type: 'object',
      properties: {
        file: {
          title: '文件数据',
          type: 'any'
        },
        file_name: {
          title: '文件名称',
          type: 'string'
        },
        file_type: {
          title: '文件类型',
          type: 'string'
        }
      }
    });
  },
  ':root'({ data }: EditorResult<{ type }>, ...catalog) {
    catalog[0].title = '常规';

    catalog[0].items = [
      {
        title: '提示内容',
        type: 'text',
        description: '该提示内容会在值为空时提示',
        value: {
          get({ data }) {
            return data.placeholder;
          },
          set({ data }, val: boolean) {
            data.placeholder = val;
          }
        }
      },
      {
        title: '禁用状态',
        type: 'switch',
        description: '是否禁用状态',
        value: {
          get({ data }) {
            return data.disabled;
          },
          set({ data }, val: boolean) {
            data.disabled = val;
          }
        }
      },
      {
        title: '自定义上传',
        type: 'switch',
        description: '是否自定义上传逻辑',
        value: {
          get({ data }) {
            return data.customUpload;
          },
          set({ data, input, output }, val: boolean) {
            data.customUpload = val;
            if (val) {
              input.add('uploadResponse', '上传响应', {
                type: 'object',
                properties: {
                  url: {
                    title: 'url',
                    type: 'string'
                  }
                }
              });
              output.add('upload', '上传', {
                type: 'object',
                properties: {
                  file: {
                    title: '文件数据',
                    type: 'any'
                  },
                  file_name: {
                    title: '文件名称',
                    type: 'string'
                  },
                  file_type: {
                    title: '文件类型',
                    type: 'string'
                  }
                }
              });
            } else {
              input.remove('uploadResponse');
              output.remove('upload');
            }
          }
        }
      },
      {
        title: '显示编辑栏',
        type: 'switch',
        value: {
          get({ data }) {
            return data.displayEditbar;
          },
          set({ data }, val: boolean) {
            // @ts-ignore
            data.displayEditbar = val;
          }
        }
      },
      {
        title: '插件选择',
        type: 'select',
        description: '添加需要的插件,按照添加的顺序排序',
        ifVisible({ data }) {
          return data.displayEditbar;
        },
        options() {
          return {
            options: [
              {
                label: '超链接',
                value: 'link'
              },
              {
                label: '表格',
                value: 'table'
              },
              {
                label: '图片上传',
                value: 'uploadimage'
              },
              {
                label: '视频上传',
                value: 'uploadVideo'
              },
              {
                label: '下划线',
                value: 'underline'
              },
              {
                label: '字体',
                value: 'fontselect'
              },
              {
                label: '删除线',
                value: 'strikethrough'
              },
              {
                label: '加粗',
                value: 'bold'
              },
              {
                label: '左对齐',
                value: 'alignleft'
              },
              {
                label: '居中',
                value: 'aligncenter'
              },
              {
                label: '右对齐',
                value: 'alignright'
              },
              {
                label: '字体大小',
                value: 'fontsizeselect'
              },
              {
                label: '斜体',
                value: 'italic'
              },
              {
                label: '文本颜色',
                value: 'forecolor'
              },
              {
                label: '背景色',
                value: 'backcolor'
              }
            ],
            mode: 'multiple'
          };
        },
        value: {
          get({ data }) {
            return data.toolbar;
          },
          set({ data }, val: string[]) {
            // @ts-ignore
            data.toolbar = val;
          }
        }
      },
      {
        title: '样式',
        type: 'Style',
        options: {
          plugins: ['SIZE']
        },
        value: {
          get({ data }) {
            return { ...data.style, height: data.style.height || '200px' };
          },
          set({ data }, val: {}) {
            // @ts-ignore
            data.style = val || {};
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
          getTitle,
          items: [
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
            return data.rules.length > 0 ? data.rules : defaultRules;
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
          const cutomRule = (data.rules || defaultRules).find(
            (i) => i.key === RuleKeys.CUSTOM_EVENT
          );
          return !!cutomRule?.status;
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
            title: '失去焦点',
            type: '_event',
            options: {
              outputId: 'onBlur'
            }
          },
          {
            title: '值更新',
            type: '_event',
            options: {
              outputId: 'onChange'
            }
          },
          {
            title: '上传',
            type: '_event',
            options: {
              outputId: 'upload'
            },
            ifVisible({ data }: EditorResult<Data>) {
              return data.customUpload;
            }
          }
        ]
      }
    ];
  }
};

const getTitle = (item: any, index: number) => {
  const { key, title, numericalLimit, regExr } = item;
  return title;
};
