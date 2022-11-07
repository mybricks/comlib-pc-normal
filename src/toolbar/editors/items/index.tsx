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
  [`[${BtnItemDataSetKey}]`]: ({}: EditorResult<Data>, cate1, cate2, cate3) => {
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
};

export default itemEditor;
