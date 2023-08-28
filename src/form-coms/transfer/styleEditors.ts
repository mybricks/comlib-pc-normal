import { Data } from './types'
const createEditor = (catelog, items: Array<StyleModeType<Data>>) => {
  return items.map(item => ({
    catelog,
    ...item
  }))
}
const  options =  [{ type: 'background', config: { disableBackgroundImage: true } }, 'border'];


export default [
  ...createEditor('默认', [
    {
      title: "选项",
      options,
      target: '.ant-transfer-list-content-item'
    },
    {
      title: "勾选框",
      options,
      target: '.ant-transfer-list-content-item:not(.ant-transfer-list-content-item-disabled) .ant-checkbox-inner'
    },
    {
      title: "穿梭按钮",
      options,
      target: 'button.ant-btn.ant-btn-primary.ant-btn-sm.ant-btn-icon-only:not(:disabled)'
    }
  ]),
  ...createEditor('Hover', [
    {
      title: "选项",
      options,
      target: '.ant-transfer-list-content-item:not(.ant-transfer-list-content-item-disabled):hover',
      domTarget: '.ant-transfer-list-content-item'
    },
    {
      title: "勾选框",
      options,
      target: '.ant-checkbox:hover .ant-checkbox-inner',
      domTarget: '.ant-checkbox-inner'
    },
    {
      title: "穿梭按钮",
      options,
      target: 'button.ant-btn.ant-btn-primary.ant-btn-sm.ant-btn-icon-only:not(:disabled):hover',
      domTarget: '.ant-btn-primary'
    }
  ]),
  ...createEditor('激活', [
    {
      title: "选项",
      options,
      target: '.ant-transfer-list-content-item-checked'
    },
    {
      title: "勾选框",
      options,
      target: '.ant-transfer-list-content-item .ant-checkbox-checked .ant-checkbox-inner'
    }
  ])
]