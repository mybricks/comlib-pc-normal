import { uuid } from '../utils';
import { ImageItem, Data, STYLE, DEFAULT_IMAGE, InputIds } from './constants';

interface Result {
  data: Data;
  input: any;
  output: any;
  focusArea?: any;
}
const addImage = ({ data }: { data: Data }) => {
  const id = uuid();
  const title = '图片';
  const defaultImage: ImageItem = {
    id,
    title,
    src: data.dataSource === 1 ? DEFAULT_IMAGE : '',
    width: STYLE.WIDTH,
    height: STYLE.HEIGHT,
    alt: '',
    preview: false,
    margin: [0, 0, 0, 0],
    customBorderStyle: {}
  };
  if (Array.isArray(data.images)) {
    data.images.push(defaultImage);
  } else {
    data.images = defaultImage;
  }
};

const getItemProp = ({
  data,
  focusArea,
  dataset,
  val,
  cb
}: {
  data: Data;
  focusArea: any;
  dataset: string;
  val: string;
  cb?: any;
}) => {
  if (!focusArea) return;
  const key = focusArea.dataset[dataset];
  if (Array.isArray(data.images)) {
    const index = data.images.findIndex((def) => def.id === key);
    if (index === -1) return;
    if (cb) cb(index);
    if (val === 'obj') {
      return data.images[index];
    }
    return data.images[index][val];
  } else {
    if (val === 'obj') {
      return data.images;
    }
    return data.images[val];
  }
};

const moveDelete = (dataset: string) => {
  return [
    {
      title: '前移',
      type: 'Button',
      ifVisible({ data, focusArea }: Result) {
        let bool = false;
        getItemProp({
          data,
          focusArea,
          dataset,
          val: 'obj',
          cb: (index) => {
            if (
              Array.isArray(data.images) &&
              data.images.length > 1 &&
              index !== 0
            ) {
              bool = true;
            }
          }
        });
        return bool;
      },
      value: {
        set({ data, focusArea }: Result) {
          getItemProp({
            data,
            focusArea,
            dataset,
            val: 'obj',
            cb: (index) => {
              if (Array.isArray(data.images)) {
                const img = data.images[index];
                data.images.splice(index, 1);
                data.images.splice(index - 1, 0, img);
              }
            }
          });
        }
      }
    },
    {
      title: '后移',
      type: 'Button',
      ifVisible({ data, focusArea }: Result) {
        let bool = false;
        getItemProp({
          data,
          focusArea,
          dataset,
          val: 'obj',
          cb: (index) => {
            if (
              Array.isArray(data.images) &&
              data.images.length > 1 &&
              index !== data.images.length - 1
            ) {
              bool = true;
            }
          }
        });
        return bool;
      },
      value: {
        set({ data, focusArea }: Result) {
          getItemProp({
            data,
            focusArea,
            dataset,
            val: 'obj',
            cb: (index) => {
              if (Array.isArray(data.images)) {
                const img = data.images[index];
                data.images.splice(index, 1);
                data.images.splice(index + 1, 0, img);
              }
            }
          });
        }
      }
    },
    {
      title: '删除',
      type: 'Button',
      value: {
        set({ data, focusArea, output }: Result) {
          getItemProp({
            data,
            focusArea,
            dataset,
            val: 'obj',
            cb: (index) => {
              if (Array.isArray(data.images)) {
                data.images.splice(index, 1);
              }
            }
          });
        }
      }
    }
  ];
};

export default {
  '@init': ({ data, output, input }: Result) => {
    addImage({ data });
  },
  ':root': [
    {
      title: '数据来源',
      type: 'Select',
      options: [
        { label: '手动搭建', value: 1 },
        { label: '动态获取', value: 2 }
      ],
      value: {
        get({ data }: Result) {
          return data.dataSource;
        },
        set({ data, input }: Result, value: 1 | 2) {
          data.dataSource = value;
          if (value === 2) {
            if (Array.isArray(data.images)) {
              data.images.forEach((item) => {
                item.src = '';
              });
            } else {
              data.images.src = '';
            }
            if (!input.get(InputIds.Image)) {
              input.add(InputIds.Image, '数据输入', {
                type: 'array',
                items: {
                  title: '图片链接',
                  type: 'string'
                }
              });
            }
          }
        }
      }
    },
    {
      title: '配置方式',
      type: 'Select',
      options: [
        { label: '单个配置', value: 1 },
        { label: '统一配置', value: 2 }
      ],
      ifVisible({ data }: Result) {
        return data.dataSource === 2;
      },
      value: {
        get({ data }: Result) {
          return data.configMode;
        },
        set({ data }: Result, value: 1 | 2) {
          data.configMode = value;
        }
      }
    },
    {
      title: '图片配置项',
      ifVisible({ data, focusArea }: Result) {
        return data.configMode === 2 && data.dataSource === 2;
      },
      items: [
        {
          title: '宽度',
          type: 'Text',
          value: {
            get({ data }: Result) {
              return data.config.width || 200;
            },
            set({ data }: Result, value: string) {
              data.config.width = value;
            }
          }
        },
        {
          title: '高度',
          type: 'Text',
          value: {
            get({ data }: Result) {
              return data.config.height || 200;
            },
            set({ data }: Result, value: string) {
              data.config.height = value;
            }
          }
        },
        {
          title: '',
          type: 'style',
          options: ['border'],
          value: {
            get({ data }: Result) {
              return data.config.customBorderStyle;
            },
            set({ data }: Result, theme: any) {
              data.config.customBorderStyle = theme;
            }
          }
        },
        {
          title: '间距',
          type: 'Inputnumber',
          options: [
            { title: '上', min: 0, max: 50, width: 50 },
            { title: '下', min: 0, max: 50, width: 50 },
            { title: '左', min: 0, max: 50, width: 50 },
            { title: '右', min: 0, max: 50, width: 50 }
          ],
          value: {
            get({ data, focusArea }: Result) {
              return data.config.margin;
            },
            set(
              { data, focusArea }: Result,
              value: [number, number, number, number]
            ) {
              data.config.margin = value;
            }
          }
        },
        {
          title: '支持预览',
          type: 'Switch',
          value: {
            get({ data }: Result) {
              return data.config.preview;
            },
            set({ data }: Result, value: boolean) {
              data.config.preview = value;
            }
          }
        },
        {
          title: '支持容错处理',
          type: 'Switch',
          value: {
            get({ data, focusArea }) {
              return getItemProp({
                data,
                focusArea,
                dataset: 'imgId',
                val: 'supportFallback'
              });
            },
            set({ data, focusArea }: Result, value: boolean) {
              const res = getItemProp({
                data,
                focusArea,
                dataset: 'imgId',
                val: 'obj'
              });
              res.supportFallback = value;
            }
          }
        },
        {
          title: '容错图像占位符',
          type: 'Text',
          description: '加载失败显示图像占位符',
          ifVisible({ data }: Result) {
            return !!data.config.supportFallback;
          },
          value: {
            get({ data }: Result) {
              return data.config.fallback;
            },
            set({ data }: Result, value: string) {
              data.config.fallback = value;
            }
          }
        }
      ]
    },
    {
      title: '添加图片',
      type: 'Button',
      value: {
        set({ data }: Result) {
          addImage({ data });
        }
      }
    }
  ],
  '[data-img-id]': {
    title: '图片项配置',
    items: [
      {
        title: '图片地址',
        type: 'imageSelector',
        ifVisible({ data }: Result) {
          return data.dataSource === 1;
        },
        value: {
          get({ data, focusArea }: Result) {
            if (!focusArea) return;
            return getItemProp({
              data,
              focusArea,
              dataset: 'imgId',
              val: 'src'
            });
          },
          set({ data, focusArea }: Result, value: string) {
            if (!focusArea) return;
            const res = getItemProp({
              data,
              focusArea,
              dataset: 'imgId',
              val: 'obj'
            });
            res.src = value;
          }
        }
      },
      {
        title: '基本样式',
        items: [
          {
            title: '宽度',
            type: 'Text',
            value: {
              get({ data, focusArea }: Result) {
                return getItemProp({
                  data,
                  focusArea,
                  dataset: 'imgId',
                  val: 'width'
                });
              },
              set({ data, focusArea }: Result, value: string) {
                const res = getItemProp({
                  data,
                  focusArea,
                  dataset: 'imgId',
                  val: 'obj'
                });
                res.width = value;
              }
            }
          },
          {
            title: '高度',
            type: 'Text',
            value: {
              get({ data, focusArea }: Result) {
                return getItemProp({
                  data,
                  focusArea,
                  dataset: 'imgId',
                  val: 'height'
                });
              },
              set({ data, focusArea }: Result, value: string) {
                const res = getItemProp({
                  data,
                  focusArea,
                  dataset: 'imgId',
                  val: 'obj'
                });
                res.height = value;
              }
            }
          },
          {
            title: '',
            type: 'style',
            options: ['border'],
            value: {
              get({ data, focusArea }) {
                return getItemProp({
                  data,
                  focusArea,
                  dataset: 'imgId',
                  val: 'customBorderStyle'
                });
              },
              set({ data, focusArea }, theme: string) {
                const res = getItemProp({
                  data,
                  focusArea,
                  dataset: 'imgId',
                  val: 'obj'
                });
                res.customBorderStyle = theme;
              }
            }
          },
          {
            title: '间距',
            type: 'Inputnumber',
            options: [
              { title: '上', min: 0, max: 50, width: 50 },
              { title: '下', min: 0, max: 50, width: 50 },
              { title: '左', min: 0, max: 50, width: 50 },
              { title: '右', min: 0, max: 50, width: 50 }
            ],
            value: {
              get({ data, focusArea }) {
                return getItemProp({
                  data,
                  focusArea,
                  dataset: 'imgId',
                  val: 'margin'
                });
              },
              set({ data, focusArea }: Result, value: number[]) {
                const res = getItemProp({
                  data,
                  focusArea,
                  dataset: 'imgId',
                  val: 'obj'
                });
                res.margin = value;
              }
            }
          }
        ]
      },
      {
        title: '自定义配置',
        items: [
          {
            title: '支持预览',
            type: 'Switch',
            value: {
              get({ data, focusArea }) {
                return getItemProp({
                  data,
                  focusArea,
                  dataset: 'imgId',
                  val: 'preview'
                });
              },
              set({ data, focusArea }: Result, value: boolean) {
                const res = getItemProp({
                  data,
                  focusArea,
                  dataset: 'imgId',
                  val: 'obj'
                });
                res.preview = value;
              }
            }
          },
          {
            title: '预览图片地址',
            type: 'Text',
            description: '默认为图片地址',
            ifVisible({ data, focusArea }: Result) {
              return !!getItemProp({
                data,
                focusArea,
                dataset: 'imgId',
                val: 'preview'
              });
            },
            value: {
              get({ data, focusArea }) {
                const preview = getItemProp({
                  data,
                  focusArea,
                  dataset: 'imgId',
                  val: 'preview'
                });
                if (typeof preview === 'boolean') {
                  return getItemProp({
                    data,
                    focusArea,
                    dataset: 'imgId',
                    val: 'src'
                  });
                }
                return preview.src;
              },
              set({ data, focusArea }: Result, value: string) {
                const res = getItemProp({
                  data,
                  focusArea,
                  dataset: 'imgId',
                  val: 'obj'
                });
                res.preview = {
                  src: value
                };
              }
            }
          },
          {
            title: '支持容错处理',
            type: 'Switch',
            value: {
              get({ data, focusArea }) {
                return getItemProp({
                  data,
                  focusArea,
                  dataset: 'imgId',
                  val: 'supportFallback'
                });
              },
              set({ data, focusArea }: Result, value: boolean) {
                const res = getItemProp({
                  data,
                  focusArea,
                  dataset: 'imgId',
                  val: 'obj'
                });
                res.supportFallback = value;
              }
            }
          },
          {
            title: '容错图像占位符',
            type: 'Text',
            description: '加载失败显示图像占位符',
            ifVisible({ data, focusArea }: Result) {
              return !!getItemProp({
                data,
                focusArea,
                dataset: 'imgId',
                val: 'supportFallback'
              });
            },
            value: {
              get({ data, focusArea }) {
                return getItemProp({
                  data,
                  focusArea,
                  dataset: 'imgId',
                  val: 'fallback'
                });
              },
              set({ data, focusArea }: Result, value: string) {
                const res = getItemProp({
                  data,
                  focusArea,
                  dataset: 'imgId',
                  val: 'obj'
                });
                res.fallback = value;
              }
            }
          }
        ]
      },

      ...moveDelete('imgId')
    ]
  }
};
