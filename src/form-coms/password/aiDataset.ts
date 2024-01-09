import { defineDataSet, DataSetItem } from 'ai-dataset';

export default defineDataSet((utils) => {
  const result: DataSetItem[] = [];

  // ======================== 提示内容 ========================
  result.push(
    ...utils.repeat(() => {
      const placeholder = utils.word.noun();
      return {
        Q: `值为空时设置提示内容为“请输入${placeholder}”`,
        A: {
          data: {
            placeholder: `请输入${placeholder}`
          }
        }
      };
    })
  );

  // ======================== 禁用状态 ========================
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `${item.label}禁用状态`,
      A: {
        data: {
          disabled: item.value
        }
      }
    }))
  );

  // ======================== 校验规则 ========================
  // TODO: src/form-coms/password/editors.ts:161

  return result;
});
