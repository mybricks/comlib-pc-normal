import { Editor, EditorType } from '../utils/editor';
import { Data, SlotIds, TypeOptions } from './constants';

export default {
  '@resize': {
    options: ['width']
  },
  ':root': ({}: EditorResult<Data>, cate1, cate2, cate3) => {
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

    cate2.title = '样式';
    cate2.items = [
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
        title: '字体配置',
        type: 'switch',
        description: "开启开关后，配置对应文本内容的颜色",
        value: {
          get: ({ data }: EditorResult<Data>) => {
            return data.isCustom;
          },
          set: ({ data }: EditorResult<Data>, value) => {
            data.isCustom = value;
          }
        }
      },
      {
        title: '标题样式',
        type: 'style',
        ifVisible({ data }: EditorResult<Data>) {
          return data.isCustom;
        },
        options: {
          plugins: ['font'],
          fontProps: {
            fontFamily: false,
            verticalAlign: false,
            horizontalAlign: false,
          }
        },
        value: {
          get: ({ data }: EditorResult<Data>) => {
            return data.titleStyle;
          },
          set: ({ data }: EditorResult<Data>, value) => {
            let lineHeight = Number(value.fontSize.slice(0, -2)) * 1.5715 + 'px';
            data.titleStyle = {...value, lineHeight: lineHeight};
          }
        }
      },
      {
        title: '辅助介绍文案样式',
        type: 'style',
        ifVisible({ data }: EditorResult<Data>) {
          return data.isCustom && data.showInfo;
        },
        options: {
          plugins: ['font'],
          fontProps: {
            fontFamily: false,
            verticalAlign: false,
            horizontalAlign: false,
            color: false
          }
        },
        value: {
          get: ({ data }: EditorResult<Data>) => {
            return data.descriptionStyle;
          },
          set: ({ data }: EditorResult<Data>, value) => {
            let lineHeight = Number(value.fontSize.slice(0, -2)) * 1.5715 + 'px';
            data.descriptionStyle = {...value, lineHeight: lineHeight};
          }
        }
      },
    ];

    cate3.title = '高级';
    cate3.items = [
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
      title: '告警提示'
    };
  }
};
