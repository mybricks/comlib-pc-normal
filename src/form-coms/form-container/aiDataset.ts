import { defineDataSet, DataSetItem } from 'ai-dataset';

export default defineDataSet((utils) => {
  const result: DataSetItem[] = [];
  // ======================== 类型 ========================
  // TODO: add or remove outputs (src/form-coms/form-container/editors/index.tsx:224)
  const typeOptions = [
    { label: '普通表单', value: 'Form' },
    { label: '查询表单', value: 'QueryFilter' }
  ];

  result.push(
    ...typeOptions.map((item) => ({
      Q: `将表单类型设置为${item.label}`,
      A: {
        layoutType: item.value
      }
    }))
  );

  // ======================== 默认折叠表单项 ========================
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `将默认折叠表单项设置为${item.label}`,
      A: {
        layoutType: 'QueryFilter',
        defaultCollapsed: item.value
      }
    }))
  );

  // ======================== 提交隐藏表单项 ========================
  const submitHiddenFieldsOptions = [
    { label: '是', value: true },
    { label: '否', value: false }
  ];
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `将提交隐藏表单项设置为${item.label}`,
      A: {
        submitHiddenFields: item.value
      }
    }))
  );

  // ======================== 添加表单项 ========================
  // TODO: src/form-coms/form-container/editors/index.tsx:272

  // ======================== 表单项布局-类型 ========================
  const fieldsLayoutOptions = [
    { label: '水平', value: 'horizontal' },
    { label: '垂直', value: 'vertical' },
    { label: '内联', value: 'inline' }
  ];
  result.push(
    ...fieldsLayoutOptions.map((item) => ({
      Q: `将表单项布局类型设置为${item.label}`,
      A: {
        config: { layout: item.value }
      }
    }))
  );

  // ======================== 表单项布局-表单项宽度 ========================
  const fieldWidths = Array.from({ length: 24 }, (_, i) => i + 1);
  result.push(
    ...fieldWidths.map((item) => ({
      Q: `将表单项宽度设置为${item}/24`,
      A: {
        config: { span: item, actions: { align: 'right' } }
      }
    }))
  );

  // ======================== 标题宽度类型 ========================
  const titleWithTypeOptions = [
    { label: '固定像素', value: 'px' },
    { label: '24 栅格', value: 'span' }
  ];
  result.push(
    ...titleWithTypeOptions.map((item) => ({
      Q: `将标题宽度类型设置为${item.label}`,
      A: {
        labelWidthType: item.value
      }
    }))
  );

  // ======================== 标题宽度(px) ========================
  const titleWidthsPx = Array.from({ length: 8 }, (_, i) => utils.number.int({ min: 1, max: 400 }));
  result.push(
    ...titleWidthsPx.map((item) => ({
      Q: `将标题宽度设置为${item}px`,
      A: {
        labelWidthType: 'px',
        labelWidth: item
      }
    }))
  );

  // ======================== 标题宽度(栅格) ========================
  const titleWidthsSpan = Array.from({ length: 24 }, (_, i) => i + 1);
  result.push(
    ...titleWidthsSpan.map((item) => ({
      Q: `将标题宽度设置为${item}格`,
      A: {
        labelWidthType: 'span',
        labelCol: item
      }
    }))
  );

  // ======================== 显示冒号 ========================
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `将标题显示冒号设置为${item.label}`,
      A: {
        config: {
          colon: item.value
        }
      }
    }))
  );

  // ======================== 自动换行 ========================
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `将标题自动换行设置为${item.label}`,
      A: {
        config: {
          labelWrap: item.value
        }
      }
    }))
  );

  // ======================== 对齐方式 ========================
  const alignOptions = [
    { label: '左对齐', value: 'left' },
    { label: '右对齐', value: 'right' }
  ];
  result.push(
    ...alignOptions.map((item) => ({
      Q: `将标题对齐方式设置为${item.label}`,
      A: {
        config: {
          labelAlign: item.value
        }
      }
    }))
  );

  return result;
});
