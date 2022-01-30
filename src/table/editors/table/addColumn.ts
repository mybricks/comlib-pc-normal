import { uuid } from '../../../utils';
import { setDataSchema } from '../../schema';
import { Data, IColumn } from '../../types';

function getNewColumn() {
  const obj: IColumn = {
    title: '新增',
    dataIndex: `${uuid()}`,
    ellipsis: true,
    width: 140,
    key: uuid(),
    contentType: 'text',
    visible: true
  };
  return obj;
}
const addColumnEditor = {
  title: '列',
  folded: true,
  items: [
    {
      title: '添加列',
      type: 'Button',
      value: {
        set({ data, output, input }: EditorResult<Data>) {
          data.columns.push(getNewColumn());
          setDataSchema({ data, output, input });
        }
      }
    }
  ]
};

export default addColumnEditor;
