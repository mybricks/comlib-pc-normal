import { InputIds, OutputIds } from '../../constants';
import { Schemas } from '../../schema';
import { Data } from '../../types';

const DynamicColumnEditor = [
  {
    title: '动态设置显示列',
    description: '开启后，支持通过逻辑连线 传入显示列对应字段列表',
    type: 'switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.useDynamicColumn;
      },
      set({ data, input, output }: EditorResult<Data>, value: boolean) {
        const hasEvent = input.get(InputIds.SET_SHOW_COLUMNS);
        const hasEvent1 = output.get(InputIds.SET_SHOW_COLUMNS);
        if (value) {
          !hasEvent && input.add(InputIds.SET_SHOW_COLUMNS, `设置显示列`, Schemas.SET_SHOW_COLUMNS);
          !hasEvent1 && output.add(OutputIds.SET_SHOW_COLUMNS, `显示列`, Schemas.SET_SHOW_COLUMNS);
          input.get(InputIds.SET_SHOW_COLUMNS).setRels([OutputIds.SET_SHOW_COLUMNS]);
        } else {
          hasEvent && input.remove(InputIds.SET_SHOW_COLUMNS);
          hasEvent1 && output.remove(OutputIds.SET_SHOW_COLUMNS);
        }
        data.useDynamicColumn = value;
      }
    }
  }
];

export default DynamicColumnEditor;
