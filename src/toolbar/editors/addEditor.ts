import { Schemas, OutputIds } from '../constants';
import { Data } from '../types';
import { getNewBtn } from '../utils';

const addEditor = [
  {
    title: '添加按钮',
    type: 'Button',
    description: '点击后会新增一个按钮，并新增两个输出，一个是单击按钮时触发，另一个是双击按钮时触发',
    value: {
      set({ data, output, env }: EditorResult<Data>) {
        if (!data.btnList) {
          data.btnList = [];
        }
        const newItem = {
          ...getNewBtn(),
          text: `按钮${data.btnList.length}`
        };
        const text = env.i18n(newItem.text);
        output.add(newItem.key, `单击${text}`, {
          ...Schemas.Number,
          description: '点击按钮后，事件输出'
        });
        output.add(`${OutputIds.DoubleClick}_${newItem.key}`, `双击${text}`, {
          ...Schemas.Number,
          description: '双击按钮后，事件输出'
        });
        data.btnList.push(newItem);
      }
    }
  },
  {
    title: '添加插槽',
    type: 'Button',
    description: '点击后会新增一个插槽',
    value: {
      set({ data, slot }: EditorResult<Data>) {
        if (!data.btnList) {
          data.btnList = [];
        }
        const newItem = {
          ...getNewBtn(),
          text: `自定义插槽${data.btnList.length}`,
          isSlot: true
        };
        data.btnList.push(newItem);
        slot.add(newItem.key, newItem.text);
      }
    }
  }
];

export default addEditor;
