import { Editor, EditorType } from '../utils/editor';
import { Data, TypeEnum, TypeEnumMap } from './constants';

const setDescByData = ({ data, setDesc }: { data: Data; setDesc }) => {
  const { type, showTitle, title, content } = data;
  const info = [`类型：${TypeEnumMap[type]}`];
  if (showTitle) {
    info.push(`标题：${title}`);
  }
  info.push(`内容：${content}`);
  setDesc(info.join('\n'));
};
const TypeOptions = [
  { value: TypeEnum.info, label: TypeEnumMap[TypeEnum.info] },
  { value: TypeEnum.error, label: TypeEnumMap[TypeEnum.error] },
  { value: TypeEnum.success, label: TypeEnumMap[TypeEnum.success] },
  { value: TypeEnum.warning, label: TypeEnumMap[TypeEnum.warning] },
  { value: TypeEnum.confirm, label: TypeEnumMap[TypeEnum.confirm] }
];

export default {
  '@init'({ data, setDesc }: EditorResult<Data>) {
    setDescByData({ data, setDesc });
  },
  ':root': [
    Editor<Data>('类型', EditorType.Select, 'type', {
      options: TypeOptions,
      value: {
        set({ data, setDesc }: EditorResult<Data>, val: TypeEnum) {
          data.type = val;
          setDescByData({ data, setDesc });
        }
      }
    }),
    Editor<Data>('显示标题', EditorType.Switch, 'showTitle', {
      value: {
        set({ data, setDesc }: EditorResult<Data>, val: boolean) {
          data.showTitle = val;
          setDescByData({ data, setDesc });
        }
      }
    }),
    Editor<Data>('标题', EditorType.Text, 'title', {
      ifVisible({ data }: EditorResult<Data>) {
        return data.showTitle;
      },
      value: {
        set({ data, setDesc }: EditorResult<Data>, val: string) {
          data.title = val;
          setDescByData({ data, setDesc });
        }
      }
    }),
    Editor<Data>('详情', EditorType.TextArea, 'content', {
      ifVisible({ data }: EditorResult<Data>) {
        return data.showTitle;
      },
      value: {
        set({ data, setDesc }: EditorResult<Data>, val: string) {
          data.content = val;
          setDescByData({ data, setDesc });
        }
      }
    }),
    {
      title: '底部按钮',
      items: [
        Editor<Data>('确定按钮文案', EditorType.Text, 'okText'),
        Editor<Data>('取消按钮文案', EditorType.Text, 'cancelText', {
          ifVisible({ data }: EditorResult<Data>) {
            return data.type === 'confirm';
          }
        })
      ]
    }
  ]
};
