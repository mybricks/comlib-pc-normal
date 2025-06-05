import { SizeEnum, SizeOptions } from '../types';
import { RuleKeys, defaultRules } from '../utils/validator';
import { Data } from './runtime';
import { getFilterSelector } from '../../utils/cssSelector';
import { templateRender } from '../utils';

const uploadEditors = {
  title: '上传按钮尺寸',
  items: [
    {
      title: '快捷尺寸',
      description: '控件大小, 默认是中(middle)',
      type: 'Select',
      options: SizeOptions,
      value: {
        get({ data }: EditorResult<Data>) {
          return data.buttonSize || 'middle';
        },
        set({ data }: EditorResult<Data>, val: SizeEnum) {
          data.buttonSize = val;
        }
      }
    },
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
};

const basicUploadDoneSchema = {
  type: 'object',
  properties: {
    url: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    status: {
      type: 'string'
    },
    percent: {
      type: 'number'
    },
    response: {
      type: 'string'
    }
  }
};

export default {
  '@init'({ style }) {
    style.width = 'fit-content';
    style.height = 'auto';
  },
  '@resize': {
    options: ['width']
  },
  ':root': {
    style: [
      {
        items: [
          {
            title: '隐藏图标',
            type: 'switch',
            description: '是否隐藏图标，默认不隐藏',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.hideIcon;
              },
              set({ data }: EditorResult<Data>, value: boolean) {
                data.hideIcon = value;
              }
            }
          },
        ]
      },
      uploadEditors,
      {
        title: '背景',
        options: ['background', 'border'],
        target: ({ id }: EditorResult<Data>) => [
          `.ant-upload.ant-upload-select-picture-card`,
          `.ant-upload .ant-btn`
        ]
        //target: ['.ant-upload.ant-upload-select-picture-card', `.ant-upload .ant-btn`],
      },
      {
        title: '图标',
        options: ['font'],
        target: '.ant-btn .anticon',
      },
      {
        title: '文案',
        options: ['font'],
        target: ['.text'],
      },
      /**
      {
        title: '默认样式',
        options: ['border', 'font'],
        ifVisible({ data }: EditorResult<Data>) {
          return ['text', 'picture', undefined].includes(data.config.listType);
        },
        target: '.ant-upload-select .ant-btn'
      },
      {
        title: '默认样式',
        options: ['border'],
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.listType === 'picture-card';
        },
        target: '.ant-upload-select-picture-card'
      },
      {
        title: '默认样式',
        options: ['border'],
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.listType === 'dragger';
        },
        target: '.ant-upload-drag'
      },
      {
        title: '激活样式',
        options: ['border', 'font'],
        ifVisible({ data }: EditorResult<Data>) {
          return ['text', 'picture', undefined].includes(data.config.listType);
        },
        target: '.ant-upload-select .ant-btn:hover'
        // initValue: {
        //   color: '#5c8fff',
        //   borderColor: '#5c8fff',
        //   borderWidth: '1px',
        //   borderStyle: 'solid',
        //   borderRadius: '4px',
        //   background: '#fff'
        // }
      },
      {
        title: '激活样式',
        options: ['border'],
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.listType === 'picture-card';
        },
        target: '.ant-upload-select-picture-card:hover'
        // initValue: {
        //   borderColor: '#326bfb',
        //   borderWidth: '1px',
        //   borderStyle: 'solid',
        //   borderRadius: '4px'
        // }
      },
      {
        title: '激活样式',
        options: ['border'],
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.listType === 'dragger';
        },
        target: '.ant-upload-drag:hover'
        // initValue: {
        //   borderColor: '#5c8fff',
        //   borderWidth: '1px',
        //   borderStyle: 'solid',
        //   borderRadius: '4px'
        // }
      }
       */
    ],
    items: ({ data }: EditorResult<Data>, ...catalog) => {
      catalog[0].title = '常规';

      catalog[0].items = [
        {
          title: '上传配置',
          items: [
            {
              title: '上传文件Key',
              description: '发到后台的文件参数名',
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
              description: '上传按钮文案',
              type: 'Text',
              options: {
                locale: true
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.config.buttonText;
                },
                set({ data }: EditorResult<Data>, value: string) {
                  data.config.buttonText = value;
                }
              }
            },
            // {
            //   title: '图标',
            //   type: 'Icon',
            //   ifVisible({ data }: EditorResult<Data>) {
            //     return data.config.listType === 'dragger';
            //   },
            //   value: {
            //     get({ data }: EditorResult<Data>) {
            //       return data.config.uploadIcon || 'InboxOutlined';
            //     },
            //     set({ data }: EditorResult<Data>, value: string) {
            //       data.config.uploadIcon = value;
            //     }
            //   }
            // },
            {
              title: '上传文件限制类型',
              type: 'Select',
              description: '允许上传的文件类型,无选择则不限制；可自定义输入，标准格式如“.json”',
              options: {
                mode: 'tags',
                options: [
                  { label: 'JPG图片', value: '.jpg,.jpeg' },
                  { label: 'PNG图片', value: '.png' },
                  { label: 'SVG图片', value: '.svg' },
                  { label: 'GIF图片', value: '.gif' },
                  { label: 'Tiff图片', value: '.tiff' },
                  { label: 'Word文档', value: '.doc,.docx' },
                  { label: 'Excel电子表格', value: '.xlsx,.xls,.xlsm' },
                  { label: 'PowerPoint演示文稿', value: '.pptx,.ppt' },
                  { label: 'PDF文档', value: '.pdf' },
                  { label: 'HTML网页文件', value: '.html' },
                  { label: 'CSS样式表文件', value: '.css' },
                  { label: 'Less样式表文件', value: '.less' },
                  { label: 'JS脚本文件', value: '.js' },
                  { label: 'XML数据文件', value: '.xml' },
                  { label: 'JSON文件', value: '.json' },
                  { label: 'Markdown文件', value: '.md' },
                  { label: 'SQL数据库文件', value: '.sql' },
                  { label: 'MDB数据库文件', value: '.mdb' },
                  { label: 'zip压缩文件', value: '.zip' },
                  { label: 'rar压缩文件', value: '.rar' },
                  { label: 'Mp3音频文件', value: '.mp3' },
                  { label: 'Mp4视频文件', value: '.mp4' },
                  { label: 'Avi视频文件', value: '.avi' },
                  { label: 'Mov视频文件', value: '.mov' }
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
              options: [{ title: 'MB', min: 0, width: 60 }],
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
                set({ data, input, slot }: EditorResult<Data>, value: number[]) {
                  const [count] = value;
                  data.config.fileCount = count;
                  if (count > 1) {
                    // ＜ v1.0.34
                    input.get('uploadDone')?.setSchema({
                      type: 'array',
                      items: basicUploadDoneSchema
                    });
                    // ≥ v1.0.34
                    slot.get('customUpload')?.outputs?.get('setFileInfo')?.setSchema({
                      type: 'array',
                      items: basicUploadDoneSchema
                    });
                  } else {
                    // ＜ v1.0.34
                    input.get('uploadDone')?.setSchema(basicUploadDoneSchema);
                    // ≥ v1.0.34
                    slot
                      .get('customUpload')
                      ?.outputs?.get('setFileInfo')
                      ?.setSchema(basicUploadDoneSchema);
                  }
                }
              }
            },
            {
              title: '展示文件列表',
              type: 'Switch',
              description: '当上传列表类型为文字列表或者图片列表时, 默认展示文件列表',
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.isShowUploadList;
                },
                set({ data }: EditorResult<Data>, value: boolean) {
                  data.isShowUploadList = value;
                }
              }
            },
            {
              title: '开启自定义删除',
              type: 'Switch',
              description:
                '开启后，新增文件删除事件，并可以通过逻辑连线连接上传的输入项【删除文件】，删除对应文件',
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.config.useCustomRemove;
                },
                set({ data, input, output }: EditorResult<Data>, value: boolean) {
                  data.config.useCustomRemove = value;
                  if (value) {
                    !output.get('remove') &&
                      output.add('remove', '删除文件', {
                        type: 'object',
                        properties: {
                          name: {
                            type: 'string'
                          },
                          uid: {
                            type: 'string'
                          },
                          url: {
                            type: 'string'
                          },
                          status: {
                            type: 'string'
                          },
                          percent: {
                            type: 'number'
                          },
                          response: {
                            type: 'string'
                          }
                        }
                      });
                    !input.get('remove') &&
                      input.add('remove', '删除文件', {
                        type: 'object',
                        properties: {
                          name: {
                            type: 'string'
                          },
                          uid: {
                            type: 'string'
                          }
                        }
                      });
                  } else {
                    output.get('remove') && output.remove('remove');
                    input.get('remove') && input.remove('remove');
                  }
                }
              }
            },
            {
              title: '开启多选',
              type: 'Switch',
              description: '开启后支持多选文件，开启后按住ctrl可选择多个文件',
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
          title: '图片配置',
          items: [
            {
              title: '开启预览',
              type: 'Switch',
              description: '开启后，上传的图片文件支持预览',
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
              title: '尺寸校验',
              type: 'InputNumber',
              description: '允许上传的图片尺寸, 0 表示宽高不限制',
              options: [
                { title: '宽(px)', min: 0, max: 2000, width: 100 },
                { title: '高(px)', min: 0, max: 2000, width: 100 }
              ],
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.imageSize;
                },
                set({ data }: EditorResult<Data>, value: number[]) {
                  data.imageSize = value;
                }
              }
            }
          ]
        },
        {
          title: '校验规则',
          description: '作为表单项时，快捷校验配置',
          type: 'ArrayCheckbox',
          options: {
            checkField: 'status',
            visibleField: 'visible',
            getTitle,
            items: [
              {
                title: '提示文字',
                description: '提示文字的表达式（{}）, 例：${标题}不能为空',
                type: 'EXPRESSION',
                options: {
                  autoSize: true,
                  placeholder: '例:${标题}不能为空',
                  suggestions: [
                    {
                      label: '标题',
                      insertText: '标题',
                      detail: `标题`
                    },
                  ],
                  runCode: (script) => {
                    return {
                      success: templateRender(script, { label: "xx标题"})
                    };
                  },
                },
                ifVisible(item: any, index: number) {
                  return item.key === RuleKeys.REQUIRED;
                },
                value: 'message',
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
          options: {
            outputId: 'onValidate'
          },
          ifVisible({ data }) {
            return data.rules?.some((rule) => rule.key === RuleKeys.CUSTOM_EVENT && rule.status);
          }
        },
        {
          title: '事件',
          items: [
            {
              title: '值初始化',
              description: '设置上传组件初始值后，值初始化事件',
              type: '_event',
              options: {
                outputId: 'onInitial'
              }
            },
            {
              title: '上传完成后',
              description: '文件上传完成后，上传完成事件',
              type: '_Event',
              options: {
                outputId: 'uploadComplete'
              }
            },
            {
              ifVisible({ data }: EditorResult<Data>) {
                return data.config.useCustomRemove;
              },
              title: '文件删除',
              description: '文件删除事件',
              type: '_event',
              options: {
                outputId: 'remove'
              }
            }
          ]
        }
      ];

      catalog[1].title = '高级';

      catalog[1].items = [
        {
          title: '使用自定义上传',
          type: 'switch',
          description: '开启后，通过上传事件，或者在自定义上传卡片中调用接口进行上传',
          value: {
            get({ data, env }: EditorResult<Data>) {
              // 兼容没有设置env.uploadFile的情况
              if (!data.customUpload && typeof env.uploadFile !== 'function') {
                return false;
              }
              return data.customUpload;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.customUpload = value;
            }
          }
        },
        {
          title: '自定义上传接口',
          type: '_event',
          ifVisible({ data, env, slots }: EditorResult<Data>) {
            return (
              !slots.get('customUpload') &&
              (typeof env.uploadFile !== 'function' || data.customUpload)
            );
          },
          options: {
            outputId: 'upload'
          }
        },
        {
          title: '开启文件点击',
          type: 'switch',
          description: '开启后, 可自定义上传文件的点击事件且不跳转到新页面',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.fileClick;
            },
            set({ data, output }: EditorResult<Data>, value: boolean) {
              const hasEvent = output.get('fileClick');
              if (value) {
                !hasEvent &&
                  output.add('fileClick', '上传文件点击', {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string'
                      },
                      uid: {
                        type: 'string'
                      },
                      url: {
                        type: 'string'
                      },
                      status: {
                        type: 'string'
                      },
                      percent: {
                        type: 'number'
                      },
                      response: {
                        type: 'string'
                      }
                    }
                  });
              } else {
                hasEvent && output.remove('fileClick');
              }
              data.fileClick = value;
            }
          }
        },
        {
          title: '上传文件点击',
          type: '_Event',
          description: '开启后, 新增上传文件点击事件',
          ifVisible({ data }: EditorResult<Data>) {
            return !!data.fileClick;
          },
          options: {
            outputId: 'fileClick'
          }
        }
      ];
    }
  },
  '.upload-btn-text': {
    '@dblclick': {
      type: 'text',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.config.buttonText;
        },
        set({ data }: EditorResult<Data>, val: string) {
          data.config.buttonText = val;
        }
      }
    },
    items: [
      {
        title: '上传按钮文案',
        type: 'Text',
        options: {
          locale: true
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.config.buttonText;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.config.buttonText = value;
          }
        }
      }
    ]
  }
};

const getTitle = (item: any, index: number) => {
  const { key, title, numericalLimit, regExr } = item;
  return title;
};
