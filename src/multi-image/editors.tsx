import { Data, InputIds, ObjectFit, OutputIds, Layout } from './constants';

export default {
  '@init': ({ style }: EditorResult<Data>) => {
    style.width = '375px';
    style.height = '200px';
  },
  '@resize': {
    options: ['height', 'width']
  },
  ':root': {
    style: [
      {
        items: [
          {
            title: '图片默认样式',
            catelog: '默认',
            options: [
              'border',
              'padding',
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            target: ['.mult-image-contain > div.mult-image-item']
          },
          {
            title: 'Hover',
            catelog: 'Hover',
            options: [
              'border',
              'padding',
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            target: 'div.mult-image-item:hover'
          }
        ]
      }
    ],
    items: ({}: EditorResult<Data>, cate1, cate2) => {
      cate1.title = '常规';
      cate1.items = [
        {
          title: '图片列表',
          type: 'Array',
          description: '配置展示的图片列表',
          options: {
            getTitle: ({ title, src }) => {
              return `${title || src?.slice(0, 20) || '图片'}`;
            },
            onAdd: () => {
              return {
                id: Math.random().toString(36).slice(2),
                src: '',
                alt: '图片'
              };
            },
            items: [
              {
                title: '图片地址',
                type: 'ImageSelector',
                value: 'src'
              },
              {
                title: '图片描述',
                type: 'Text',
                options: { locale: true },
                value: 'alt'
              },
              {
                title: '预览图片地址',
                type: 'Text',
                value: 'previewImgSrc'
              }
            ]
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.images;
            },
            set({ data }: EditorResult<Data>, value: any[]) {
              data.images = value;
            }
          }
        },
        {
          title: '布局方式',
          type: 'Select',
          options: [
            { label: '网格', value: 'grid' },
            { label: 'Flex', value: 'flex' }
          ],
          value: {
            get({ data }: EditorResult<Data>) {
              return data.layout;
            },
            set({ data }: EditorResult<Data>, value: Layout) {
              data.layout = value;
            }
          }
        },
        {
          title: '网格列数',
          type: 'Slider',
          options: [
            { label: '1列', value: 1 },
            { label: '2列', value: 2 },
            { label: '3列', value: 3 },
            { label: '4列', value: 4 },
            { label: '5列', value: 5 }
          ],
          ifVisible({ data }: EditorResult<Data>) {
            return data.layout === 'grid';
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.columns || 3;
            },
            set({ data }: EditorResult<Data>, value: number) {
              data.columns = value;
            }
          }
        },
        {
          title: '图片间距',
          type: 'InputNumber',
          options: [{ min: 0, max: 100, width: 100 }],
          value: {
            get({ data }: EditorResult<Data>) {
              return data.gap ?? 8;
            },
            set({ data }: EditorResult<Data>, value: number) {
              data.gap = value;
            }
          }
        },
        {
          title: '填充模式',
          type: 'Select',
          description: '指定图片的内容如何适应容器的高度与宽度',
          options: [
            { label: '拉伸图片 (fill)', value: 'fill' },
            { label: '按比例缩小，可能会留白 (contain)', value: 'contain' },
            { label: '按比例放大，保证铺满 (cover)', value: 'cover' },
            { label: '原始尺寸 (none)', value: 'none' }
          ],
          value: {
            get({ data }: EditorResult<Data>) {
              return data.objectFit || 'cover';
            },
            set({ data }: EditorResult<Data>, value: ObjectFit) {
              data.objectFit = value;
            }
          }
        },
        {
          title: '单击图片',
          type: '_Event',
          description: '单击图片时触发【单击图片】输出项事件，输出当前图片信息',
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
          title: '预览配置',
          items: [
            {
              title: '预览',
              type: 'Switch',
              description: '开启后单击图像可以放大显示',
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.usePreview;
                },
                set({ data }: EditorResult<Data>, value: boolean) {
                  data.usePreview = value;
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
              description: '配置加载失败时的图像占位符',
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
