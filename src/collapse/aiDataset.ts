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

  result['开启自定义标题'] = [
    {
      Q: `开启自定义标题`,
      A: {
        isCustomTitle: true
      }
    }
  ];

  result['默认展开'] = [
    {
      Q: `默认展开`,
      A: {
        expanded: true
      }
    }
  ];

  result['额外操作'] = [
    {
      Q: `打开额外操作`,
      A: {
        useExtra: true
      }
    }
  ];

  return result;
});
