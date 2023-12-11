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
  GetCheckedKeys: 'submit'
}

export const OutputIds = {
  OnDropDone: 'onDropDone',
  OnNodeClick: 'click',
  OnCheck: 'check'
}

export const DragConfigKeys = ['draggable', 'draggableScript', 'allowDrop', 'allowDropScript', 'useDropScope', 'dropScopeMessage'];

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