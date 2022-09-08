import { Data, OutputIds, Schemas } from '../constants';

const EventEditor = [
  {
    title: '单击节点事件',
    type: 'Switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.useItemClick;
      },
      set({ data, output }: EditorResult<Data>, value: boolean) {
        const hasEvent = output.get(OutputIds.ItemClick);
        if (value) {
          !hasEvent && output.add(OutputIds.ItemClick, '单击节点', Schemas.Any);
        } else {
          hasEvent && output.remove(OutputIds.ItemClick);
        }
        data.useItemClick = value;
      }
    }
  },
  {
    type: '_Event',
    ifVisible({ data }: EditorResult<Data>) {
      return data.useItemClick;
    },
    options: {
      outputId: OutputIds.ItemClick
    }
  }
];
export default EventEditor;
