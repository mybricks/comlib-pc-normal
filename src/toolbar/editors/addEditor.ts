import { Schemas, OutputIds } from '../constants';
import { Data } from '../types';
import { getNewBtn } from '../utils';

const addEditor = [
  {
    title: '添加按钮',
    type: 'Button',
    value: {
      set({ data, output }: EditorResult<Data>) {
        if (!data.btnList) {
          data.btnList = [];
        }
        const newItem = {
          ...getNewBtn(),
          text: `按钮${data.btnList.length}`
        };
        output.add(newItem.key, `单击${newItem.text}`, Schemas.Number);
        output.add(`${OutputIds.DoubleClick}_${newItem.key}`, `双击${newItem.text}`, Schemas.Number);
        data.btnList.push(newItem);
      }
    }
  }
];

export default addEditor;
