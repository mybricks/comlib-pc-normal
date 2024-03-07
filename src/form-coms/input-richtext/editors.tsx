import { OutputIds } from '../types';
import {
  RuleKeys,
  defaultValidatorExample,
  ExpRules,
  showMessage,
  getTitle
} from '../utils/validator';
import { Data, getBtnItemIndex, iconType } from './types';
import { toolbarOptions, BtnItemDataSetKey } from './utils';
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
  ':root': {
    items: ({ data }: EditorResult<{ type }>, ...catalog) => {
      catalog[0].title = '常规';

      catalog[0].items = [
        {
          title: '提示内容',
          type: 'text',
          description: '该提示内容会在值为空时提示',
          options: {
            locale: true
          },
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
          title: '开启状态栏',
          type: 'switch',
          description: '编辑器最底下、左侧显示dom信息,右侧显示字数的一栏',
          value: {
            get({ data }) {
              return data?.statusbar || false;
            },
            set({ data }, val: boolean) {
              data.statusbar = val;
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
                !input.get('uploadResponse') &&
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
              options: toolbarOptions,
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
                  return showMessage(item.key);
                },
                options: {
                  locale: true
                }
              },
              {
                title: '正则表达式',
                type: 'Text',
                value: 'regExr',
                ifVisible(item: any, index: number) {
                  return item.key === RuleKeys.REG_EXP;
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
              return data.rules.length > 0 ? data.rules : ExpRules;
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
            const customRule = (data.rules || ExpRules).find(
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
    },

    style: [
      {
        items: [
          {
            title: '编辑器',
            type: 'Style',
            catelog: '默认',
            options: {
              plugins: ['SIZE']
            },
            value: {
              get({ data }) {
                return { ...data.style, height: data.style.height || '200px' };
              },
              set({ data }, val: {}) {
                data.style = val || {};
              }
            }
          },
          {
            title: '编辑器',
            catelog: '默认',
            options: ['border'],
            target: '.tox-tinymce'
          },
          {
            title: '工具栏',
            catelog: '默认',
            options: [{ type: 'background', config: { disableBackgroundImage: true } }, , 'border'],
            target: '.tox-toolbar-overlord .tox-toolbar__primary'
          },
          {
            title: '工具栏按钮',
            catelog: '默认',
            options: [
              { type: 'font', config: { disableTextAlign: true } },
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            target: '.tox .tox-tbtn:not(.tox-tbtn--disabled)'
          },
          {
            title: '工具栏按钮',
            catelog: '默认',
            options: ['size'],
            target: '.tox .tox-tbtn'
          },
          {
            title: '工具栏按钮',
            catelog: '激活',
            options: [
              { type: 'font', config: { disableTextAlign: true } },
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            target: '.tox .tox-tbtn.tox-tbtn--enabled'
          },
          {
            title: '工具栏按钮',
            catelog: 'Hover',
            options: [
              { type: 'font', config: { disableTextAlign: true } },
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            target: '.tox .tox-tbtn:hover'
          },
          {
            title: '工具栏按钮',
            catelog: '禁用',
            options: [
              { type: 'font', config: { disableTextAlign: true } },
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            target: '.tox .tox-tbtn.tox-tbtn--disabled'
          },
          {
            title: '工具栏下拉按钮',
            catelog: '默认',
            options: ['size'],
            target: '.tox .tox-tbtn.tox-tbtn--select:not(.tox-tbtn--bespoke)'
          },
          {
            title: '工具栏长按钮',
            catelog: '默认',
            options: ['size'],
            target: '.tox .tox-tbtn.tox-tbtn--select.tox-tbtn--bespoke'
          }
        ]
      }
    ]
  }
  // TODO 区域选择有BUG,选中工具栏按钮时编辑区未切换
  // [`[${BtnItemDataSetKey}]`]: {
  //   title: '工具栏按钮',
  //   items: ({}: EditorResult<{}>, ...catalog) => {
  //     catalog[0].title = '常规';
  //     catalog[0].items = [
  //       {
  //         title: '选择图标',
  //         type: 'Icon',
  //         catelog: '默认',
  //         value: {
  //           get({ data, focusArea }: EditorResult<Data>) {
  //             if (!focusArea) return;
  //             const index = getBtnItemIndex(data.icons || [], focusArea);
  //             return index === -1 ? undefined : data.icons[index].icon;
  //           },
  //           set({ data, focusArea }: EditorResult<Data>, value: string) {
  //             if (!focusArea) return;
  //             const index = getBtnItemIndex(data.icons || [], focusArea);
  //             if (index !== -1) {
  //               const newIcons = [...data.icons];
  //               newIcons[index] = {
  //                 ...data.icons[index],
  //                 icon: value,
  //                 name: focusArea?.dataset?.['btnIdx']
  //               };
  //               data.icons = newIcons;
  //             }
  //           }
  //         }
  //       },
  //       {
  //         title: '图标大小',
  //         catelog: '默认',
  //         type: 'Style',
  //         options: {
  //           plugins: ['SIZE']
  //         },
  //         value: {
  //           get({ data, focusArea }: EditorResult<Data>) {
  //             if (!focusArea) return;
  //             const index = getBtnItemIndex(data.icons || [], focusArea);
  //             return index === -1
  //               ? {
  //                   height: '24px',
  //                   width: '24px'
  //                 }
  //               : data.icons[index];
  //           },
  //           set(
  //             { data, focusArea }: EditorResult<Data>,
  //             value: Pick<iconType, 'height' | 'width'>
  //           ) {
  //             if (!focusArea) return;
  //             const index = getBtnItemIndex(data.icons || [], focusArea);
  //             if (index !== -1) {
  //               const newIcons = [...data.icons];
  //               newIcons[index] = { ...data.icons[index], ...(value || {}) };
  //               data.icons = newIcons;
  //             }
  //           }
  //         }
  //       }
  //     ];

  //     return {
  //       title: '工具栏按钮'
  //     };
  //   }
  // }
};
