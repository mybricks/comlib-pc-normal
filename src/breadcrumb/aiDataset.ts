import { defineDataSet } from "ai-dataset";

export default defineDataSet((utils) => {
  const result = {};
  const separatorOptions = [
    { label: '/', value: '/' },
    { value: '>', label: '>' },
    { value: 'custom', label: '自定义' }
  ];
  result['分割符'] = separatorOptions.map(item => {
    return {
      Q: `如何设置分割符为${item.label}`,
      A: { data: { separator: item.value } },
    };
  });
  const customSeparator = utils.string.alpha(1)
  result['自定义分割符'] = [{
    Q: `将分割符设置为${customSeparator}`,
    A: { data: { separator: 'custom', customSeparator } },
  }];
  result['内边距'] = Array.from({ length: 8 }).map((_, index) => {
    return {
      Q: `将内边距设置为${index * 5}px`,
      A: { data: { padding: index * 5 } },
    };
  });

  /** TODO: 复杂编辑项、区域选择器、样式 */
  result['添加'] = [];

  return result;
});
