import { Data, InputIds, OutputIds } from './constants';

export default {
  '@init': ({ style }: EditorResult<Data>) => {
    style.width = 'fit-content';
    style.height = 'auto';
  },
  '@resize': {
    options: ['height', 'width']
  },
  ':root': {
    style: [
      {
        items: [
          {
            title: '默认',
            catelog: '默认',
            options: [
              'border',
              'padding',
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            target: '.ant-image-img'
          },
          {
            title: 'Hover',
            catelog: 'Hover',
            options: [
              'border',
              'padding',
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            target: '.ant-image-img:hover'
          }
        ]
      }
    ],
    items: ({}: EditorResult<Data>, cate1) => {
      cate1.title = '常规';
      cate1.items = [
        {
          title: '图片描述',
          type: 'Text',
          options: {
            locale: true
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.alt;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.alt = value;
            }
          }
        },
        {
          title: '图片地址',
          type: 'ImageSelector',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.src;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.src = value;
            }
          }
        },
        {
          title: '单击图片',
          type: '_Event',
          options() {
            return {
              outputId: OutputIds.Click
            };
          }
        },
        {
          title: '预览配置',
          items: [
            {
              title: '预览',
              type: 'Switch',
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.usePreview;
                },
                set({ data, input, output }: EditorResult<Data>, value: boolean) {
                  data.usePreview = value;
                  if (value) {
                    input.add(InputIds.SetPreviewImgSrc, '预览图片地址', { type: 'string' });
                    output.add('setPreviewImgSrcDone', '设置预览地址完成', { type: 'string' });
                    input.get(InputIds.SetPreviewImgSrc).setRels(['setPreviewImgSrcDone']);
                  } else {
                    input.remove(InputIds.SetPreviewImgSrc);
                    output.remove('setPreviewImgSrcDone');
                  }
                }
              }
            },
            {
              title: '预览图片地址',
              type: 'ImageSelector',
              description: '不填，默认为当前图片地址，支持通过连线动态设置。',
              ifVisible({ data }: EditorResult<Data>) {
                return data.usePreview;
              },
              value: {
                get({ data }) {
                  return data.previewImgSrc;
                },
                set({ data }: EditorResult<Data>, value: string) {
                  data.previewImgSrc = value;
                }
              }
            }
          ]
        },
        {
          title: '容错配置',
          items: [
            {
              title: '支持容错处理',
              type: 'Switch',
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.useFallback;
                },
                set({ data }: EditorResult<Data>, value: boolean) {
                  data.useFallback = value;
                }
              }
            },
            {
              title: '容错图像占位符',
              type: 'ImageSelector',
              description: '加载失败时，显示图像占位符（推荐使用base64字符串）',
              ifVisible({ data }: EditorResult<Data>) {
                return data.useFallback;
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.fallbackImgSrc;
                },
                set({ data }: EditorResult<Data>, value: string) {
                  data.fallbackImgSrc = value;
                }
              }
            }
          ]
        }
      ];
    }
  }
};
