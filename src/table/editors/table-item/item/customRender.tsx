import { Data } from '../../../types';
import { getColumnItem } from '../../../utils';

// 默认代码注释
const defaultCodeAnnotation = `/**
* value 当前数据值
* record 当前行数据
* context 内置方法
*
* 例子
* export default function ({ value, record, context, uiLibs }) {
*    const { Button } = uiLibs;
*    return <Button>{value}</Button>
* }
*/`;
// 默认代码
const defaultCode = `
export default function ({ value, record, context, uiLibs }) {
  return value;
}
`;
export default {
  title: '自定义渲染配置',
  ifVisible({ data, focusArea }: EditorResult<Data>) {
    if (!focusArea) return;
    const item = getColumnItem(data, focusArea);
    return item.contentType === 'custom';
  },
  items: [
    {
      title: '自定义渲染代码',
      type: 'Code',
      options: {
        title: '编辑自定义渲染代码',
        language: 'javascript',
        width: 600,
        minimap: {
          enabled: false
        },
        rtSave: false,  // 实时保存
        comments: defaultCodeAnnotation
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          return item.customRenderCode || defaultCode;
        },
        set({ data, focusArea }: EditorResult<Data>, value) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          item.customRenderCode = value;
        }
      }
    }
  ]
};
