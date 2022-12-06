import { RuleKeys, defaultRules } from '../utils/validator';
import { Data } from './runtime';

const uploadEditors = [
  {
    title: '上传样式',
    items: [
      {
        title: '宽度',
        type: 'Text',
        description: '设置上传按钮宽度，0为使用默认',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.config.uploadStyle.width;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.config.uploadStyle = {
              ...data.config.uploadStyle,
              width: +value
            };
          }
        }
      },
      {
        title: '高度',
        type: 'Text',
        description: '设置上传按钮高度，0为使用默认',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.config.uploadStyle.height;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.config.uploadStyle = {
              ...data.config.uploadStyle,
              height: +value
            };
          }
        }
      }
    ]
  }
];

const basicUploadDoneSchema = {
  type: 'object',
  properties: {
    url: {
      type: 'string'
    },
    name: {
      type: 'string'
    }
  }
};

export default {
  '@resize': {
    options: ['width']
  },
  ':root'({ data }: EditorResult<{ type }>, ...catalog) {
    catalog[0].title = '常规';

    catalog[0].items = [
      ...uploadEditors,
      {
        title: '上传配置',
        items: [
          {
            title: '上传文件Key',
            type: 'Text',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.config.fileKey;
              },
              set({ data }: EditorResult<Data>, value: string) {
                data.config.fileKey = value;
              }
            }
          },
          {
            title: '上传按钮文案',
            type: 'Text',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.config.buttonText;
              },
              set({ data }: EditorResult<Data>, value: string) {
                data.config.buttonText = value;
              }
            }
          },
          {
            title: '上传列表类型',
            type: 'Select',
            description: '上传列表的内建样式',
            options: [
              { label: '文字列表', value: 'text' },
              { label: '图片列表', value: 'picture' },
              { label: '图片卡片列表', value: 'picture-card' },
              { label: '拖拽上传', value: 'dragger' }
            ],
            value: {
              get({ data }: EditorResult<Data>) {
                return data.config.listType;
              },
              set({ data }: EditorResult<Data>, value: string) {
                data.config.listType = value;
              }
            }
          },
          {
            title: '图标',
            type: 'Icon',
            ifVisible({ data }: EditorResult<Data>) {
              return data.config.listType === 'dragger';
            },
            value: {
              get({ data }: EditorResult<Data>) {
                return data.config.uploadIcon || 'InboxOutlined';
              },
              set({ data }: EditorResult<Data>, value: string) {
                data.config.uploadIcon = value;
              }
            }
          },
          {
            title: '上传文件限制类型',
            type: 'Select',
            description: '允许上传的文件类型,无选择则不限制',
            options: {
              mode: 'tags',
              options: [
                { label: 'Excel文件', value: '.xlsx,.xls,.xlsm' },
                { label: 'JPG图片', value: '.jpg,.jpeg' },
                { label: 'PNG图片', value: '.png' }
              ],
              multiple: true
            },
            value: {
              get({ data }: EditorResult<Data>) {
                return data.config.fileType || [];
              },
              set({ data }: EditorResult<Data>, value: string[]) {
                data.config.fileType = value;
              }
            }
          },
          {
            title: '上传文件限制大小',
            type: 'Inputnumber',
            description: '允许上传的文件大小,0表示不限制',
            options: [{ title: 'MB', min: 0, max: 50, width: 60 }],
            value: {
              get({ data }: EditorResult<Data>) {
                return [data.config.fileSize];
              },
              set({ data }: EditorResult<Data>, value: number[]) {
                data.config.fileSize = value[0];
              }
            }
          },
          {
            title: '上传文件限制个数',
            type: 'Inputnumber',
            description: '允许上传的文件个数,超过将覆盖',
            options: [{ title: '个文件', min: 0, max: 15, width: 80 }],
            value: {
              get({ data }: EditorResult<Data>) {
                return [data.config.fileCount];
              },
              set({ data, input }: EditorResult<Data>, value: number[]) {
                const [count] = value;
                data.config.fileCount = count;
                if (count > 1) {
                  input.get('uploadDone').setSchema({
                    type: 'array',
                    items: basicUploadDoneSchema
                  });
                } else {
                  input.get('uploadDone').setSchema(basicUploadDoneSchema);
                }
              }
            }
          },
          {
            title: '开启图片预览',
            type: 'Switch',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.config.usePreview;
              },
              set({ data }: EditorResult<Data>, value: boolean) {
                data.config.usePreview = value;
              }
            }
          },
          {
            title: '开启多选',
            type: 'Switch',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.config.multiple;
              },
              set({ data }: EditorResult<Data>, value: boolean) {
                data.config.multiple = value;
              }
            }
          }
        ]
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
        title: '事件',
        items: [
          {
            title: '文件上传',
            type: '_event',
            options: {
              outputId: 'upload'
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
