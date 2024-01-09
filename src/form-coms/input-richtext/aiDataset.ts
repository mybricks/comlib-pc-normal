import { defineDataSet, DataSetItem } from 'ai-dataset';
import { toolbarOptions } from './utils';

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
            placeholder: `请输入${placeholder}`
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

  // ======================== 自定义上传 ========================
  // TODO: src/form-coms/input-richtext/editors.tsx:87
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `${item.label}自定义上传`,
      A: {
        data: {
          customUpload: item.value
        }
      }
    }))
  );

  // ======================== 显示编辑栏 ========================
  result.push(
    ...utils.options.switch().map((item) => ({
      Q: `${item.label}显示编辑栏`,
      A: {
        data: {
          displayEditbar: item.value
        }
      }
    }))
  );

  // ======================== 插件选择 ========================
  result.push({
    Q: `选择插件${toolbarOptions.map((item) => item.label).join('、')}`,
    A: {
      data: {
        toolbar: toolbarOptions.map((item) => item.value)
      }
    }
  });

  // ======================== 校验 ========================
  // TODO: src/form-coms/input-richtext/editors.tsx:159

  return result;
});
