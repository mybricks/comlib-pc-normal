import { DataSetItem, defineDataSet } from 'ai-dataset';

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
            config: {
              placeholder: `请输入${placeholder}`
            }
          }
        }
      };
    })
  );

  // ======================== 清除图标 ========================
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `${item.label}清除图标`,
      A: {
        data: {
          config: {
            allowClear: item.value
          }
        }
      }
    }))
  );

  // ======================== 确认按钮 ========================
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `${item.label}确认按钮`,
      A: {
        data: {
          isenterButton: item.value
        }
      }
    }))
  );

  // ======================== 确认按钮文案 ========================
  result.push(
    ...utils.repeat(() => {
      const text = utils.word.noun();
      return {
        Q: `确认按钮文案为“${text}”`,
        A: {
          data: {
            isenterButton: true,
            enterButton: text
          }
        }
      };
    })
  );

  // ======================== 前置标签 ========================
  result.push(
    ...utils.repeat(() => {
      const text = utils.word.noun();
      return {
        Q: `前置标签为“${text}”`,
        A: {
          data: {
            addonBefore: text
          }
        }
      };
    })
  );

  // ======================== 前置下拉框 ========================
  // TODO: src/form-coms/search/editors.ts:317
  // TODO: src/form-coms/search/editors.ts:339
  // TODO: src/form-coms/search/editors.ts:359

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

  // ======================== 校验规则 ========================
  // TODO: src/form-coms/search/editors.ts:449

  return result;
});
