const createEditor = (title, target, domTarget?) => {
  return {
    title,
    options: [{ type: 'background', config: { disableBackgroundImage: true } }, 'border'],
    target,
    domTarget
  }
}


export default [
  createEditor('选项-默认', '.ant-transfer-list-content-item'),
  createEditor('选项-hover', '.ant-transfer-list-content-item:not(.ant-transfer-list-content-item-disabled):hover', '.ant-transfer-list-content-item'),
  createEditor('选项-focus', '.ant-transfer-list-content-item-checked'),
  createEditor('勾选框-默认', '.ant-transfer-list-content-item:not(.ant-transfer-list-content-item-disabled) .ant-checkbox-inner'),
  createEditor('勾选框-hover', '.ant-checkbox:hover .ant-checkbox-inner', '.ant-checkbox-inner'),
  createEditor('勾选框-focus', '.ant-transfer-list-content-item .ant-checkbox-checked .ant-checkbox-inner'),
  createEditor('穿梭按钮-默认', 'button.ant-btn.ant-btn-primary.ant-btn-sm.ant-btn-icon-only:not(:disabled)'),
  createEditor('穿梭按钮-hover', 'button.ant-btn.ant-btn-primary.ant-btn-sm.ant-btn-icon-only:not(:disabled):hover', '.ant-btn-primary'),
]