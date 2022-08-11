import { setDataSchema } from '../../schema';
import { Data } from '../../types';
import { getNewColumn } from '../../utils';

const addColumnEditor = {
  title: '列',
  folded: true,
  items: [
    {
      title: '添加列',
      type: 'Button',
      value: {
        set({ data, output, input }: EditorResult<Data>) {
          data.columns = [...data.columns, getNewColumn()];
          setDataSchema({ data, output, input });
        }
      }
    }
  ]
};

export default addColumnEditor;
