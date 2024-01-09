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

  // ======================== 是否多选 ========================
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `${item.label}多选`,
      A: {
        data: {
          isMultiple: item.value
        }
      }
    }))
  );

  // ======================== 多选结点是自适应还是自定义 ========================
  const maxTagOptions = [
    {
      label: '自适应',
      value: 'isResponsive'
    },
    {
      label: '自定义',
      value: 'isCustom'
    }
  ];
  result.push(
    ...maxTagOptions.map((item) => ({
      Q: `多选结点${item.label}`,
      A: {
        data: {
          maxTagCountType: item.value
        }
      }
    }))
  );

  // ======================== 多选节点数 ========================
  result.push(
    ...utils.options.slider({ min: 1, max: 10 }).map((item) => {
      return {
        Q: `设置多选节点数${item.label}个`,
        A: {
          data: {
            isMultiple: true,
            maxTagCountType: 'isCustom',
            config: {
              maxTagCount: item.value
            }
          }
        }
      };
    })
  );

  // ======================== 允许选择任意一级 ========================
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `${item.label}允许选择任意一级`,
      A: {
        data: {
          config: {
            changeOnSelect: item.value
          }
        }
      }
    }))
  );

  // ======================== 支持搜索 ========================
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `${item.label}支持搜索`,
      A: {
        data: {
          config: {
            showSearch: item.value
          }
        }
      }
    }))
  );

  // ======================== 校验规则 ========================
  // TODO: src/form-coms/cascader/editors.ts:334

  return result;
});
