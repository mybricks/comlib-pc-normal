import { defineDataSet } from 'ai-dataset';

export default defineDataSet((utils) => {
  const result = {};

  const title = utils.string.alpha(5);
  result['标题'] = [
    {
      Q: `将标题设置为${title}`,
      A: {
        data: { title }
      }
    }
  ];

  result['开启自定义标题'] = [
    {
      Q: `开启自定义标题`,
      A: {
        data: {
          isCustomTitle: true
        }
      }
    }
  ];

  result['默认展开'] = [
    {
      Q: `默认展开`,
      A: {
        data: {
          expanded: true
        }
      }
    }
  ];

  result['额外操作'] = [
    {
      Q: `打开额外操作`,
      A: {
        data: {
          useExtra: true
        }
      }
    }
  ];

  return result;
});
