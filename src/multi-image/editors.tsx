import { Data, ObjectFit, OutputIds } from './constants';

export default {
  '@init': ({ style }: EditorResult<Data>) => {
    style.width = '200px';
    style.height = 'auto';
  },
  '@resize': {
    options: ['height', 'width']
  },
  ':root': {
    style: [
      {
        title: '列表样式',
        items: [
          {
            options: [
              'border',
              'padding',
              'background',
            ],
            target: '.img-list'
          }
        ]
      },
      {
        title: '图片样式',
        items: [
          {
            title: '默认',
            catelog: '默认',
            options: [
              'size',
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
              'size',
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
          description: '对图像的备用文本描述（alt），有利于搜索SEO',
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
          title: '填充模式',
          type: 'Select',
          description:
            '指定图片的内容如何适应容器的高度与宽度，可以图片进行保留原始比例的裁剪、缩放或者直接进行拉伸等',
          options: [
            {
              label: '拉伸图片 (fill)',
              value: 'fill'
            },
            {
              label: '缩放图片 (contain)',
              value: 'contain'
            },
            {
              label: '裁剪图片 (cover)',
              value: 'cover'
            },
            {
              label: '原始尺寸 (none)',
              value: 'none'
            }
          ],
          value: {
            get({ data }: EditorResult<Data>) {
              return data.objectFit || 'fill';
            },
            set({ data }: EditorResult<Data>, value: ObjectFit) {
              data.objectFit = value;
            }
          }
        },
        {
          title: '单击图片',
          type: '_Event',
          description: '单击图片时触发【单击图片】输出项事件',
          options() {
            return {
              outputId: OutputIds.Click
            };
          }
        },
        {
          title: '禁止右键下载',
          type: 'Switch',
          description: '禁止鼠标右键下载图片资源',
          value: {
            get({ data }: EditorResult<Data>) {
              return !!data?.disableContextMenu;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.disableContextMenu = value;
            }
          }
        },
        {
          title: '禁止拖拽图片',
          type: 'Switch',
          description: '禁止拖拽图片',
          value: {
            get({ data }: EditorResult<Data>) {
              return !!data?.disableDrag;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.disableDrag = value;
            }
          }
        },
        {
          title: '容错配置',
          items: [
            {
              title: '支持容错处理',
              type: 'Switch',
              description: '开启后加载失败时显示配置的【容错图像占位符】',
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
              description: '配置加载失败时的图像占位符可以使用图片资源地址（推荐使用base64字符串）',
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
