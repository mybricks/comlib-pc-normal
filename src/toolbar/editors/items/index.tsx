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
      {
        title: '测试',
        type: 'Text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            console.log('get', focusArea, data);
            return 'get';
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            console.log('set');
          }
        }
      },
      {
        title: '按钮样式',
        options: ['size'],
        target({ focusArea }) {
          return `div[data-btn-idx="${focusArea.dataset.btnIdx}"] > button`;
        }
      }
      // ...StyleEditor,
    ],
    items: ({}: EditorResult<Data>, cate1, cate2, cate3) => {
      cate1.title = '常规';
      cate1.items = [
        ...BaseEditor,
        ...OutputValEditor,
        ...EventEditor,
        ...IndexEditor,
        ...IconEditor
      ];

      cate2.title = '高级';
      cate2.items = [...DynamicEventEditor, ...PermissionEditor];

      return {
        title: '按钮'
      };
    }
  }
};

export default itemEditor;
