import { Data, Placement, Trigger } from './constants';

export default {
  '@init': ({ data, style }: EditorResult<Data>) => {
    style.width = 200;
  },
  '@resize': {
    options: ['width'],
  },
  ':root'({ data }, ...cate) {
    cate[0].title = '配置';
    cate[0].items = [
      {
        title: '标题自定义',
        type: 'switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useTitleSlot;
          },
          set({ data, slot }: EditorResult<Data>, val: boolean) {
            if (val) {
              slot.add('title', '标题');
            } else {
              slot.remove('title');
            }
            data.useTitleSlot = val;
          },
        },
      },
      {
        title: '标题',
        type: 'Text',
        ifVisible({ data }: EditorResult<Data>) {
          return !data.useTitleSlot;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.title;
          },
          set({ data }: EditorResult<Data>, val: string) {
            data.title = val;
          },
        },
      },
      {
        title: '内容自定义',
        type: 'switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useContentSlot;
          },
          set({ data, slot }: EditorResult<Data>, val: boolean) {
            if (val) {
              slot.add('content', '内容');
            } else {
              slot.remove('content');
            }
            data.useContentSlot = val;
          },
        },
      },
      {
        title: '内容',
        type: 'Text',
        ifVisible({ data }: EditorResult<Data>) {
          return !data.useContentSlot;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.content;
          },
          set({ data }: EditorResult<Data>, val: string) {
            data.content = val;
          },
        },
      },
      {
        title: '触发方式',
        type: 'Select',
        options: [
          {
            label: '悬浮',
            value: 'hover',
          },
          {
            label: '点击',
            value: 'click',
          },
          {
            label: '聚焦',
            value: 'focus',
          },
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.trigger;
          },
          set({ data }: EditorResult<Data>, val: Trigger) {
            data.trigger = val;
          },
        },
      },
      {
        title: '方向',
        type: 'select',
        options: [
          {
            label: '上',
            value: 'top',
          },
          {
            label: '下',
            value: 'bottom',
          },
          {
            label: '左',
            value: 'left',
          },
          {
            label: '右',
            value: 'right',
          },
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.placement;
          },
          set({ data }: EditorResult<Data>, val: Placement) {
            data.placement = val;
          },
        },
      },
    ];
  },
};
