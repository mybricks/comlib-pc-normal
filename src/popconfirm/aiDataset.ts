import { defineDataSet } from 'ai-dataset';

export default defineDataSet((utils) => {
  const result = {};

  const title = utils.lorem.word({ length: { min: 0, max: 10 } });
  result['标题'] = [
    {
      Q: `将标题设置为“${title}”`,
      A: {
        data: {
          title
        }
      }
    }
  ];

  const okText = utils.lorem.word({ length: { min: 0, max: 5 } });
  result['确认按钮文字'] = [
    {
      Q: `将确认按钮文字设置为“${okText}”`,
      A: {
        data: {
          okText
        }
      }
    }
  ];

  const cancelText = utils.lorem.word({ length: { min: 0, max: 5 } });
  result['取消按钮文字'] = [
    {
      Q: `将取消按钮文字设置为“${cancelText}”`,
      A: {
        data: {
          cancelText
        }
      }
    }
  ];

  result['是否显示取消按钮'] = [
    {
      Q: `不显示取消按钮`,
      A: {
        data: {
          showCancel: false
        }
      }
    }
  ];

  return result;
});
