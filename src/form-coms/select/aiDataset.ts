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

  // ======================== 最大高度 ========================
  result.push(
    ...utils.repeat(() => {
      const limit = utils.number.int({ min: 100, max: 1000 });
      return {
        Q: `最大高度限制为${limit}px`,
        A: {
          data: {
            maxHeight: limit
          }
        }
      };
    })
  );

  // ======================== 下拉框模式 ========================
  const modeOptions = [
    { label: '默认', value: 'default' },
    { label: '多选', value: 'multiple' },
    { label: '标签', value: 'tags' }
  ];
  result.push(
    ...modeOptions.map((item) => ({
      Q: `模式设置为${item.label}`,
      A: {
        data: {
          config: {
            mode: item.value
          }
        }
      }
    }))
  );

  // ======================== 标签过多时省略 ========================
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `${item.label}标签过多时省略`,
      A: {
        data: {
          config: {
            mode: 'tags', // FIXME: 依赖上一个模式设置，且支持 2 个模式都支持
            showSearch: item.value
          }
        }
      }
    }))
  );

  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `${item.label}标签过多时省略`,
      A: {
        data: {
          config: {
            mode: 'multiple', // FIXME: 依赖上一个模式设置，且支持 2 个模式都支持
            showSearch: item.value
          }
        }
      }
    }))
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

  // ======================== 下拉剪头 ========================
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `${item.label}下拉剪头`,
      A: {
        data: {
          config: {
            showArrow: item.value
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

  // ======================== 静态选项配置 ========================
  result.push(
    ...utils.repeat(() => {
      const options = utils.repeat(() => utils.word.noun(), 5);
      return {
        Q: `选项配置为${options.map((option) => `“${option}”`).join('、')}`,
        A: {
          data: {
            staticOptions: options.map((option) => ({
              label: option,
              value: option
            }))
          }
        }
      };
    })
  );

  // ======================== 输出数据 ========================
  const outputOptions = [
    { label: '选项值', value: 'value' },
    { label: '{选项标签, 选项值}', value: 'labelInValue' },
    { label: '当前选项', value: 'option' }
  ];
  result.push(
    ...outputOptions.map((item) => ({
      Q: `输出数据为${item.label}`,
      A: {
        data: {
          outputValueType: item.value
        }
      }
    }))
  );

  // ======================== 校验相关 ========================
  // TODO: src/form-coms/select/editors.ts:469

  return result;
});
