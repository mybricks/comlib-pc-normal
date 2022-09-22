import { Data, InputIds, Schemas, TypeEnum, TypeEnumMap } from './constants';

const setDescByData = ({ data, setDesc }: { data: Data; setDesc }) => {
  const { type, useDefault, url, title } = data;
  const info = [`类型：${TypeEnumMap[type]}`];
  if (useDefault && url) {
    info.push(`路径：${url}`);
  }
  if (
    useDefault &&
    [TypeEnum.PUSHSTATE, TypeEnum.OPENTAB, TypeEnum.OPENWINDOW].includes(type) &&
    title
  ) {
    info.push(`窗口名称：${title}`);
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
      title: '使用静态配置',
      type: 'Switch',
      description: '开启后，支持填写静态跳转路径/窗口名称',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.useDefault;
        },
        set({ data, input, setDesc }: EditorResult<Data>, value: boolean) {
          data.useDefault = value;
          input.get(InputIds.RouterAction).setSchema(value ? Schemas.Any : Schemas.String);
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
        return (
          data.useDefault &&
          [TypeEnum.PUSHSTATE, TypeEnum.OPENTAB, TypeEnum.OPENWINDOW, TypeEnum.REDIRECT].includes(
            data.type
          )
        );
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
      description: '相同的窗口名称页面，不会重复打开新标签页/新窗口',
      options: {
        placeholder: '请输入窗口名称'
      },
      ifVisible({ data }: EditorResult<Data>) {
        return (
          data.useDefault &&
          [TypeEnum.PUSHSTATE, TypeEnum.OPENTAB, TypeEnum.OPENWINDOW].includes(data.type)
        );
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.title;
        },
        set({ data, setDesc }: EditorResult<Data>, value: string) {
          data.title = value;
          setDescByData({ data, setDesc });
        }
      }
    }
  ]
};
