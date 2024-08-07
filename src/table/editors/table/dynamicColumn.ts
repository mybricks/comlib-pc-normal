import { InputIds, OutputIds } from '../../constants';
import { Schemas } from '../../schema';
import { Data } from '../../types';

const DynamicColumnEditor = [
  {
    title: '动态设置显示列',
    description: '开启后，可以通过逻辑连线连接表格的输入项【设置显示列】，传入显示列对应的字段列表。该功能只能控制列的显示隐藏',
    type: 'switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.useDynamicColumn;
      },
      set({ data, input, output }: EditorResult<Data>, value: boolean) {
        const hasEvent = input.get(InputIds.SET_SHOW_COLUMNS);
        const hasEvent1 = output.get(InputIds.SET_SHOW_COLUMNS);
        if (value) {
          !hasEvent && input.add({
            id: InputIds.SET_SHOW_COLUMNS,
            title: '设置显示列',
            schema: Schemas.SET_SHOW_COLUMNS,
            desc: '需要显示的列字段列表'
          });
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
