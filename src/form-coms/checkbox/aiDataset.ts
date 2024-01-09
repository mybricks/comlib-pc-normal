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

  // ======================== 是否使用全选框 ========================
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `${item.label}使用全选框`,
      A: {
        data: {
          checkAll: item.value
        }
      }
    }))
  );

  // ======================== 全选框标签 ========================
  result.push(
    ...utils.repeat(() => {
      const label = utils.word.noun();
      return {
        Q: `全选框标签为“${label}”`,
        A: {
          data: {
            checkALl: true,
            checkAllText: label
          }
        }
      };
    })
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
              value: option,
              type: 'default',
              key: utils.datatype.uuid()
            }))
          }
        }
      };
    })
  );

  // ======================== 布局 ========================
  const layoutOptions = [
    {
      label: '水平',
      value: 'horizontal'
    },
    {
      label: '垂直',
      value: 'vertical'
    }
  ];
  result.push(
    ...layoutOptions.map((item) => ({
      Q: `设置为${item.label}布局`,
      A: {
        data: {
          layout: item.value
        }
      }
    }))
  );
  
  // ======================== 校验相关 ========================
  // TODO: src/form-coms/checkbox/editors.ts:256

  return result;
});
