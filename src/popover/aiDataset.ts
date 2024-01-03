import { defineDataSet } from 'ai-dataset';

export default defineDataSet((utils) => {
  const result = {};
  result['标题自定义'] = [
    {
      Q: `自定义标题`,
      A: {
        data: {
          useTitleSlot: true
        }
      }
    }
  ];

  const title = utils.string.alpha(5);
  result['标题'] = [
    {
      Q: `将标题设置为${title}`,
      A: {
        data: {
          useTitleSlot: false,
          title
        }
      }
    }
  ];

  result['内容自定义'] = [
    {
      Q: `自定义内容`,
      A: {
        data: {
          useContentSlot: true
        }
      }
    }
  ];

  const content = utils.string.alpha(5);
  result['内容'] = [
    {
      Q: `将内容设置为${content}`,
      A: {
        data: {
          useContentSlot: false,
          content
        }
      }
    }
  ];

  const triggerOptions = [
    {
      label: '悬浮',
      value: 'hover'
    },
    {
      label: '点击',
      value: 'click'
    },
    {
      label: '聚焦',
      value: 'focus'
    }
  ];
  result['触发方式'] = triggerOptions.map((item) => ({
    Q: `将触发方式设置为${item.label}`,
    A: {
      data: {
        textAlign: item.value
      }
    }
  }));

  const placementOptions = [
    {
      label: '左上',
      value: 'leftTop'
    },
    {
      label: '上',
      value: 'top'
    },
    {
      label: '右上',
      value: 'rightTop'
    },
    {
      label: '左下',
      value: 'leftBottom'
    },
    {
      label: '下',
      value: 'bottom'
    },
    {
      label: '右下',
      value: 'rightBottom'
    },
    {
      label: '左',
      value: 'left'
    },
    {
      label: '右',
      value: 'right'
    }
  ];
  result['方向'] = placementOptions.map((item) => ({
    Q: `将方向设置为${item.label}`,
    A: {
      data: {
        placement: item.value
      }
    }
  }));

  return result;
});
