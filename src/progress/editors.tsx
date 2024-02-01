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
      title: '自定义进度值',
      type: 'switch',
      ifVisible({ data }: EditorResult<Data>) {
        return data.isShow;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.isFormat;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.isFormat = value;
        }
      }
    },
    {
      title: '自定义进度值表达式',
      type: 'expression',
      description: '会将括号内值替换成进度值, 如 {percent}% 会替换成 50%',
      options: {
        autoSize: true,
        placeholder: '输入表达式如{percent}%',
        suggestions: [
          {
            label: 'percent',
            detail: '进度值'
          }
        ]
      },
      ifVisible({ data }: EditorResult<Data>) {
        return data.isShow && data.isFormat;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.formatFunction;
        },
        set({ data }: EditorResult<Data>, value: string) {
          data.formatFunction = value;
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
      description: '进度圈、仪表盘 画布宽度，单位 px',
      type: 'inputnumber',
      options: [{ min: 1, max: Infinity, width: 180 }],
      ifVisible({ data }: EditorResult<Data>) {
        return data.type !== 'line';
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return [data.circleSize];
        },
        set({ data }: EditorResult<Data>, value: number[]) {
          data.circleSize = value[0];
        }
      }
    },
    {
      title: '进度条线宽度',
      description: '进度条线的宽度，单位 进度条线是 px, 进度圈和仪表盘是 画布宽度的百分比',
      type: 'inputnumber',
      options: [{ min: 1, max: Infinity, width: 180 }],
      value: {
        get({ data }: EditorResult<Data>) {
          return [data.strokeWidth];
        },
        set({ data }: EditorResult<Data>, value: number[]) {
          data.strokeWidth = value[0];
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
        set({ data, input, output }: EditorResult<Data>, value: boolean) {
          data.isColor = value;
          if (value && !input.get(InputIds.SetColor)) {
            input.add(InputIds.SetColor, '设置颜色', { type: 'string' });
            output.add('setColorDone', '设置颜色完成', { type: 'string' });
            input.get(InputIds.SetColor).setRels(['setColorDone']);
          }
          if (!value && input.get(InputIds.SetColor)) {
            input.remove(InputIds.SetColor);
            output.remove('setColorDone');
          }
        }
      }
    },
    {
      title: '完成分段颜色',
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
    },
    {
      title: '未完成分段颜色',
      type: 'colorpicker',
      ifVisible({ data }: EditorResult<Data>) {
        return data.isColor;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.trailColor;
        },
        set({ data }: EditorResult<Data>, value: string) {
          data.trailColor = value;
        }
      }
    }
  ]
};
