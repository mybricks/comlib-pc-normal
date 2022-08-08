import { Data, SlotIds } from './constants';
import { OverflowEditor } from './editors/overflowEditor';
import { PageScrollEditor } from './editors/pageSrcollEditor';
import { SlotPropsEditor } from './editors/slotPropsEditor';
import { StyleEditor } from './editors/styleEditor';
import { ClickEditor } from './editors/clickEditor';
import { MaxHeightEditor } from './editors/maxHeightEditor';
import { FixedEditor } from './editors/fixedEditor';
import { SlotLayoutEditor } from '../components/editors/SlotLayoutEditor';

export default {
  '@init'({ style }: EditorResult<Data>) {
    // style.width = '100%';
    style.height = 20;
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': ({ slot }: EditorResult<Data>, cate1, cate2) => {
    cate1.title = '常规';
    cate1.items = [
      {
        title: '样式',
        items: StyleEditor
      },
      {
        title: '布局',
        items: SlotLayoutEditor(slot.get(SlotIds.Content))
      },
      ...OverflowEditor
    ];

    cate2.title = '高级';
    cate2.items = [
      ...ClickEditor,
      ...PageScrollEditor,
      ...MaxHeightEditor,
      ...SlotPropsEditor,
      ...FixedEditor
    ];

    return {
      title: '自定义容器'
    };
  }
};
