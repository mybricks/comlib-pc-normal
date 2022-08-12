import { OutputIds } from '../../constants';
import { Schemas } from '../../schema';
import { Data } from '../../types';

const dragEditor = [
  {
    title: '拖拽',
    type: 'Switch',
    value: {
      get({ data }) {
        return data.draggable;
      },
      set({ data, output }: EditorResult<Data>, value: boolean) {
        data.draggable = value;
        if (value) {
          output.add(
            OutputIds.DRAG_FINISH,
            `拖拽完成`,
            Schemas.DRAG_FINISH(data)
          );
        } else {
          output.remove(OutputIds.DRAG_FINISH);
        }
      },
    },
  },
  {
    title: '拖拽配置',
    ifVisible({ data }: EditorResult<Data>) {
      return data.draggable;
    },
    items: [
      {
        title: '获取拖拽项数据',
        type: 'switch',
        ifVisible({ data }: EditorResult<Data>) {
          return data.draggable;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useDrapItem;
          },
          set({ data }, val: boolean) {
            data.useDrapItem = val;
          },
        },
      },
      {
        title: '拖拽完成事件',
        type: '_Event',
        options: () => {
          return {
            outputId: OutputIds.DRAG_FINISH,
          };
        },
      },
    ],
  },
];

export { dragEditor };
