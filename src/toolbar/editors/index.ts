import { Data } from '../types';
import ItemEditor from './items';
import StyleEditor from './styleEditor';
import AddEditor from './addEditor';
import EllipsisEditor from './ellipsisEditor';

export default {
  '@resize': {
    options: ['width']
  },
  ':root': ({}: EditorResult<Data>, cate1, cate2) => {
    cate1.title = '常规';
    cate1.items = [...AddEditor, ...StyleEditor,...EllipsisEditor];
    return {
      title: '工具条'
    };
  },
  ...ItemEditor
};
