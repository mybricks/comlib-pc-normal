import { Data } from '../types';
import { InputIds, Schemas } from '../constants';
import ItemEditor from './items';
import StyleEditor from './styleEditor';
import AddEditor from './addEditor';
import EllipsisEditor from './ellipsisEditor';

export default {
  '@inputUpdated'({ data, output }: EditorResult<Data>, updatePin) {
    const connectItem = data.btnList?.find(
      (item) => `${InputIds.SetOutputVal}_${item.key}` === updatePin.id
    );
    if (connectItem) {
      output.get(connectItem.key).setSchema(updatePin.schema);
    }
  },
  '@inputConnected'({ data, output }: EditorResult<Data>, fromPin, toPin) {
    const connectItem = data.btnList?.find(
      (item) => `${InputIds.SetOutputVal}_${item.key}` === toPin.id
    );
    if (connectItem) {
      output.get(connectItem.key).setSchema(fromPin.schema);
    }
  },
  '@inputDisConnected'({ data, output }, fromPin, toPin) {
    const connectItem = data.btnList?.find(
      (item) => `${InputIds.SetOutputVal}_${item.key}` === toPin.id
    );
    if (connectItem) {
      output.get(connectItem.key).setSchema(Schemas.Any);
    }
  },
  '@resize': {
    options: ['width']
  },
  ':root': ({}: EditorResult<Data>, cate1, cate2) => {
    cate1.title = '常规';
    cate1.items = [...AddEditor, ...StyleEditor];

    cate2.title = '高级';
    cate2.items = [...EllipsisEditor];
    return {
      title: '工具条'
    };
  },
  ...ItemEditor
};
