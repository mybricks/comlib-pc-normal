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

  // ======================== 日期选择类型 ========================
  const pickerOptions = [
    { label: '日期', value: 'date' },
    { label: '周', value: 'week' },
    { label: '月份', value: 'month' },
    { label: '季度', value: 'quarter' },
    { label: '年份', value: 'year' }
  ];
  result.push(
    ...pickerOptions.map((item) => ({
      Q: `设置日期选择类型为${item.label}`,
      A: {
        data: {
          config: {
            picker: item.value
          }
        }
      }
    }))
  );

  // ======================== 默认面板日期 ========================
  result.push(
    ...utils.repeat(() => {
      const date = utils.date.anytime();
      return {
        Q: `设置默认面板日期为${date}`,
        A: {
          data: {
            defaultPickerValue: date
          }
        }
      };
    })
  );

  // ======================== 时间选择 ========================
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `${item.label}时间选择`,
      A: {
        data: {
          showTime: item.value
        }
      }
    }))
  );

  // ======================== 周号隐藏 ========================
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `${item.label}周号隐藏`,
      A: {
        data: {
          isWeekNumber: item.value,
          config: {
            picker: 'week'
          }
        }
      }
    }))
  );

  // ======================== 日期禁止选择 ========================
  const useDisabledDateOptions = [
    {
      label: '无',
      value: 'default'
    },
    {
      label: '静态配置',
      value: 'static'
    }
  ];
  result.push(
    ...useDisabledDateOptions.map((item) => ({
      Q: `${item.label}日期禁止选择`,
      A: {
        data: {
          useDisabledDate: item.value
        }
      }
    }))
  );

  // ======================== 静态配置 ========================
  // TODO: src/form-coms/date-picker/editors.ts:169

  // ======================== 默认时间 ========================
  result.push(
    ...utils.repeat(() => {
      const date = utils.date.anytime();
      const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      return {
        Q: `设置默认时间为${time}`,
        A: {
          data: {
            defaultPickerValue: time
          }
        }
      };
    })
  );

  // ======================== 校验规则 ========================
  // TODO: src/form-coms/date-picker/editors.ts:237

  // ======================== 日期展示格式 ========================
  // TODO: src/form-coms/date-picker/editors.ts:306

  // ======================== 输出数据处理 ========================
  // TODO: src/form-coms/date-picker/editors.ts:362

  return result;
});
