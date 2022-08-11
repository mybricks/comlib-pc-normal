import { Data, ImageConfig } from '../../../types';
import { getColumnItem } from '../../../utils';

// 兜底图片
const defaultFallback =
  'data:image/png;base64,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';

const defaultConfig: ImageConfig = {
  height: 0,
  preview: true,
  fallback: defaultFallback,
  useCustomSrc: false,
  usePlaceholder: false,
  placeholderSourceType: 'rowKey'
};

// 设置列项imageConfig
const setImageConfig = <T extends keyof ImageConfig, P extends ImageConfig[T]>(
  data: Data,
  focusArea: any,
  propName: T,
  value: P
) => {
  const item = getColumnItem(data, focusArea);
  if (!item.imageConfig) {
    item.imageConfig = {
      width: item.width || 100,
      ...defaultConfig
    };
  }
  item.imageConfig[propName] = value;
};
// 获取列项imageConfig
const getImageConfig = <T extends keyof ImageConfig>(
  data: Data,
  focusArea: any,
  propName: T
): ImageConfig[T] => {
  const item = getColumnItem(data, focusArea);
  if (!item.imageConfig) {
    item.imageConfig = {
      width: item.width || 100,
      ...defaultConfig
    };
  }
  return item.imageConfig[propName];
};

const ImageItemEditor = {
  title: '图片列设置',
  ifVisible({ data, focusArea }: EditorResult<Data>) {
    if (!focusArea) return;
    const item = getColumnItem(data, focusArea);
    return item.contentType === 'image';
  },
  items: [
    {
      title: '预览',
      type: 'switch',
      value: {
        get: ({ data, focusArea }: EditorResult<Data>) => {
          return getImageConfig(data, focusArea, 'preview');
        },
        set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          setImageConfig(data, focusArea, 'preview', value);
        }
      }
    },
    {
      title: '宽度',
      type: 'text',
      description: '设置图片宽度，0为自适应',
      value: {
        get: ({ data, focusArea }: EditorResult<Data>) => {
          return getImageConfig(data, focusArea, 'width');
        },
        set({ data, focusArea }: EditorResult<Data>, value: string) {
          setImageConfig(data, focusArea, 'width', parseInt(value, 10) || 0);
        }
      }
    },
    {
      title: '高度',
      type: 'text',
      description: '设置图片高度，0为自适应',
      value: {
        get: ({ data, focusArea }: EditorResult<Data>) => {
          return getImageConfig(data, focusArea, 'height');
        },
        set({ data, focusArea }: EditorResult<Data>, value: string) {
          setImageConfig(data, focusArea, 'height', parseInt(value, 10) || 0);
        }
      }
    },
    {
      title: '兜底图片',
      type: 'textarea',
      description: '加载失败时显示，使用base64图片',
      value: {
        get: ({ data, focusArea }: EditorResult<Data>) => {
          return getImageConfig(data, focusArea, 'fallback');
        },
        set({ data, focusArea }: EditorResult<Data>, value: string) {
          setImageConfig(data, focusArea, 'fallback', value);
        }
      }
    },
    {
      title: '图片地址配置',
      items: [
        {
          title: '自定义图片地址',
          type: 'switch',
          value: {
            get: ({ data, focusArea }: EditorResult<Data>) => {
              return getImageConfig(data, focusArea, 'useCustomSrc');
            },
            set({ data, focusArea }: EditorResult<Data>, value: boolean) {
              setImageConfig(data, focusArea, 'useCustomSrc', value);
            }
          }
        },
        {
          title: '自定义地址',
          type: 'textarea',
          ifVisible({ data, focusArea }: EditorResult<Data>) {
            return getImageConfig(data, focusArea, 'useCustomSrc');
          },
          options: {
            placeholder: '例：https://www.baidu.com/{id}'
          },
          value: {
            get: ({ data, focusArea }: EditorResult<Data>) => {
              return getImageConfig(data, focusArea, 'customSrc');
            },
            set({ data, focusArea }: EditorResult<Data>, value: string) {
              setImageConfig(data, focusArea, 'customSrc', value);
            }
          }
        }
      ]
    },
    {
      title: '渐进式加载',
      type: 'switch',
      description: '用于配置小图地址，开启后先加载小图后加载大图',
      value: {
        get: ({ data, focusArea }: EditorResult<Data>) => {
          return getImageConfig(data, focusArea, 'usePlaceholder');
        },
        set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          setImageConfig(data, focusArea, 'usePlaceholder', value);
        }
      }
    },
    {
      title: '渐进式加载图片配置',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        return getImageConfig(data, focusArea, 'usePlaceholder');
      },
      items: [
        {
          title: '来源',
          type: 'select',
          options: [
            {
              label: '表格字段',
              value: 'rowKey'
            },
            {
              label: '自定义地址',
              value: 'href'
            }
          ],
          value: {
            get: ({ data, focusArea }: EditorResult<Data>) => {
              return getImageConfig(data, focusArea, 'placeholderSourceType');
            },
            set({ data, focusArea }: EditorResult<Data>, value: string) {
              setImageConfig(data, focusArea, 'placeholderSourceType', value);
            }
          }
        },
        {
          title: '表格字段',
          type: 'text',
          options: {
            placeholder: '例：id'
          },
          ifVisible({ data, focusArea }: EditorResult<Data>) {
            const item = getImageConfig(
              data,
              focusArea,
              'placeholderSourceType'
            );
            return ['rowKey'].includes(item);
          },
          value: {
            get: ({ data, focusArea }: EditorResult<Data>) => {
              return getImageConfig(data, focusArea, 'placeholderRowKey');
            },
            set({ data, focusArea }: EditorResult<Data>, value: string) {
              setImageConfig(data, focusArea, 'placeholderRowKey', value);
            }
          }
        },
        {
          title: '自定义地址',
          type: 'textarea',
          options: {
            placeholder: '例：https://www.baidu.com/{id}'
          },
          ifVisible({ data, focusArea }: EditorResult<Data>) {
            const item = getImageConfig(
              data,
              focusArea,
              'placeholderSourceType'
            );
            return ['href'].includes(item);
          },
          value: {
            get: ({ data, focusArea }: EditorResult<Data>) => {
              return getImageConfig(data, focusArea, 'placeholderHref');
            },
            set({ data, focusArea }: EditorResult<Data>, value: string) {
              setImageConfig(data, focusArea, 'placeholderHref', value);
            }
          }
        }
      ]
    }
  ]
};

export default ImageItemEditor;
