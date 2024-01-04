import { DataSetItem, defineDataSet } from 'ai-dataset';

export default defineDataSet((utils) => {
  const result: DataSetItem[] = [];

  // ======================== 提示内容 ========================
  const placeholders = Array.from({ length: 8 }, (_, i) => utils.lorem.sentence());
  result.push(
    ...placeholders.map((placeholder) => ({
      Q: `值为空时提示"${placeholder}"`,
      A: {
        data: {
          config: {
            placeholder
          }
        }
      }
    }))
  );

  // ======================== 前置标签 ========================
  const addonBefore = Array.from({ length: 8 }, (_, i) => utils.lorem.word());
  result.push(
    ...addonBefore.map((addonBefore) => ({
      Q: `将前置标签设置为"${addonBefore}"`,
      A: {
        data: {
          config: {
            addonBefore
          }
        }
      }
    }))
  );

  // ======================== 后置标签 ========================
  const addonAfter = Array.from({ length: 8 }, (_, i) => utils.lorem.word());
  result.push(
    ...addonAfter.map((addonAfter) => ({
      Q: `将后置标签设置为"${addonAfter}"`,
      A: {
        data: {
          config: {
            addonAfter
          }
        }
      }
    }))
  );

  // ======================== 禁用状态 ========================
  result.push(
    ...utils.options.switch().map((disabled) => ({
      Q: `${disabled.label}禁用状态`,
      A: {
        data: {
          config: {
            disabled
          }
        }
      }
    }))
  );

  // ======================== 数值精度 ========================
  result.push(
    ...utils.options.slider({ min: 0, max: 10 }).map((precision) => ({
      Q: `数值精度设置为${precision.value}`,
      A: {
        data: {
          config: {
            precision: precision.value
          }
        }
      }
    }))
  );

  // ======================== 步长 ========================
  const randomInt = Array.from({ length: 8 }, (_, i) => utils.number.int({ min: 1, max: 100 }));
  result.push(
    ...randomInt.map((min) => ({
      Q: `步长设置为${min}`,
      A: {
        data: {
          config: {
            step: min
          }
        }
      }
    }))
  );

  // ======================== 格式化展示 ========================
  result.push(
    ...utils.options.switch().map((isFormatter) => ({
      Q: `${isFormatter.label}格式化展示`,
      A: {
        data: {
          isFormatter: isFormatter.value
        }
      }
    }))
  );

  // ======================== 字符位置 ========================
  const positionOptions = [
    { label: '前缀', value: 'prefix' },
    { label: '后缀', value: 'suffix' }
  ];
  result.push(
    ...positionOptions.map((position) => ({
      Q: `设置格式化${position.label}字符`,
      A: {
        data: {
          isFormatter: true,
          charPostion: position.value
        }
      }
    }))
  );

  // ======================== 格式化字符 ========================
  const formatChars = Array.from({ length: 8 }, (_, i) => utils.lorem.word());
  result.push(
    ...formatChars.map((character) => ({
      Q: `设置格式化字符为"${character}"`,
      A: {
        data: {
          isFormatter: true,
          character
        }
      }
    }))
  );

  // ======================== 最大值限制 ========================
  result.push(
    ...utils.options.switch().map((isMax) => ({
      Q: `${isMax.label}最大值限制`,
      A: {
        data: {
          isMax: isMax.value
        }
      }
    }))
  );

  // ======================== 最大值 ========================
  const max = Array.from({ length: 8 }, (_, i) => utils.number.int({ min: -200, max: 200 }));
  result.push(
    ...max.map((max) => ({
      Q: `将最大值设置为${max}`,
      A: {
        data: {
          isMax: true,
          max
        }
      }
    }))
  );

  // ======================== 最小值限制 ========================
  result.push(
    ...utils.options.switch().map((isMin) => ({
      Q: `${isMin.label}最小值限制`,
      A: {
        data: {
          isMin: isMin.value
        }
      }
    }))
  );

  // ======================== 最小值 ========================
  const min = Array.from({ length: 8 }, (_, i) => utils.number.int({ min: -200, max: 200 }));
  result.push(
    ...min.map((min) => ({
      Q: `将最小值设置为${min}`,
      A: {
        data: {
          isMin: true,
          min
        }
      }
    }))
  );

  // ======================== 校验规则 ========================
  // TODO: src/form-coms/input-number/editors.ts:229

  return result;
});
