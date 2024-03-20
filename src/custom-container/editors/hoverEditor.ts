import { Data, OutputIds } from '../constants';

export const HoverEditor = [
  {
    title: 'hover设置',
    items: [
      {
        title: '鼠标移入事件',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useMouseEnter;
          },
          set({ data, output }: EditorResult<Data>, value: boolean) {
            const hasEvent = output.get(OutputIds.MouseEnter);
            if (value) {
              !hasEvent && output.add(OutputIds.MouseEnter, '鼠标移入', { type: 'any' });
            } else {
              hasEvent && output.remove(OutputIds.MouseEnter);
            }
            data.useMouseEnter = value;
          }
        }
      },
      {
        type: '_Event',
        ifVisible({ data }: EditorResult<Data>) {
          return data.useMouseEnter;
        },
        options: {
          outputId: OutputIds.MouseEnter
        }
      },
      {
        title: '鼠标移出事件',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useMouseLeave;
          },
          set({ data, output }: EditorResult<Data>, value: boolean) {
            const hasEvent = output.get(OutputIds.MouseLeave);
            if (value) {
              !hasEvent && output.add(OutputIds.MouseLeave, '鼠标移出', { type: 'any' });
            } else {
              hasEvent && output.remove(OutputIds.MouseLeave);
            }
            data.useMouseLeave = value;
          }
        }
      },
      {
        type: '_Event',
        ifVisible({ data }: EditorResult<Data>) {
          return data.useMouseLeave;
        },
        options: {
          outputId: OutputIds.MouseLeave
        }
      }
    ]
  }
];
