import { InputIds, Schemas } from '../constants';
import { Data } from '../types';
import { getNewBtn } from '../utils';

const addEditor = [
  {
    title: '添加按钮',
    type: 'Button',
    value: {
      set({ data, output, input }: EditorResult<Data>) {
        const newItem = {
          ...getNewBtn(),
          text: `按钮${data.btnList.length}`
        };
        output.add(newItem.key, newItem.text, Schemas.Any);
        input.add(
          `${InputIds.SetOutputVal}_${newItem.key}`,
          `设置${newItem.text}输出内容`,
          Schemas.Follow
        );
        data.btnList.push(newItem);
      }
    }
  }
];

export default addEditor;
