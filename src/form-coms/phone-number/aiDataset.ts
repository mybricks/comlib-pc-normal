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
            config: {
              placeholder: `请输入${placeholder}`
            }
          }
        }
      };
    })
  );

  // ======================== 前置标签 ========================
  result.push(
    ...utils.repeat(() => {
      const label = utils.word.noun();
      return {
        Q: `设置前置标签为“${label}”`,
        A: {
          data: {
            config: {
              addonBefore: label
            }
          }
        }
      };
    })
  );
  
  // ======================== 后置标签 ========================
  result.push(
    ...utils.repeat(() => {
      const label = utils.word.noun();
      return {
        Q: `设置后置标签为“${label}”`,
        A: {
          data: {
            config: {
              addonAfter: label
            }
          }
        }
      };
    })
  );

  // ======================== 校验失败提示内容 ========================
  // TODO: src/form-coms/phone-number/editors.tsx:99

  // ======================== 显示清除图标 ========================
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `${item.label}显示清除图标`,
      A: {
        data: {
          config: {
            allowClear: item.value
          }
        }
      }
    }))
  );

  // ======================== 显示字数 ========================
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `${item.label}显示字数`,
      A: {
        data: {
          config: {
            showCount: item.value
          }
        }
      }
    }))
  );
  
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
  // TODO: src/form-coms/phone-number/editors.ts:183

  return result;
});
