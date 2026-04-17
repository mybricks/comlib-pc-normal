import { Data } from './constants';
import { uuid, unitConversion, isBase64Image } from '../utils';
const regex = /^data:image\/(png|jpeg|jpg|gif|bmp|webp|svg)/;

export default {
  '@resize': {
    options: ['width', 'height']
  },
  ':root': {
    style: [
      {

        catelog: '默认',
        options: ['padding', 'border', 'background'],
        target: '.linkWrapper',
        initValue: { color: '#1890ff' }
      }
    ],
    items: ({ }: EditorResult<Data>, cate1) => {
      cate1.title = '常规';
      const normEditor = [
        {
          title: '轮播项',
          type: 'array',
          options: {
            selectable: true,
            getTitle: (item, index) => {
              let formattedUrl = isBase64Image(item.url || '')
                ? (item.url || '').match(regex)[0] + '(超长省略) '
                : item.url;
              return [formattedUrl, `轮播图${index + 1}`];
            },
            items: [
              {
                title: '图片',
                type: 'imageSelector',
                value: 'url'
              }
            ]
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.items;
            },
            set({ data, slot }: EditorResult<Data>, val: any) {
              const newItems = [];
              data.items.map((item) => {
                if (!val.find((v) => v.id === item.id)) {
                  slot.remove(item.id);
                }
              });
              val.map((item) => {
                if (!item.slotId) {
                  const id = uuid();
                  item.id = id;
                }
                if (!slot.get(item.id)) {
                  slot.add(item.id, `轮播图${item.id}`);
                }
                newItems.push({ ...(item ?? {}) });
              });
              data.items = newItems.map(item => {
                return item
              });
            }
          }
        },
        {
          title: '开启自动播放',
          type: 'Switch',
          description: '打开后，轮播图会自动播放',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.autoplay;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.autoplay = value;
            }
          },
          binding: {
            with: 'data.autoplay',
            schema: {
              type: 'boolean'
            }
          }
        },
        {
          title: '开启无限循环',
          type: 'Switch',
          description: '打开后，轮播图会无限循环',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.loop;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.loop = value;
            }
          },
          binding: {
            with: 'data.loop',
            schema: {
              type: 'boolean'
            }
          }
        },
        {
          title: '切换速度',
          type: 'Slider',
          description: '默认切换动画速度是300ms',
          options: {
            max: 5000,
            min: 300,
            step: 100,
            formatter: 'ms'
          },
          ifVisible({ data }: EditorResult<Data>) {
            return data.autoplay;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.speed;
            },
            set({ data }: EditorResult<Data>, value: number) {
              data.speed = value;
            }
          },
        },
        {
          title: '使用缩略图轮播指示器',
          description: '默认是普通指示器模式，开启后是缩略图模式',
          type: 'switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.mode;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.mode = value;
            }
          },
        },
        {
          title: '缩略图轮播-设置子项数量',
          type: 'number',
          description: '一屏显示多少个子项',
          ifVisible({ data }: EditorResult<Data>) {
            return data.mode;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.slidesPerView;
            },
            set({ data }: EditorResult<Data>, value: number) {
              data.slidesPerView = value;
            }
          },
        },
      ];
      cate1.items = normEditor;
    }
  }
};
