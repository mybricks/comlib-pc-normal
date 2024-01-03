import { defineDataSet } from 'ai-dataset';

export default defineDataSet((utils) => {
  const result = {};

  const typeOptions = [
    { value: 'card', label: '卡片' },
    { value: 'line', label: '简约' }
  ];
  result['外观'] = typeOptions.map((item) => ({
    Q: `设置为${item.label}风格`,
    A: {
      data: {
        type: item.value
      }
    }
  }));

  const tabPositionOptions = [
    { label: '上', value: 'top' },
    { label: '左', value: 'left' },
    { label: '右', value: 'right' },
    { label: '下', value: 'bottom' }
  ];
  result['标签位置'] = tabPositionOptions.map((item) => ({
    Q: `将标签位置设置为${item.label}`,
    A: {
      data: {
        tabPosition: item.value
      }
    }
  }));

  result['标签居中'] = [
    {
      Q: `将标签居中`,
      A: {
        data: {
          centered: true
        }
      }
    }
  ];

  result['禁止点击切换'] = [
    {
      Q: `禁止点击切换`,
      A: {
        data: {
          prohibitClick: true
        }
      }
    }
  ];

  result['动态设置显示tab'] = [
    {
      Q: `动态设置显示tab`,
      A: {
        data: {
          useDynamicTab: true
        }
      }
    }
  ];

  result['隐藏插槽占位'] = [
    {
      Q: `隐藏插槽占位`,
      A: {
        data: {
          hideSlots: true
        }
      }
    }
  ];

  result['左侧'] = [
    {
      Q: `在左侧显示额外内容`,
      A: {
        data: {
          useLeftExtra: true
        }
      }
    }
  ];

  result['右侧'] = [
    {
      Q: `在右侧显示额外内容`,
      A: {
        data: {
          useRigthExtra: true
        }
      }
    }
  ];

  return result;
});
