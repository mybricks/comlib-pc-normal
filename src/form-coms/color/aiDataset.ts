import { defineDataSet, DataSetItem } from 'ai-dataset';

export default defineDataSet((utils) => {
  const result: DataSetItem[] = [];

  // ======================== 默认颜色 ========================
  result.push(
    ...utils.repeat(() => {
      const color = utils.color.rgb();
      return {
        Q: `设置默认颜色为“${color}”`,
        A: {
          data: {
            color
          }
        }
      };
    })
  );

  // ======================== 色块宽度 ========================
  result.push(
    ...utils.repeat(() => {
      const width = utils.number.int({ min: 1, max: 100 });
      return {
        Q: `设置色块宽度为“${width}px”`,
        A: {
          data: {
            width: `${width}px`
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

  // ======================== 输出数据格式 ========================
  const formatOptions = [
    { label: 'RGB', value: 'rgb' },
    { label: 'HEX', value: 'hex' }
  ];
  result.push(
    ...formatOptions.map((item) => ({
      Q: `设置输出数据格式为“${item.label}”`,
      A: {
        data: {
          colorType: item.value
        }
      }
    }))
  );

  // ======================== 校验规则 ========================
  // TODO: src/form-coms/color/editors.ts:80

  return result;
});
