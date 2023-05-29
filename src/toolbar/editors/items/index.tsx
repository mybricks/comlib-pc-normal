import { BtnItemDataSetKey } from '../../constants';
import { AlignEnum, Data } from '../../types';
import IndexEditor from './indexEditor';
import DynamicEventEditor from './dynamicEventEditor';
import IconEditor from './iconEditor';
import PermissionEditor from './permissionEditor';
import StyleEditor from './styleEditor';
import EventEditor from './eventEditor';
import BaseEditor from './baseEditor';
import OutputValEditor from './outputValEditor';

const itemEditor = {
  [`[${BtnItemDataSetKey}]`]: {
    title: '按钮',
    style: [
      ...StyleEditor,
      ...IconEditor,
      {
        options: ['size'],
        target({ focusArea }) {
          return `div[data-btn-idx="${focusArea.dataset.btnIdx}"]`;
        }
      }
      // {
      //   title: '按钮样式',
      //   options: ['bgcolor', 'font', 'border'],
      //   target({ focusArea }) {
      //     return `div[data-btn-idx="${focusArea.dataset.btnIdx}"] > button`;
      //   }
      // }
    ],
    items: ({}: EditorResult<Data>, cate1, cate2, cate3) => {
      cate1.title = '常规';
      cate1.items = [...BaseEditor, ...OutputValEditor, ...EventEditor, ...IndexEditor];

      cate2.title = '高级';
      cate2.items = [...DynamicEventEditor, ...PermissionEditor];

      return {
        title: '按钮'
      };
    }
  }
};

export default itemEditor;
