import { DefaultOnCellScript } from "../../constants";
import { setCol } from '../../schema';
import { getColumnItem } from "../../utils";

const CellEditor = {
  title: '单元格',
  items: [
    {
      title: '单元格属性设置',
      type: 'switch',
      description: '开启后，可以使用【单元格属性设置脚本】功能',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          return item.enableOnCell
        },
        set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          setCol({ data, focusArea }, 'enableOnCell', value);
        }
      }
    },
    {
      title: '单元格属性设置脚本',
      description: '可以通过js脚本动态设置单元格的样式和其他属性',
      type: 'code',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        const item = getColumnItem(data, focusArea);
        return item.enableOnCell
      },
      options: {
        language: 'javascript',
        enableFullscreen: false,
        title: '单元格属性设置脚本',
        width: 600,
        minimap: {
          enabled: false
        },
        babel: true,
        eslint: {
          parserOptions: {
            ecmaVersion: '2020',
            sourceType: 'module'
          }
        }
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          return item.onCellScript || DefaultOnCellScript;
        },
        set({ data, focusArea }: EditorResult<Data>, value: string) {
          setCol({ data, focusArea }, 'onCellScript', value);
        }
      }
    },
  ]
}


export default CellEditor