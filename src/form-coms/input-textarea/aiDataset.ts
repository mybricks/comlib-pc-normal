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

  // ======================== 最大行数限制 ========================
  result.push(
    ...utils.repeat(() => {
      const limit = utils.number.int({ min: 6, max: 100 });
      return {
        Q: `最大行数限制为${limit}`,
        A: {
          data: {
            maxRows: limit
          }
        }
      };
    })
  );

  // ======================== 最小行数限制 ========================
  result.push(
    ...utils.repeat(() => {
      const limit = utils.number.int({ min: 3, max: 100 });
      return {
        Q: `最小行数限制为${limit}`,
        A: {
          data: {
            minRows: limit
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
          config: {
            disabled: item.value
          }
        }
      }
    }))
  );

  // ======================== 字数显示 ========================
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `${item.label}字数显示`,
      A: {
        data: {
          config: {
            showCount: item.value
          }
        }
      }
    }))
  );

  // ======================== 内容最大长度 ========================
  result.push({
    Q: '不限制内容最大长度',
    A: {
      data: {
        config: {
          maxLength: -1
        }
      }
    }
  })
  result.push(
    ...utils.repeat(() => {
      const limit = utils.number.int({ min: 10, max: 100 });
      return {
        Q: `内容最大长度为${limit}`,
        A: {
          data: {
            config: {
              maxLength: limit
            }
          }
        }
      };
    })
  );

  // ======================== 校验 ========================
  // TODO: src/form-coms/input-textarea/editors.tsx:194

  return result;
});
