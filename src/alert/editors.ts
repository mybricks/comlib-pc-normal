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
        title: '辅助介绍字体',
        options: ['font'],
        // ifVisible({ data }: EditorResult<Data>) {
        //   return data.showInfo;
        // },
        target: '.ant-alert-description'
      },
      {
        title: '图标尺寸',
        type: 'text',
        description: '图标尺寸,支持百分比和定宽',
        value: {
          get({ data }: EditorResult<Data>) {
            return String(data.size);
          },
          set({ data }: EditorResult<Data>, value: string) {
            if (/^\d+$/.test(value)) {
              data.size = `${value}px`;
            } else {
              data.size = value;
            }
          }
        }
      }
    ],
    items: ({}: EditorResult<Data>, cate1, cate2) => {
      cate1.title = '常规';
      cate1.items = [
        {
          title: '标题',
          type: 'TextArea',
          value: {
            get({ data }: EditorResult<Data>) {
              return decodeURIComponent(data.message);
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.message = encodeURIComponent(value);
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
          value: {
            get({ data }: EditorResult<Data>) {
              return decodeURIComponent(data.content);
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.content = encodeURIComponent(value);
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
