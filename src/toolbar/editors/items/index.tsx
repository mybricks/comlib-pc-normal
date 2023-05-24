import { BtnItemDataSetKey } from '../../constants';
import { Data } from '../../types';
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
        title: '按钮样式',
        options: ['size'],
        target({ focusArea }) {
          return `div[data-btn-idx="${focusArea.dataset.btnIdx}"]`;
        }
        // initValue: {
        //   width: '100%',
        //   height: "32px",
        //   textAlign: 'center',
        //   fontWeight: 400,
        //   boxShadow: '0 2px 0 rgba(0,0,0,.015)',
        //   paddingTop: '4px',
        //   paddingBottom: '4px',
        //   paddingLeft: '15px',
        //   paddingRight: '15px',
        //   borderRadius: '2px',
        // }
      }
    ],
    items: ({}: EditorResult<Data>, cate1, cate2, cate3) => {
      cate1.title = '常规';
      cate1.items = [...BaseEditor, ...OutputValEditor, ...EventEditor, ...IndexEditor];

      cate2.title = '样式';
      cate2.items = [...StyleEditor, ...IconEditor];

      cate3.title = '高级';
      cate3.items = [...DynamicEventEditor, ...PermissionEditor];

      return {
        title: '按钮'
      };
    }
  }
};

export default itemEditor;
