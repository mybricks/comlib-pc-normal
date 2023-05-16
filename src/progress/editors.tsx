import { Data, InputIds } from './constants';

const statusOptions = ({ data }: EditorResult<Data>) => {
  if (data.type === 'line') {
    return [
      {
        label: '成功',
        value: 'success'
      },
      {
        label: '失败',
        value: 'exception'
      },
      {
        label: '正常',
        value: 'normal'
      },
      {
        label: '激活',
        value: 'active'
      }
    ];
  } else {
    return [
      {
        label: '成功',
        value: 'success'
      },
      {
        label: '失败',
        value: 'exception'
      },
      {
        label: '正常',
        value: 'normal'
      }
    ];
  }
};

export default {
  '@init'({ style }) {
    style.width = '100%';
  },
  '@resize': {
    options: ['width']
  },
  ':root': [
    {
      title: '默认进度',
      type: 'inputnumber',
      options: [{ min: 1, max: 100, width: 180 }],
      value: {
        get({ data }: EditorResult<Data>) {
          return [data.percent];
        },
        set({ data }: EditorResult<Data>, value: number) {
          data.percent = value[0];
        }
      }
    },
    {
      title: '显示进度值',
      description: '是否显示进度数值或状态图标',
      type: 'switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.isShow;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.isShow = value;
        }
      }
    },
    {
      title: '类型',
      type: 'select',
      description: '进度条的类型',
      options: [
        {
          label: '进度条',
          value: 'line'
        },
        {
          label: '进度圈',
          value: 'circle'
        },
        {
          label: '仪表盘',
          value: 'dashboard'
        }
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.type;
        },
        set({ data }: EditorResult<Data>, value: 'line' | 'circle' | 'dashboard') {
          data.type = value;
        }
      }
    },
    {
      title: '尺寸',
      description: '进度条尺寸',
      type: 'select',
      ifVisible({ data }: EditorResult<Data>) {
        return data.type === 'line';
      },
      options: [
        {
          label: '正常',
          value: 'default'
        },
        {
          label: '迷你',
          value: 'small'
        }
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.size;
        },
        set({ data }: EditorResult<Data>, value: any) {
          data.size = value;
        }
      }
    },
    {
      title: '尺寸',
      description: '进度条尺寸',
      type: 'text',
      ifVisible({ data }: EditorResult<Data>) {
        return data.type !== 'line';
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return String(data.circleSize);
        },
        set({ data }: EditorResult<Data>, value: string) {
          if (/^\d+$/.test(value)) {
            data.circleSize = `${value}px`;
          } else {
            data.circleSize = value;
          }
        }
      }
    },
    {
      title: '步骤进度条',
      description: '开启后，可配置步数',
      ifVisible({ data }: EditorResult<Data>) {
        return data.type === 'line';
      },
      type: 'switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.isSteps;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.isSteps = value;
        }
      }
    },
    {
      title: '总步骤数',
      description: '进度条总共步数',
      ifVisible({ data }: EditorResult<Data>) {
        return data.type === 'line' && data.isSteps;
      },
      type: 'inputnumber',
      options: [{ min: 1, max: 100, width: 180 }],
      value: {
        get({ data }: EditorResult<Data>) {
          return [data.steps];
        },
        set({ data }: EditorResult<Data>, value: number) {
          data.steps = value[0];
        }
      }
    },
    {
      title: '状态',
      type: 'select',
      description: '状态, 当类型为可选(success | exception | normal | active(仅line态))',
      options: statusOptions,
      value: {
        get({ data }: EditorResult<Data>) {
          if (data.type !== 'line' && data.status === 'active') {
            return 'normal';
          } else {
            return data.status;
          }
        },
        set({ data }: EditorResult<Data>, value: 'success' | 'exception' | 'normal' | 'active') {
          data.status = value;
        }
      }
    },
    {
      title: '自定义颜色',
      type: 'switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.isColor;
        },
        set({ data, input }: EditorResult<Data>, value: boolean) {
          data.isColor = value;
          if (value && !input.get(InputIds.SetColor)) {
            input.add(InputIds.SetColor, '设置颜色', { type: 'string' });
          }
          if (!value && input.get(InputIds.SetColor)) {
            input.remove(InputIds.SetColor);
          }
        }
      }
    },
    {
      title: '颜色选择',
      type: 'colorpicker',
      ifVisible({ data }: EditorResult<Data>) {
        return data.isColor || '#1890ff';
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.strokeColor;
        },
        set({ data }: EditorResult<Data>, value: string) {
          data.strokeColor = value;
        }
      }
    }
  ]
};
