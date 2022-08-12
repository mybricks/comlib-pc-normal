import { Data, TypeEnum, TypeEnumMap } from './constants';

const setDescByData = ({ data, setDesc }: { data: Data; setDesc }) => {
  const { type, url } = data;
  const info = [`类型：${TypeEnumMap[type]}`];
  if (url) {
    info.push(`路径：${url}`);
  }
  setDesc(info.join('\n'));
};
export default {
  '@init'({ data, setDesc }: EditorResult<Data>) {
    setDescByData({ data, setDesc });
  },
  ':root': [
    {
      title: '类型',
      type: 'Select',
      options: [
        { label: TypeEnumMap[TypeEnum.PUSHSTATE], value: TypeEnum.PUSHSTATE },
        { label: TypeEnumMap[TypeEnum.REDIRECT], value: TypeEnum.REDIRECT },
        { label: TypeEnumMap[TypeEnum.OPENTAB], value: TypeEnum.OPENTAB },
        // { label: TypeEnumMap[TypeEnum.OPENWINDOW], value: TypeEnum.OPENWINDOW },
        { label: TypeEnumMap[TypeEnum.BACK], value: TypeEnum.BACK },
        { label: TypeEnumMap[TypeEnum.FORWARD], value: TypeEnum.FORWARD },
        { label: TypeEnumMap[TypeEnum.RELOAD], value: TypeEnum.RELOAD }
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
      title: '跳转路径',
      type: 'Text',
      options: {
        placeholder: '请输入静态跳转路径'
      },
      ifVisible({ data }: EditorResult<Data>) {
        return [
          TypeEnum.PUSHSTATE,
          TypeEnum.OPENTAB,
          TypeEnum.OPENWINDOW,
          TypeEnum.REDIRECT
        ].includes(data.type);
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.url;
        },
        set({ data, setDesc }: EditorResult<Data>, value: string) {
          data.url = value;
          setDescByData({ data, setDesc });
        }
      }
    },
    {
      title: '窗口名称',
      type: 'Text',
      options: {
        placeholder: '请输入窗口名称'
      },
      ifVisible({ data }: EditorResult<Data>) {
        return [
          TypeEnum.PUSHSTATE,
          TypeEnum.OPENTAB,
          TypeEnum.OPENWINDOW
        ].includes(data.type);
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.title;
        },
        set({ data }: EditorResult<Data>, value: string) {
          data.title = value;
        }
      }
    }
  ]
};
