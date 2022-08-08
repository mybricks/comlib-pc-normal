import { Data, OutputIds } from '../constants';

export const ClickEditor = [
  {
    title: '点击设置',
    items: [
      {
        title: '点击事件',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useClick;
          },
          set({ data, output }: EditorResult<Data>, value: boolean) {
            const hasEvent = output.get(OutputIds.Click);
            if (value) {
              !hasEvent && output.add(OutputIds.Click, '点击', { type: 'any' });
            } else {
              hasEvent && output.remove(OutputIds.Click);
            }
            data.useClick = value;
          }
        }
      },
      {
        type: '_Event',
        ifVisible({ data }: EditorResult<Data>) {
          return data.useClick;
        },
        options: {
          outputId: OutputIds.Click
        }
      }
    ]
  }
];
