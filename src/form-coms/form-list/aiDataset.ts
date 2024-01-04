import { DataSetItem, defineDataSet } from 'ai-dataset';

export default defineDataSet((utils) => {
  const result: DataSetItem[] = [];
  // ======================== 每行列数 ========================
  result.push(
    ...utils.options
      .slider({
        min: 1,
        max: 6,
        step: 1,
        formatter: '个/行'
      })
      .map((option) => ({
        Q: `将每行的表单项数量设置为${option.value}`,
        A: {
          data: {
            formItemColumn: option.value,
            actions: {
              span: 24 / option.value
            }
            // TODO: src/form-coms/form-list/editors/index.ts:241
            // TODO: src/form-coms/form-list/editors/index.ts:244
          }
        }
      }))
  );

  // ======================== 子项标题 ========================
  result.push(
    ...utils.options.switch().map((option) => ({
      Q: `默认${option.label}子项标题的显示`,
      A: {
        data: {
          showTitle: option.value
        }
      }
    }))
  );

  // ======================== 子项标题宽度类型 ========================
  const widthTypeOptions = [
    { label: '固定像素', value: 'px' },
    { label: '24 栅格', value: 'span' }
  ];
  result.push(
    ...widthTypeOptions.map((option) => ({
      Q: `将子项标题宽度类型设置为${option.label}`,
      A: {
        data: {
          showTitle: true,
          labelWidthType: option.value
        }
      }
    }))
  );

  // ======================== 子标题宽度（px） ========================
  result.push(
    ...utils.options
      .slider({
        min: 1,
        max: 200,
        step: 1,
        formatter: 'px'
      })
      .map((option) => ({
        Q: `将子项标题宽度设置为${option.value}px`,
        A: {
          data: {
            showTitle: true,
            labelWidthType: 'px',
            labelWidth: option.value
          }
        }
      }))
  );

  // ======================== 子标题宽度（栅格） ========================
  result.push(
    ...utils.options
      .slider({
        min: 1,
        max: 24,
        step: 1,
        formatter: '栅格'
      })
      .map((option) => ({
        Q: `将子项标题宽度设置为${option.value}个栅格`,
        A: {
          data: {
            showTitle: true,
            labelWidthType: 'span',
            labelWidth: option.value
          }
        }
      }))
  );

  // ======================== 子标题冒号 ========================
  result.push(
    ...utils.options.switch().map((option) => ({
      Q: `默认${option.label}子项标题后的冒号`,
      A: {
        data: {
          showTitle: true,
          formItemConfig: {
            colon: option.value
          }
        }
      }
    }))
  );

  // ======================== 子标题对齐方式 ========================
  const labelAlignOptions = [
    { label: '左对齐', value: 'left' },
    { label: '右对齐', value: 'right' }
  ];
  result.push(
    ...labelAlignOptions.map((option) => ({
      Q: `将子项标题对齐方式设置为${option.label}`,
      A: {
        data: {
          showTitle: true,
          formItemConfig: {
            labelAlign: option.value
          }
        }
      }
    }))
  );

  // ======================== 添加表单项 ========================
  // TODO: src/form-coms/form-list/editors/index.ts:375

  // ======================== 提交隐藏表单项 ========================
  result.push(
    ...utils.options.switch().map((option) => ({
      Q: `提交时${option.value ? '隐藏' : '显示'}表单项`,
      A: {
        data: {
          hideSubmitItems: option.value
        }
      }
    }))
  );

  // ======================== 校验规则 ========================
  // TODO: src/form-coms/form-list/editors/index.ts:422

  return result;
});
