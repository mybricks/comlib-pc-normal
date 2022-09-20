import { Data, TypeEnum, TypeEnumMap, OutputIds } from './constants';

const setDescByData = ({ data, setDesc }: { data: Data; setDesc }) => {
  const { type, content } = data;
  const info = [`类型：${TypeEnumMap[type]}`, `内容：${content}`];
  setDesc(info.join('\n'));
};
export default {
  '@init'({ data, setDesc }: EditorResult<Data>) {
    setDescByData({ data, setDesc });
  },
  ':root': [
    {
      title: '内容输入',
      type: 'switch',
      description: '开关打开接收外部动态内容, 关闭后仅接受静态内容',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.isExternal;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.isExternal = value;
        }
      }
    },
    {
      title: '提示内容',
      type: 'Text',
      ifVisible({ data }: EditorResult<Data>) {
        return !data.isExternal;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.content;
        },
        set({ data, setDesc }: EditorResult<Data>, value: string) {
          data.content = value;
          setDescByData({ data, setDesc });
        }
      }
    },
    {
      title: '显示时长（秒）',
      type: 'Slider',
      options: [
        {
          max: 600,
          min: 1,
          steps: 1
        }
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.duration || 3;
        },
        set({ data }: EditorResult<Data>, value: number) {
          data.duration = value;
        }
      }
    },
    {
      title: '效果',
      type: 'Select',
      options: [
        { value: TypeEnum.success, label: TypeEnumMap[TypeEnum.success] },
        { value: TypeEnum.error, label: TypeEnumMap[TypeEnum.error] },
        { value: TypeEnum.info, label: TypeEnumMap[TypeEnum.info] },
        { value: TypeEnum.warning, label: TypeEnumMap[TypeEnum.warning] },
        { value: TypeEnum.loading, label: TypeEnumMap[TypeEnum.loading] }
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.type;
        },
        set({ data, setDesc }: EditorResult<Data>, value: TypeEnum) {
          data.type = value;
          setDescByData({ data, setDesc });
        }
      }
    },
    {
      title: '提示结束',
      type: 'switch',
      description: '开关打开后开启提示结束输出, 关闭后无结束事件输出',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.isEnd;
        },
        set({ data, output }: EditorResult<Data>, value: boolean) {
          data.isEnd = value;
          if (value && !output.get(OutputIds.Close)) {
            output.add(OutputIds.Close, '提示结束', { type: 'any' });
          }
          if (!value && output.get(OutputIds.Close)) {
            output.remove(OutputIds.Close);
          }
        }
      }
    }
  ]
};
