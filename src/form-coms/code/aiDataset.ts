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
            aceConfig: {
              placeholder: `请输入${placeholder}`
            }
          }
        }
      };
    })
  );

  // ======================== 语言 ========================
  const langOptions = [
    { label: 'CSS', value: 'css' },
    { label: 'HTML', value: 'html' },
    { label: 'Java', value: 'java' },
    { label: 'JavaScript', value: 'javascript' },
    { label: 'JSON', value: 'json' },
    { label: 'SQL', value: 'sql' },
    { label: 'Text', value: 'text' }
  ];
  result.push(
    ...langOptions.map((item) => ({
      Q: `语言设置为${item.label}`,
      A: {
        data: {
          aceConfig: {
            language: item.value
          }
        }
      }
    }))
  );

  // ======================== 最大行数限制 ========================
  result.push(
    ...utils.repeat(() => {
      const maxLines = utils.number.int({ min: 6, max: 100 });
      return {
        Q: `最大行数限制为${maxLines}`,
        A: {
          data: {
            aceConfig: {
              maxLines
            }
          }
        }
      };
    })
  );

  // ======================== 最小行数限制 ========================
  result.push(
    ...utils.repeat(() => {
      const minLines = utils.number.int({ min: 3, max: 100 });
      return {
        Q: `最小行数限制为${minLines}`,
        A: {
          data: {
            aceConfig: {
              minLines
            }
          }
        }
      };
    })
  );

  // ======================== 超出换行 ========================
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `${item.label}超出换行`,
      A: {
        data: {
          aceConfig: {
            wrap: item.value
          }
        }
      }
    }))
  );

  // ======================== 只读 ========================
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `${item.label}只读`,
      A: {
        data: {
          readOnly: item.value
        }
      }
    }))
  );

  // ======================== 字体大小 ========================
  result.push(
    ...utils.repeat(() => {
      const fontSize = utils.number.int({ min: 12, max: 100 });
      return {
        Q: `字体大小为${fontSize}`,
        A: {
          data: {
            aceConfig: {
              fontSize
            }
          }
        }
      };
    })
  );

  // ======================== 校验 ========================
  // TODO: src/form-coms/code/editor.ts:108

  return result;
});
