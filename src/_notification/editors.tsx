import { Editor, EditorType } from '../utils/editor';
import {
  Data,
  InputIds,
  OutputIds,
  Schemas,
  TypeEnum,
  TypeEnumMap,
  PlacementEnum
} from './constants';

const setDescByData = ({ data, setDesc }: { data: Data; setDesc }) => {
  const { type, showTitle, message, description } = data;
  const info = [`类型：${TypeEnumMap[type]}`];
  if (showTitle) {
    info.push(`标题：${message}`);
  }
  info.push(`内容：${description}`);
  setDesc(info.join('\n'));
};

export default {
  '@inputConnected'({ output }, fromPin, toPin) {},
  '@inputDisConnected'({ output }, fromPin, toPin) {},
  '@init'({ data, setDesc }: EditorResult<Data>) {
    setDescByData({ data, setDesc });
  },
  ':root': [
    Editor<Data>('类型', EditorType.Select, 'type', {
      options: [
        { value: TypeEnum.info, label: TypeEnumMap[TypeEnum.info] },
        { value: TypeEnum.error, label: TypeEnumMap[TypeEnum.error] },
        { value: TypeEnum.success, label: TypeEnumMap[TypeEnum.success] },
        { value: TypeEnum.warning, label: TypeEnumMap[TypeEnum.warning] }
      ],
      value: {
        set({ data, output, setDesc }: EditorResult<Data>, val: TypeEnum) {
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
    Editor<Data>('标题', EditorType.Text, 'message', {
      ifVisible({ data }: EditorResult<Data>) {
        return data.showTitle;
      },
      options: {
        locale: true
      },
      value: {
        set({ data, setDesc }: EditorResult<Data>, val: string) {
          data.message = val;
          setDescByData({ data, setDesc });
        }
      }
    }),
    Editor<Data>('详情', EditorType.TextArea, 'description', {
      options: {
        locale: true
      },
      value: {
        set({ data, setDesc }: EditorResult<Data>, val: string) {
          data.description = val;
          setDescByData({ data, setDesc });
        }
      }
    }),
    Editor<Data>('显示时长（秒）', EditorType.Slider, 'duration', {
      options: [
        {
          max: 600,
          min: 0,
          steps: 0.1
        }
      ],
      description: '配置为 0 则不自动关闭',
      value: {
        set({ data, setDesc }: EditorResult<Data>, val: number) {
          data.duration = val === 0 ? val : null;
        }
      }
    }),
    Editor<Data>('弹出位置', EditorType.Select, 'placement', {
      options: [
        { value: PlacementEnum.top, label: '正上方' },
        { value: PlacementEnum.topLeft, label: '左上方' },
        { value: PlacementEnum.topRight, label: '右上方' },
        { value: PlacementEnum.bottom, label: '正下方' },
        { value: PlacementEnum.bottomLeft, label: '左下方' },
        { value: PlacementEnum.bottomRight, label: '右下方' }
      ],
      value: {
        set({ data, output, setDesc }: EditorResult<Data>, val: PlacementEnum) {
          data.placement = val;
        }
      }
    }),
    Editor<Data>('上边距', EditorType.Number, 'top', {
      options: [{ min: 0, max: 2000, width: 1 }],
      ifVisible({ data }: EditorResult<Data>) {
        return [PlacementEnum.topLeft, PlacementEnum.topRight, PlacementEnum.top].includes(
          data.placement
        );
      },
      description: '消息从顶部弹出时，距离顶部的位置，单位像素',
      value: {
        set({ data, output, setDesc }: EditorResult<Data>, val: number) {
          data.top = val;
        }
      }
    }),
    Editor<Data>('下边距', EditorType.Number, 'bottom', {
      options: [{ min: 0, max: 2000, width: 1 }],
      ifVisible({ data }: EditorResult<Data>) {
        return [PlacementEnum.bottomLeft, PlacementEnum.bottomRight, PlacementEnum.bottom].includes(
          data.placement
        );
      },
      description: '消息从底部弹出时，距离底部的位置，单位像素',
      value: {
        set({ data, output, setDesc }: EditorResult<Data>, val: number) {
          data.bottom = val;
        }
      }
    })
  ]
};
