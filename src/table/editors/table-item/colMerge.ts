import { setCol, setDataSchema } from '../../schema';
import { ContentTypeEnum, Data } from '../../types';
import { getColumnItem } from "../../utils";

const formatCode = `
/**
 * 输入参数：
 *  - 当前行数据:  rowRecord
 *  - 当前行序号：   index
 * 返回值:
*  {
*     rowSpan: number, 表示当前单元格占几行，为0则被合并，不设置则保持原样
*     colSpan: number, 表示当前单元格占几列，为0则被合并，不设置则保持原样
*  }
 **/
({ record, index }) => {
   if (index === 2) {
    // 单元格高度为2行
        return { rowSpan: 2 };
      }
  if (index === 3) {
    // 单元格高度为0
    return { rowSpan: 0 };
  }
  if (index === 4) {
    // 单元格宽度为0
    return { colSpan: 0 };
  }
}`

export default [
  {
    title: '开启行合并设置',
    type: 'switch',
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea);
        return item && item.enableColMerge;
      },
      set({ data, focusArea, output, input, ...res }: EditorResult<Data>, value) {
        if (!focusArea) return;
        setCol({ data, focusArea }, 'enableColMerge', value);
      }
    }
  },
  {
    title: '行合并设置',
    type: 'code',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      const item = getColumnItem(data, focusArea);
      return item && item.enableColMerge;
    },
    options: {
      options: {
        babel: true,
        comments: '',
        theme: 'light',
        minimap: {
          enabled: false
        },
        lineNumbers: 'on',
        eslint: {
          parserOptions: {
            ecmaVersion: '2020',
            sourceType: 'module'
          }
        },
        autoSave: false,
      },
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea);
        return item && item.colMergeScirpt || formatCode;
      },
      set({ data, focusArea, output, input, ...res }: EditorResult<Data>, value: string) {
        if (!focusArea) return;
        setCol({ data, focusArea }, 'colMergeScirpt', value);
      }
    }
  }]