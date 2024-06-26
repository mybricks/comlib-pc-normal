import { title } from 'process';
import { Data } from './constants';

const setSlotLayout = (slot, val) => {
  if (!slot) return;
  if (val.position === 'smart') {
    slot.setLayout('smart');
  } else if (val.position === 'absolute') {
    slot.setLayout(val.position);
  } else if (val.display === 'flex') {
    if (val.flexDirection === 'row') {
      slot.setLayout('flex-row');
    } else if (val.flexDirection === 'column') {
      slot.setLayout('flex-column');
    }
  }
};

export default {
  ':slot': {},
  '@init'({ style }) {
    style.width = '520px';
    style.height = '360px';
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': {
    style: [],
    items: ({}, cate1) => {
      cate1.title = '常规';
      cate1.items = [
        {
          title: '布局',
          type: 'layout',
          options: [],
          value: {
            get({ data, slots }: EditorResult<Data>) {
              return data.contentSlotStyle || {};
            },
            set({ data, slots }: EditorResult<Data>, val: any) {
              data.contentSlotStyle = val;
              const slotInstance = slots.get('content');
              setSlotLayout(slotInstance, val);
            }
          }
        },
        {
          title: '保存文件名',
          description: '设置保存为文件时文件名',
          type: 'text',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.documentTitle;
            },
            set({ data }, value: string) {
              data.documentTitle = value;
            }
          }
        },
        {
          title: '等待渲染时间(ms)',
          description: '设置等待渲染的时间，默认500ms',
          type: 'inputNumber',
          options: [{ width: 100, min: 0 }],
          value: {
            get({ data }: EditorResult<Data>) {
              return [data.waitRenderTime];
            },
            set({ data }, value: number) {
              data.waitRenderTime = value[0];
            }
          }
        }
      ];
    }
  }
};
