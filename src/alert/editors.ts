import { Editor, EditorType } from '../utils/editor';
import { Data, SlotIds, TypeOptions } from './constants';

export default {
  '@resize': {
    options: ['width']
  },
  ':root': {
    style: [
      Editor<Data>('固定宽度', EditorType.Switch, 'openWidth'),
      Editor<Data>('百分比宽度', EditorType.Number, 'percentWidth', {
        ifVisible({ data }: EditorResult<Data>) {
          return !data.openWidth;
        }
      }),
      Editor<Data>('固定宽度', EditorType.Number, 'width', {
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.openWidth;
        }
      }),
      {
        title: '标题字体',
        options: ['font'],
        target: '.ant-alert-message'
      },
      {
        ifVisible({ data }: EditorResult<Data>) {
          return data.type === 'info';
        },
        options: ['border',{ type: 'background', config: { disableBackgroundImage: true } }],
        target: '.ant-alert-info'
      },
      {
        ifVisible({ data }: EditorResult<Data>) {
          return data.type === 'success';
        },
        options: ['border',{ type: 'background', config: { disableBackgroundImage: true } }],
        target: '.ant-alert-success'
      },
      {
        ifVisible({ data }: EditorResult<Data>) {
          return data.type === 'error';
        },
        options: ['border',{ type: 'background', config: { disableBackgroundImage: true } }],
        target: '.ant-alert-error'
      },
      {
        ifVisible({ data }: EditorResult<Data>) {
          return data.type === 'warning';
        },
        options: ['border',{ type: 'background', config: { disableBackgroundImage: true } }],
        target: '.ant-alert-warning'
      },
      {
        title: '辅助介绍字体',
        options: ['font'],
        ifVisible({ data }: EditorResult<Data>) {
          return data.showInfo;
        },
        target: '.ant-alert-description'
      },
      {
        title: '关闭按钮',
        options: [{ type: 'font', config: { disableTextAlign: true } }],
        ifVisible({ data }: EditorResult<Data>) {
          return data.closable;
        },
        target: '.ant-alert-action',
        initValue: {
          fontSize: 16
        }
      },
      // {
      //   title: '图标尺寸',
      //   type: 'text',
      //   description: '图标尺寸,支持百分比和定宽',
      //   value: {
      //     get({ data }: EditorResult<Data>) {
      //       return String(data.size);
      //     },
      //     set({ data }: EditorResult<Data>, value: string) {
      //       if (/^\d+$/.test(value)) {
      //         data.size = `${value}px`;
      //       } else {
      //         data.size = value;
      //       }
      //       console.log(data.size);
      //     }
      //   }
      // },
      {
        title: '图标',
        options: [{ type: 'font', config: { disableTextAlign: true } }],
        target: '.ant-alert-icon'
      }
    ],
    items: ({}: EditorResult<Data>, cate1, cate2) => {
      cate1.title = '常规';
      cate1.items = [
        {
          title: '标题',
          type: 'TextArea',
          options: {
            locale: true
          },
          value: {
            get({ data }: EditorResult<Data>) {
              if(typeof data.message !== 'string'){
                return data.message
              }else{
                return decodeURIComponent(data.message);
              }
            },
            set({ data }: EditorResult<Data>, value: string) {
              if(typeof value !== 'string'){
                data.message = value
              }else{
                data.message = encodeURIComponent(value);
              }
            }
          }
        },
        Editor<Data>('类型', EditorType.Select, 'type', {
          options: TypeOptions
        }),
        Editor<Data>('关闭按钮', EditorType.Switch, 'closable'),
        Editor<Data>('顶部公告', EditorType.Switch, 'banner'),
        Editor<Data>('辅助图标', EditorType.Switch, 'showIcon'),
        Editor<Data>('辅助介绍', EditorType.Switch, 'showInfo'),
        Editor<Data>('辅助介绍文案', EditorType.TextArea, 'content', {
          ifVisible({ data }: EditorResult<Data>) {
            return !!data.showInfo;
          },
          options: {
            locale: true
          },
          value: {
            get({ data }: EditorResult<Data>) {
              if(typeof data.content !== 'string'){
                return data.content
              }else{
                return decodeURIComponent(data.content);
              }
            },
            set({ data }: EditorResult<Data>, value: string) {
              if(typeof value !== 'string'){
                data.content = value
              }else{
                data.content = encodeURIComponent(value);
              }
            }
          }
        }),
        Editor<Data>('图标自定义', EditorType.Switch, 'isChoose'),
        Editor<Data>('选择图标', EditorType.Icon, 'icon', {
          ifVisible({ data }: EditorResult<Data>) {
            return data.isChoose;
          }
        })
      ];
  
      cate2.title = '高级';
      cate2.items = [
        Editor<Data>('介绍文案插槽', EditorType.Switch, 'useContentSlot', {
          value: {
            set({ data, slot }: EditorResult<Data>, val: boolean) {
              data.useContentSlot = val;
              const hasSlot = !!slot.get(SlotIds.DescSlot);
              if (val) {
                !hasSlot && slot.add(SlotIds.DescSlot, '介绍文案插槽');
              } else {
                hasSlot && slot.remove(SlotIds.DescSlot);
              }
            }
          }
        })
      ];
  
      return {
        title: '警告提示',
      };
    }
    
  }
};
