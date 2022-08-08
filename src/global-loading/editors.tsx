import { Data } from './constants';

const setDescByData = ({ data, setDesc }: { data: Data; setDesc }) => {
  const { loadingText } = data;
  const info = [`文案：${loadingText}`];
  setDesc(info.join('\n'));
};
export default {
  '@init'({ data, setDesc }: EditorResult<Data>) {
    setDescByData({ data, setDesc });
  },
  ':root': [
    {
      title: 'Loading文案',
      type: 'text',
      description: '可以通过逻辑连线，动态传入Loading文案',
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
      value: {
        get({ data }: EditorResult<Data>) {
          return data.size;
        },
        set(
          { data }: EditorResult<Data>,
          value: 'small' | 'default' | 'large'
        ) {
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
      title: '样式',
      type: 'Character',
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
