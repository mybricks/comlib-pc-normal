import { setCol } from '../../schema';
import { Data } from '../../types';
import { getColumnItem } from '../../utils';

const EllipsisEditor = {
  title: '省略换行配置',
  ifVisible({ data, focusArea }: EditorResult<Data>) {
    if (!focusArea) return;
    const item = getColumnItem(data, focusArea);
    return ['text', 'color', 'link', 'date'].includes(item.contentType);
  },
  items: [
    {
      title: '超出时自动省略',
      type: 'Switch',
      description: '内容超出宽度后文本是否自动省略、不换行、以省略号结尾',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          return item.ellipsis;
        },
        set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          if (!focusArea) return;
          setCol(data, focusArea, value, 'ellipsis');
        }
      }
    },
    // {
    //   title: '内容省略文字提示',
    //   type: 'Switch',
    //   ifVisible({ data, focusArea }: EditorResult<Data>) {
    //     if (!focusArea) return;
    //     const item = getColumnItem(data, focusArea);
    //     return ['text', 'color', 'link', 'date'].includes(item.contentType);
    //   },
    //   value: {
    //     get({ data, focusArea }: EditorResult<Data>) {
    //       if (!focusArea) return;
    //       const item = getColumnItem(data, focusArea);
    //       return item.useTooltip;
    //     },
    //     set({ data, focusArea }: EditorResult<Data>, value: boolean) {
    //       if (!focusArea) return;
    //       setCol(data, focusArea, value, 'useTooltip');
    //     }
    //   }
    // },
    {
      title: '保留换行',
      type: 'Switch',
      description: '开启后，当数据中存在换行时，超出时自动省略配置项不再生效',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea);
        return ['text', 'color', 'link'].includes(item.contentType);
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          return item.keepWordWrap;
        },
        set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          if (!focusArea) return;
          setCol(data, focusArea, value, 'keepWordWrap');
        }
      }
    }
  ]
};

export default EllipsisEditor;
