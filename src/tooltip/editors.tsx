import { Data, Trigger, Placement } from './types';
export default {
  '@init': ({ data, style }: EditorResult<Data>) => {
    style.width = 'fit-content';
  },
  '@resize': {
    options: ['width']
  },
  ':root': {
    items({ data }, ...cate) {
      cate[0].title = '配置';
      cate[0].items = [
        {
          title: '提示内容',
          type: 'Text',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.title;
            },
            set({ data }: EditorResult<Data>, val: string) {
              data.title = val;
            }
          }
        },
        {
          title: '触发方式',
          type: 'Select',
          options: [
            {
              label: '悬浮',
              value: 'hover'
            },
            {
              label: '点击',
              value: 'click'
            },
            {
              label: '聚焦',
              value: 'focus'
            }
          ],
          value: {
            get({ data }: EditorResult<Data>) {
              return data.trigger;
            },
            set({ data }: EditorResult<Data>, val: Trigger) {
              data.trigger = val;
            }
          }
        },
        {
          title: '方向',
          type: 'select',
          options: [
            {
              label: '左上',
              value: 'leftTop'
            },
            {
              label: '上',
              value: 'top'
            },
            {
              label: '右上',
              value: 'rightTop'
            },
            {
              label: '左下',
              value: 'leftBottom'
            },
            {
              label: '下',
              value: 'bottom'
            },
            {
              label: '右下',
              value: 'rightBottom'
            },
            {
              label: '左',
              value: 'left'
            },
            {
              label: '右',
              value: 'right'
            }
          ],
          value: {
            get({ data }: EditorResult<Data>) {
              return data.placement;
            },
            set({ data }: EditorResult<Data>, val: Placement) {
              data.placement = val;
            }
          }
        }
      ];
    },
    style: {
      options: ['font', 'size', { type: 'background', config: { disableBackgroundImage: true } }],
      target: '.ant-tooltip .ant-tooltip-inner',
      domTarget: '.ant-tooltip .ant-tooltip-inner'
    }
  }
};
