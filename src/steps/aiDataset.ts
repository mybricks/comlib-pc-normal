import { defineDataSet } from 'ai-dataset';

export default defineDataSet((utils) => {
  const result = {};

  const typeOptions = [
    { label: '默认', value: 'default' },
    { label: '导航类型', value: 'navigation' },
    { label: '点状类型', value: 'dotted' }
  ];
  result['类型'] = typeOptions.map((item) => ({
    Q: `将类型设置为${item.label}`,
    A: {
      steps: {
        type: item.value
      }
    }
  }));

  const sizeOptions = [
    { label: '默认', value: 'default' },
    { label: '迷你', value: 'small' }
  ];
  result['尺寸'] = sizeOptions.map((item) => ({
    Q: `将尺寸设置为${item.label}`,
    A: {
      steps: {
        size: item.value
      }
    }
  }));

  const directionOptions = [
    { label: '水平', value: 'horizontal' },
    { label: '竖直', value: 'vertical' }
  ];
  result['方向'] = directionOptions.map((item) => ({
    Q: `将方向设置为${item.label}`,
    A: {
      steps: {
        direction: item.value
      }
    }
  }));

  result['描述'] = [
    {
      Q: `显示描述`,
      A: {
        steps: {
          showDesc: true
        }
      }
    }
  ];

  result['点击切换'] = [
    {
      Q: `关闭点击切换`,
      A: {
        steps: {
          canClick: false
        }
      }
    }
  ];

  result['操作栏'] = [
    {
      Q: `打开操作栏`,
      A: {
        toolbar: {
          showActions: true
        }
      }
    }
  ];

  const btnsOptions = [
    {
      label: '上一步',
      value: 'previous'
    },
    {
      label: '下一步',
      value: 'next'
    },
    {
      label: '提交',
      value: 'submit'
    }
  ];
  result['按钮组'] = btnsOptions.map((item) => ({
    Q: `将按钮组设置为${item.label}`,
    A: {
      toolbar: {
        btns: [item.value]
      }
    }
  }));

  return result;
});
