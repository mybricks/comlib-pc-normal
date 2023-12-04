import { Data, InputIds } from './constants';

const setDescByData = ({ data, setDesc }: { data: Data; setDesc }) => {
  const { loadingText, closeLoading } = data;
  const info = closeLoading ? ['关闭全局loading'] : [`文案：${loadingText}`];
  setDesc(info.join('\n'));
};
export default {
  '@init'({ data, setDesc }: EditorResult<Data>) {
    setDescByData({ data, setDesc });
  },
  ':root': [
    {
      title: '关闭',
      type: 'Switch',
      description: '开启后，关闭全局loading',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.closeLoading;
        },
        set({ data, input, setDesc }: EditorResult<Data>, value: boolean) {
          data.closeLoading = value;
          input.get(InputIds.Trigger).setTitle(value ? '关闭' : '打开');
          setDescByData({ data, setDesc });
        }
      }
    },
    {
      title: 'Loading文案',
      type: 'text',
      description: '可以通过逻辑连线，动态传入Loading文案',
      options: {
        locale: true
      },
      ifVisible({ data }: EditorResult<Data>) {
        return !data.closeLoading;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.loadingText;
        },
        set({ data, setDesc }: EditorResult<Data>, value: string) {
          data.loadingText = value;
          setDescByData({ data, setDesc });
        }
      }
    },
    {
      title: '尺寸',
      type: 'select',
      options: [
        {
          label: '大',
          value: 'large'
        },
        {
          label: '中',
          value: 'default'
        },
        {
          label: '小',
          value: 'small'
        }
      ],
      ifVisible({ data }: EditorResult<Data>) {
        return !data.closeLoading;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.size;
        },
        set({ data }: EditorResult<Data>, value: 'small' | 'default' | 'large') {
          data.size = value;
        }
      }
    },
    {
      title: '间距',
      type: 'Inputnumber',
      description: '绝对定位，0 为不设置',
      options: [
        { title: '上', min: 0, width: 50 },
        { title: '右', min: 0, width: 50 },
        { title: '下', min: 0, width: 50 },
        { title: '左', min: 0, width: 50 }
      ],
      ifVisible({ data }: EditorResult<Data>) {
        return !data.closeLoading;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          const { top, left, right, bottom } = data.style;
          return [top || 0, right || 0, bottom || 0, left || 0];
        },
        set({ data }, value: number[]) {
          const [top, right, bottom, left] = value;
          data.style = {
            ...data.style,
            top: top || undefined,
            right: right || undefined,
            bottom: bottom || undefined,
            left: left || undefined
          };
        }
      }
    },
    {
      title: '文案',
      type: 'style',
      options: ['font'],
      ifVisible({ data }: EditorResult<Data>) {
        return !data.closeLoading;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.style;
        },
        set({ data }: EditorResult<Data>, value: any) {
          data.style = {
            ...data.style,
            ...value
          };
        }
      }
    },
    {
      title: '遮罩层样式',
      type: 'style',
      options: ['BGCOLOR'],
      ifVisible({ data }: EditorResult<Data>) {
        return !data.closeLoading;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.maskStyle;
        },
        set({ data }: EditorResult<Data>, value: any) {
          data.maskStyle = {
            ...data.maskStyle,
            ...value
          };
        }
      }
    }
  ]
};
