import { defineDataSet } from 'ai-dataset';

export default defineDataSet((utils) => {
  const result = {};

  result['响应式布局'] = [
    {
      Q: `打开响应式布局`,
      A: {
        data: {
          isResponsive: true
        }
      }
    }
  ];

  result['自定义断点'] = [
    {
      Q: `自定义断点`,
      A: {
        data: {
          isResponsive: true,
          isCustomPoints: true
        }
      }
    }
  ];

  result['间隔'] = utils.options
    .slider({
      min: 0,
      max: 1000,
      step: 100
    })
    .map(({ value }) => ({
      Q: `将左右间隔设置为${value}，上下间隔设置为${value}`,
      A: {
        data: {
          grid: {
            gutter: [value, value]
          }
        }
      }
    }));

  result['获取列表数据'] = [
    {
      Q: `开启获取列表数据`,
      A: {
        data: {
          useGetDataSource: true
        }
      }
    }
  ];

  result['loading'] = [
    {
      Q: `开启loading`,
      A: {
        data: {
          useLoading: true
        }
      }
    }
  ];

  const loadingTip = utils.string.alpha(5);
  result['加载中文案'] = [
    {
      Q: `将加载中文案设置为${loadingTip}`,
      A: {
        data: {
          useLoading: true,
          loadingTip
        }
      }
    }
  ];

  return result;
});
