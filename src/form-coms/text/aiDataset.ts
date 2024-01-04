import { DataSetItem, defineDataSet } from 'ai-dataset';

export default defineDataSet((utils) => {
  const result: DataSetItem[] = [];

  // ======================== 尺寸 ========================
  const sizeOptions = [
    {
      label: '宽',
      value: 'large'
    },
    {
      label: '中',
      value: 'middle'
    },
    {
      label: '窄',
      value: 'small'
    }
  ];
  result.push(
    ...sizeOptions.map((item) => ({
      Q: `将尺寸设置为${item.label}`,
      A: {
        data: {
          config: {
            size: item.value
          }
        }
      }
    }))
  );

  // ======================== 图标来源 ========================
  const iconSourceOptions = [
    // { label: '无', value: 'none' },
    { label: '内置图标库', value: 'inner' },
    { label: '自定义上传', value: 'custom' }
  ];
  result.push(
    ...iconSourceOptions.map((item) => ({
      Q: `将图标来源设置为${item.label}`,
      A: { data: { config: { iconSource: item.value } } }
    }))
  );

  // ======================== 选择图标 ========================
  // TODO: src/form-coms/text/editors.tsx:67

  // ======================== 上传 ========================
  // TODO: src/form-coms/text/editors.tsx:82

  return result;
});
