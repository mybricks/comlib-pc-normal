import { Data } from '../types';
import ItemEditor from './items';
import StyleEditor from './styleEditor';
import AddEditor from './addEditor';
import EllipsisEditor from './ellipsisEditor';

export default {
  '@resize': {
    options: ['width', 'height']
  },
  '@init': ({ style }) => {
    style.height = 'auto';
  },
  ':root': {
    title: '工具条',
    items: [...AddEditor, ...StyleEditor, ...EllipsisEditor],
    style: [{
      catelog: '默认',
      title: '工具条背景',
      options: [{ type: 'background' }],
      target: `div.mybricks-toolbar`
    }]
  },
  ...ItemEditor
};
