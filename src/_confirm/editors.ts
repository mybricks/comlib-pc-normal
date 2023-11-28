import { Editor, EditorType } from '../utils/editor';
import { Data, InputIds, OutputIds, Schemas, TypeEnum, TypeEnumMap } from './constants';

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
  '@inputConnected'({ output }, fromPin, toPin) {
    if (toPin.id === InputIds.Open) {
      //连接时拿到传递过来的inputValue的schema，给到确认和取消
      //可以包含确认和其余类型
      const outputSchema =
        fromPin.schema?.type === 'object' && fromPin.schema?.properties?.outputValue !== undefined
          ? fromPin.schema?.properties?.outputValue
          : fromPin.schema;
      output.get(OutputIds.Ok).setSchema(outputSchema);

      if (output.get(OutputIds.Cancel)) {
        output.get(OutputIds.Cancel).setSchema(outputSchema);
      }
    }
  },
  '@inputDisConnected'({ output }, fromPin, toPin) {
    if (toPin.id === InputIds.Open) {
      output.get(OutputIds.Ok).setSchema(Schemas.Any);
      if (output.get(OutputIds.Cancel)) {
        output.get(OutputIds.Cancel).setSchema(Schemas.Any);
      }
    }
  },
  '@init'({ data, setDesc }: EditorResult<Data>) {
    setDescByData({ data, setDesc });
  },
  ':root': [
    Editor<Data>('类型', EditorType.Select, 'type', {
      options: TypeOptions,
      value: {
        set({ data, output, setDesc }: EditorResult<Data>, val: TypeEnum) {
          data.type = val;
          setDescByData({ data, setDesc });
          const cancelSchema = output.get(OutputIds.Ok).schema;
          if (data.type === 'confirm') {
            output.add(OutputIds.Cancel, '取消', cancelSchema);
          } else {
            output.remove(OutputIds.Cancel);
          }
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
      options: {
        locale: true
      },
      value: {
        set({ data, setDesc }: EditorResult<Data>, val: string) {
          data.title = val;
          setDescByData({ data, setDesc });
        }
      }
    }),
    Editor<Data>('详情', EditorType.TextArea, 'content', {
      options: {
        locale: true
      },
      value: {
        set({ data, setDesc }: EditorResult<Data>, val: string) {
          data.content = val;
          setDescByData({ data, setDesc });
        }
      }
    }),
    Editor<Data>('宽度', EditorType.Slider, 'width', {
      description: '设置0将使用默认宽度：520',
      options: {
        max: 5000,
        min: 0,
        step: 100,
        formatter: 'px'
      }
    }),
    {},
    Editor<Data>('确定按钮文案', EditorType.Text, 'okText', {
      options: {
        locale: true
      }
    }),
    Editor<Data>('取消按钮文案', EditorType.Text, 'cancelText', {
      ifVisible({ data }: EditorResult<Data>) {
        return data.type === 'confirm';
      },
      options: {
        locale: true
      }
    })
  ]
};
