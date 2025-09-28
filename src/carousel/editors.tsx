import { Data } from './runtime';
import { uuid, unitConversion, isBase64Image } from '../utils';

const regex = /^data:image\/(png|jpeg|jpg|gif|bmp|webp|svg)/;

export default {
  '@init'({ data, style, input, output, slot }) {
    style.height = 200;
    // console.log(slot)
    // data.items = data.items.map(item => {
    //   if (!item.slotId) {
    //     const slotId = uuid()
    //     item.slotId = slotId
    //     slot.add(slotId, `轮播图${slotId}`)
    //   }
    //   return item
    // })
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root'({ data }, cate0) {
    cate0.title = '常规';
    cate0.items = [
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
          onSelect: (_id, index) => {
            if (index !== -1) {
              data.slideIndex = index;
            }
          },
          items: [
            {
              title: '图片',
              type: 'imageSelector',
              value: 'url'
            },
            {
              title: '展示',
              type: 'select',
              options: [
                { label: '适应', value: 'contain' },
                { label: '填充', value: 'cover' },
                { label: '铺满', value: '100% 100%' },
                { label: '铺满x轴', value: '100% auto' },
                { label: '铺满y轴', value: 'auto 100%' }
              ],
              value: 'bgSize'
            },
            {
              title: '样式',
              type: 'Style',
              options: {
                plugins: ['bgcolor']
              },
              value: 'bgColor'
            }
            // {
            //   title: '跳转链接',
            //   type: 'textarea',
            //   options: {
            //     placeholder: "目前支持http、https、kwai链接"
            //   },
            //   ifVisible: (item) => {
            //     return item.evtType === EVT_TYPE.JUMP
            //   },
            //   value: 'jumpUrl'
            // },
          ]
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.items;
          },
          set({ data, slot }: EditorResult<Data>, val: any) {
            const newItems = [];
            data.items.map((item) => {
              if (!val.find((v) => v.slotId === item.slotId)) {
                slot.remove(item.slotId);
              }
            });
            val.map((item) => {
              if (!item.slotId) {
                const slotId = uuid();
                item.slotId = slotId;
              }
              if (!slot.get(item.slotId)) {
                slot.add(item.slotId, `轮播图${item.slotId}`);
              }
              newItems.push({ ...(item ?? {}) });
            });
            data.items = newItems;
          }
        }
      },
      {
        title: '自动切换',
        type: 'Switch',
        value: {
          get({ data }) {
            return data.autoplay;
          },
          set({ data }, val) {
            data.autoplay = val;
          }
        }
      },
      {
        title: '时间间隔',
        type: 'InputNumber',
        options: [{ min: 1000, max: 20000, step: 1000, addonAfter: 'ms', width: 150 }],
        ifVisible({ data }) {
          return data.autoplay;
        },
        value: {
          get({ data }) {
            return [data.autoplaySpeed];
          },
          set({ data }, val) {
            data.autoplaySpeed = val[0];
          }
        }
      },
      {
        title: '分页器配置',
        items: [
          {
            title: '位置',
            type: 'Select',
            options: [
              { label: '上', value: 'top' },
              { label: '下', value: 'bottom' }
              // { label: '左', value: 'left' },
              // { label: '右', value: 'right' }
            ],
            value: {
              get({ data }: EditorResult<Data>) {
                return data.dotPosition;
              },
              set({ data }: EditorResult<Data>, val) {
                data.dotPosition = val;
              }
            }
          },
          {
            title: '高度',
            type: 'Text',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.dotsStyle?.height || '2px';
              },
              set({ data }: EditorResult<Data>, value) {
                if (value) {
                  data.dotsStyle.height = unitConversion(value);
                }
              }
            }
          },
          {
            title: '背景色',
            type: 'colorPicker',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.dotsStyle?.background || '#ffffff';
              },
              set({ data }: EditorResult<Data>, value) {
                data.dotsStyle.background = value;
              }
            }
          }
          // {
          //   title: '样式',
          //   catelogChange: {
          //     value: {
          //       get({ data }) {
          //         return data.catelogDot;
          //       },
          //       set({ data, catelog }) {
          //         console.log(catelog)
          //         data.catelogDot = catelog;
          //       },
          //     },
          //   },
          //   items: [
          //     {
          //       title: '默认样式',
          //       type: 'colorPicker',
          //       catelog: '默认',
          //       value: {
          //         get({ data }) {
          //           return 'rgba(255,255,255,1)';
          //         },
          //         set({ data }, value) {
          //           // data.dotStyle = value;
          //         },
          //       },
          //     },
          //     {
          //       title: '聚焦样式',
          //       type: 'colorPicker',
          //       catelog: '聚焦',
          //       value: {
          //         get({ data }) {
          //           // return data.dotActiveStyle;
          //         },
          //         set({ data }, value) {
          //           console.log(value)
          //           // data.dotActiveStyle = value;
          //         },
          //       },
          //     },
          //   ],
          // },
        ]
      }
    ];
  }
  // '.ant-carousel .slick-slider  .slick-dots': {
  //   title: '分页器',
  //   items: [
  //     [
  //       {
  //         title: '位置',
  //         type: 'Select',
  //         value: {
  //           get({ data }: EditorResult<Data>) {
  //             return data.autoplay
  //           },
  //           set({ data }: EditorResult<Data>, val) {
  //             data.autoplay = val
  //           },
  //         }
  //       }
  //     ]
  //   ]
  // }
};
