import { Data, OutputIds } from '../constants';
import ItemEditor from './item';
import BaseEditor, { DefaultSourceSchema } from './baseEditor';
import StyleEditor from './styleEditor';
import { updateSourceSchema } from './utils';

export default {
  '@resize': {
    options: ['width']
  },
  '@inputConnected'(target, fromPin) {
    console.log(target)
    // updateSourceSchema(input, fromPin.schema);
  },
  '@inputDisConnected'({ data, input }) {
    updateSourceSchema(input, DefaultSourceSchema);
  },
  ':root': ({ data }: EditorResult<Data>, ...cate) => {
    cate[0].title = '常规';
    cate[0].items = [
      {
        title: '数据源',
        items: BaseEditor
      },
      {
        title: '属性',
        items: StyleEditor
      },
      {
        title: '事件',
        items: [
          {
            type: '_Event',
            options: {
              outputId: OutputIds.ItemClick
            }
          }
        ]
      }
    ];
    return { title: '时间轴' };
  },
  ...ItemEditor
};
