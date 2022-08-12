import { COLUMN_EDITORS_CLASS_KEY } from '../../constants';
import { Data } from '../../types';
import TagItemEditor from './item/tag';
import LinkItemEditor from './item/link';
import ImageItemEditor from './item/imgEditor';
import SwitchItemEditor from './item/switchEditor';
import InputItemEditors from './item/input';
import CustomRenderEditors from './item/customRender';
import GroupEditor from './item/group';
import IndexEditor from './indexEditor';
import SortEditor from './sortEditor';
import FilterEditor from './filterEditor';
import EllipsisEditor from './ellipsisEditor';
import BaseEditor from './baseEditor';
import TitleTipEditor from './titleTipEditor';
// import SlotItemEditor from './item/slotEditor';
import CopyEditor from './copyEditor';
import EditEditor from './editEditor';
import DataMapingEditor from './dataMapEditor';
import StyleEditor from './styleEditor';
import TooltipEditor from './tooltipEditor';
import { getColumnItem } from '../../utils';

const column = {
  [COLUMN_EDITORS_CLASS_KEY]: (
    { data, focusArea }: EditorResult<Data>,
    ...cateAry
  ) => {
    cateAry[0].title = '常规';
    cateAry[0].items = [
      BaseEditor,
      TagItemEditor,
      LinkItemEditor,
      ImageItemEditor,
      SwitchItemEditor({ data }),
      // SlotItemEditor,
      InputItemEditors,
      CustomRenderEditors,
      GroupEditor,
      DataMapingEditor(data),
      EllipsisEditor,
      TooltipEditor,
      CopyEditor,
      EditEditor,
      ...IndexEditor
    ];
    cateAry[1].title = '样式';
    cateAry[1].items = [StyleEditor, TitleTipEditor];

    const item = getColumnItem(data, focusArea);
    if (
      item &&
      ['text', 'color', 'link', 'tag', 'badge', 'date'].includes(item.contentType)
    ) {
      cateAry[2].title = '高级';
      cateAry[2].items = [SortEditor, FilterEditor];
    }
    return {
      title: '表格列'
    };
  }
};

export default column;
