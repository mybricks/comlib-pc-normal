import { DataSetItem, defineDataSet } from 'ai-dataset';

export default defineDataSet((utils) => {
  const result: DataSetItem[] = [];

  // ======================== 禁用状态 ========================
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `${item.label}禁用状态`,
      A: {
        data: {
          config: {
            disabled: item.value
          }
        }
      }
    }))
  );

  // ======================== 选项配置 ========================
  result.push(
    ...utils.repeat(() => {
      const options = utils.repeat(() => utils.word.noun(), 5);
      return {
        Q: `选项配置为${options.map((option) => `“${option}”`).join('、')}`,
        A: {
          data: {
            staticOptions: options.map((option) => ({
              label: option,
              value: option,
              type: 'default',
              key: utils.datatype.uuid()
            }))
          }
        }
      };
    })
  );

  // ======================== 校验规则 ========================
  // TODO: src/form-coms/radio/editors.ts:294

  return result;
});
