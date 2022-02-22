import { Data, TypeEnum, TypeEnumMap } from './constants';

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
      title: '提示内容',
      type: 'Text',
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
    }
  ]
};
