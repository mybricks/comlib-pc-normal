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
    style: [
      {
        catelog: '默认',
        title: '工具条背景',
        options: [{ type: 'background' }],
        target: `div.mybricks-toolbar`
      },
      {
        options: ['size'],
        catelog: '默认',
        target({}) {
          return `div[data-btn-idx]`;
        }
      },
      {
        title: '按钮样式',
        catelog: '默认',
        options: ['border', { type: 'font', config: { disableTextAlign: true } }, 'background'],
        target({}) {
          return `button`;
        }
      },
      {
        title: '按钮样式',
        catelog: 'Hover',
        options: ['border', { type: 'font', config: { disableTextAlign: true } }, 'background'],
        target({}) {
          return `button.ant-btn:not([disabled]):hover`;
        }
      },
      {
        title: '按钮样式',
        catelog: '激活',
        options: ['border', { type: 'font', config: { disableTextAlign: true } }, 'background'],
        target({}) {
          return `button.ant-btn:not([disabled]):active`;
        }
      },
      {
        title: '按钮样式',
        catelog: '禁用',
        options: ['border', { type: 'font', config: { disableTextAlign: true } }, 'background'],
        target({}) {
          return `button.ant-btn[disabled],
          button.ant-btn[disabled]:active,
          button.ant-btn[disabled]:focus,
          button.ant-btn[disabled]:hover`;
        }
      }
    ]
  },
  ...ItemEditor
};
