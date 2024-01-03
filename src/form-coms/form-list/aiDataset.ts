import { DataSetItem, defineDataSet } from 'ai-dataset';

export default defineDataSet((utils) => {
  const result: DataSetItem[] = [];
  result.push(
    ...utils.options
      .slider({
        min: 1,
        max: 6,
        step: 1,
        formatter: '个/行'
      })
      .map((option) => ({
        Q: `将每行的表单项数量设置为${option.value}`,
        A: {
          data: {
            formItemColumn: option.value,
            actions: {
              span: 24 / option.value
            }
            // TODO: src/form-coms/form-list/editors/index.ts:241
            // TODO: src/form-coms/form-list/editors/index.ts:244
          }
        }
      }))
  );
  return result;
});
