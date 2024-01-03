import { defineDataSet } from 'ai-dataset';

export default defineDataSet((utils) => {
  const result = {};

  const title = utils.string.alpha(5);
  result['标题'] = [
    {
      Q: `将标题设置为${title}`,
      A: {
        title
      }
    }
  ];

  const okText = utils.string.alpha(5);
  result['确认按钮文字'] = [
    {
      Q: `将确认按钮文字设置为${okText}`,
      A: {
        okText
      }
    }
  ];

  const cancelText = utils.string.alpha(5);
  result['取消按钮文字'] = [
    {
      Q: `将取消按钮文字设置为${cancelText}`,
      A: {
        cancelText
      }
    }
  ];

  result['是否显示取消按钮'] = [
    {
      Q: `不显示取消按钮`,
      A: {
        showCancel: false
      }
    }
  ];

  return result;
});
