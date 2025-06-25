
export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '树，树状图',
    usage: `data数据模型
filterNames: string[]
useStaticData: true
treeData: {
title: string,
key: string,
children: []
}[]
checkable: boolean
draggable: boolean
allowDrop: boolean
useDropScope: boolean
valueType: string
showLine: boolean
disableCheckbox: boolean
openDepth: number
titleEllipsis: boolean
expandedKeys: string[]
actionBtns: [
{
  type: string
  title: string 
  danger: boolean
  size: string
  id: string
  iconConfig: {
    src: boolean
    size: number[]
    gutter: number
  }
}
]
removeConfirm: string


styleAry声明
树组件: .ant-tree
缩进: .ant-tree-indent-unit
展开收起图标: .ant-tree-switcher
节点内容: .ant-tree-treenode > .ant-tree-node-content-wrapper
节点标题: .ant-tree-treenode > .ant-tree-node-content-wrapper > .ant-tree-title .title
空状态图片: .ant-empty-image > svg, .ant-empty-image > img
空状态文案: .ant-empty-description
`
  }
};
