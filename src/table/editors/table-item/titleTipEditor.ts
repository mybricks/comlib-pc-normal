import { Data } from '../../types';
import { setCol } from '../../schema';
import { getColumnItem } from '../../utils';

const TitleTipEditor = {
  title: '提示配置',
  items: [
    {
      title: '显示提示',
      description: "开启后，支持配置表头提示文案，鼠标hover时可以显示自定义信息，用于添加对表格列的说明。",
      type: 'Switch',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          return getColumnItem(data, focusArea).hasTip;
        },
        set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          if (!focusArea) return;
          setCol({ data, focusArea }, 'hasTip', value);
        }
      }
    },
    {
      title: '提示文案',
      type: 'Textarea',
      options: {
        locale: true
      },
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        return getColumnItem(data, focusArea).hasTip;
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          return getColumnItem(data, focusArea).tip;
        },
        set({ data, focusArea }: EditorResult<Data>, value: string) {
          if (!focusArea) return;
          setCol({ data, focusArea }, 'tip', value);
        }
      }
    }
  ]
};

export default TitleTipEditor;
