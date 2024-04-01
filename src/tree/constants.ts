export const InputIds = {
  SetTreeData: 'treeData',
  SetNodeData: 'nodeData',
  SetSearchValue: 'searchValue',
  SetFilterValue: 'filter',
  SetSelectedKeys: 'setSelectedKeys',
  SetExpandedKeys: 'setExpandedKeys',
  SetCheckedKeys: 'checkedValues',
  SetDisableCheckbox: 'disableCheckbox',
  SetEnableCheckbox: 'enableCheckbox',
  SetDragConfig: 'setDragConfig',
  SetOpenDepth: 'setOpenDepth',
  SetAddTips: 'addTips',
  GetCheckedKeys: 'submit',
  GetTreeData: 'getTreeData',
  SetLoadData: 'setLoadData',
}

export const OutputIds = {
  OnChange: 'onChange',
  OnDropDone: 'onDropDone',
  AddNodeDone: 'addNodeDone',
  OnNodeClick: 'click',
  OnCheck: 'check',
  ReturnTreeData: 'returnTreeData',
  LoadData: 'loadData',
  SetLoadDataDone: 'setLoadDataDone',
}

export const DragConfigKeys = ['draggable', 'draggableScript', 'allowDrop', 'allowDropScript', 'useDropScope', 'dropScopeMessage'];

export const DefaultStaticData = '%5B%0A%20%20%7B%0A%20%20%20%20%22key%22%3A%20%22%E7%AC%AC%E4%B8%80%E7%BA%A7%201%22%2C%0A%20%20%20%20%22title%22%3A%20%22%E7%AC%AC%E4%B8%80%E7%BA%A7%201%22%2C%0A%20%20%20%20%22children%22%3A%20%5B%0A%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%22key%22%3A%20%22%E7%AC%AC%E4%BA%8C%E7%BA%A7%201-1%22%2C%0A%20%20%20%20%20%20%20%20%22title%22%3A%20%22%E7%AC%AC%E4%BA%8C%E7%BA%A7%201-1%22%2C%0A%20%20%20%20%20%20%20%20%22children%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22key%22%3A%20%22%E5%8F%B6%E5%AD%90%201-1-1%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22title%22%3A%20%22%E5%8F%B6%E5%AD%90%201-1-1%22%0A%20%20%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22key%22%3A%20%22%E5%8F%B6%E5%AD%90%201-1-2%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22title%22%3A%20%22%E5%8F%B6%E5%AD%90%201-1-2%22%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%22key%22%3A%20%22%E7%AC%AC%E4%BA%8C%E7%BA%A7%201-2%22%2C%0A%20%20%20%20%20%20%20%20%22title%22%3A%20%22%E7%AC%AC%E4%BA%8C%E7%BA%A7%201-2%22%2C%0A%20%20%20%20%20%20%20%20%22children%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22key%22%3A%20%22%E5%8F%B6%E5%AD%90%201-2-1%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22title%22%3A%20%22%E5%8F%B6%E5%AD%90%201-2-1%22%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%20%20%7D%0A%5D';

export const placeholderTreeData = [
  {
    title: '0(搭建态占位数据)',
    key: '0',
    children: [
      {
        title: '0-0',
        key: '0-0',
        children: [
          {
            title: '0-0-1',
            key: '0-0-1',
          },
          {
            title: '0-0-2',
            key: '0-0-2',
          },
        ],
      },
      {
        title: '0-1',
        key: '0-1',
      },
    ],
  }
]