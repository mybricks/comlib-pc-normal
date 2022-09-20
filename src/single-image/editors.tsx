import { Data, OutputIds } from './constants';

export default {
  '@init': ({ style }: EditorResult<Data>) => {
    style.width = 'fit-content';
    style.height = 'auto';
  },
  '@resize': {
    options: ['height', 'width']
  },
  ':root': ({}: EditorResult<Data>, cate1, cate2, cate3) => {
    cate1.title = '常规';
    cate1.items = [
      {
        title: '图片描述',
        type: 'Text',
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
        title: '预览配置',
        items: [
          {
            title: '预览',
            type: 'Switch',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.usePreview;
              },
              set({ data }: EditorResult<Data>, value: boolean) {
                data.usePreview = value;
              }
            }
          },
          {
            title: '预览图片地址',
            type: 'ImageSelector',
            description: '不填，默认为当前图片地址',
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

    cate2.title = '样式';
    cate2.items = [
      {
        title: '基本样式',
        type: 'Style',
        options: {
          defaultOpen: true,
          plugins: ['Border']
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.customStyle;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.customStyle = value;
          }
        }
      }
    ];

    cate3.title = '事件';
    cate3.items = [
      {
        title: '单击图片',
        type: '_Event',
        options() {
          return {
            outputId: OutputIds.Click
          };
        }
      }
    ];
  }
};
