import { defineDataSet } from "ai-dataset";

const BTN_LIST = [
  [{ label: '上一步', value: 'previous' }],
  [{ label: '下一步', value: 'next' }],
  [{ label: '提交', value: 'submit' }],
  [{ label: '上一步', value: 'previous' }, { label: '下一步', value: 'next' }],
  [{ label: '上一步', value: 'previous' }, { label: '提交', value: 'submit' }],
  [{ label: '下一步', value: 'next' }, { label: '提交', value: 'submit' }],
  [{ label: '上一步', value: 'previous' }, { label: '下一步', value: 'next' }, { label: '提交', value: 'submit' }]
];

export default defineDataSet((utils) => {
  const result = {};
  result['类型'] = [
    { label: '默认', value: 'default' },
    { label: '导航类型', value: 'navigation' },
    { label: '点状类型', value: 'dotted' }
  ].map(item => {
    return {
      Q: `将类型设置为${item.label}`,
      A: { data: { steps: { type: item.value } } },
    };
  });
  result['尺寸'] = [
    { label: '默认', value: 'default' },
    { label: '迷你', value: 'small' }
  ].map(item => {
    return {
      Q: `将尺寸设置为${item.label}`,
      A: { data: { steps: { size: item.value } } },
    };
  });
  result['方向'] = [
    { label: '水平', value: 'horizontal' },
    { label: '竖直', value: 'vertical' }
  ].map(item => {
    return {
      Q: `将方向设置为${item.label}`,
      A: { data: { steps: { direction: item.value } } },
    };
  });
  result['描述'] = utils.options.switch().map(item => {
    return {
      Q: `${item.label}描述信息展示功能`,
      A: { data: { steps: { showDesc: item.value } } },
    };
  });
  result['点击切换'] = utils.options.switch().map(item => {
    return {
      Q: `${item.label}点击切换功能`,
      A: { data: { steps: { canClick: item.value } } },
    };
  });
  result['操作栏'] = utils.options.switch().map(item => {
    return {
      Q: `${item.label}操作栏区域`,
      A: { data: { toolbar: { showActions: item.value } } },
    };
  });
  result['按钮组'] = BTN_LIST.map(item => {
    return {
      Q: `操作栏按钮组设置包含${item.map(i => i.label).join('、')}`,
      A: { data: { toolbar: { showActions: true, btns: item.map(i => i.value) } } },
    };
  });
  result['隐藏插槽占位'] = utils.options.switch().map(item => {
    return {
      Q: `${item.label}隐藏插槽占位的开关`,
      A: { data: { hideSlots: item.value } },
    };
  });
  result['操作栏的对齐方式'] = [
    { label: '左对齐', value: 'flex-start' },
    { label: '居中', value: 'center' },
    { label: '右对齐', value: 'flex-end' }
  ].map(item => {
    return {
      Q: `将操作栏的对齐方式设置为${item.label}`,
      A: { data: { toolbar: { actionAlign: item.value } } },
    };
  });
  result['操作栏的置底开关'] = utils.options.switch().map(item => {
    return {
      Q: `${item.label}操作栏置底的开关`,
      A: { data: { toolbar: { showActions: true, fixed: item.value } } },
    };
  });
  result['操作栏的底部距离'] = [
    utils.number.int({ min: 0, max: 100 }),
    utils.number.int({ min: 0, max: 100 }),
    utils.number.int({ min: 0, max: 100 })
  ].map(item => {
    return {
      Q: `将操作栏的底部距离设置为${item}`,
      A: { data: { toolbar: { fixed: true, bottom: item } } },
    };
  });
  result['操作栏的主按钮文案'] = [
    utils.string.alpha(6),
    utils.string.alpha(6),
    utils.string.alpha(6),
  ].map(item => {
    return {
      Q: `将操作栏的主按钮文案设置为${item}`,
      A: { data: { toolbar: { primaryBtnText: item } } },
    };
  });
  result['操作栏的上一步按钮文案'] = [
    utils.string.alpha(6),
    utils.string.alpha(6),
    utils.string.alpha(6),
  ].map(item => {
    return {
      Q: `将操作栏的上一步按钮文案设置为${item}`,
      A: { data: { toolbar: { secondBtnText: item } } },
    };
  });
  result['操作栏的提交按钮文案'] = [
    utils.string.alpha(6),
    utils.string.alpha(6),
    utils.string.alpha(6),
  ].map(item => {
    return {
      Q: `将操作栏的提交按钮文案设置为${item}`,
      A: { data: { toolbar: { submitText: item } } },
    };
  });

  /** TODO: 步骤复杂编辑项、样式 */
  result['步骤'] = [];

  return result;
});
