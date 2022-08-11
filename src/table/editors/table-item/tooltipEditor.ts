import { setCol } from '../../schema';
import { Data } from '../../types';
import { getColumnItem } from '../../utils';

const TooltipEditor = {
  title: '悬浮提示配置',
  ifVisible({ data, focusArea }: EditorResult<Data>) {
    if (!focusArea) return;
    const item = getColumnItem(data, focusArea);
    return item.contentType !== 'group';
  },
  items: [
    {
      title: '悬浮提示',
      type: 'Switch',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          return item.useTooltip;
        },
        set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          if (!focusArea) return;
          setCol(data, focusArea, value, 'useTooltip');
        }
      }
    },
    {
      title: '悬浮提示字段',
      type: 'text',
      options: {
        placeholder: '默认使用当前列字段'
      },
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea);
        return item.useTooltip;
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          return item.tooltipKey;
        },
        set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          if (!focusArea) return;
          setCol(data, focusArea, value, 'tooltipKey');
        }
      }
    }
  ]
};

export default TooltipEditor;
