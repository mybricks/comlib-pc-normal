import { Data, TreeData } from "./constants";

export const setCheckboxStatus = ({
  treeData,
  value,
}: {
  treeData: TreeData[];
  value: boolean;
}) => {
  if (!treeData || treeData.length === 0) return [];
  treeData.forEach((item) => {
    item.disableCheckbox = value;
    if (item.children) {
      setCheckboxStatus({ treeData: item.children || [], value }) || [];
    }
  });
  return treeData;
};

/**
 * 预处理树组件数据
 * @param param0
 * @returns
 */
export const pretreatTreeData = ({
  treeData,
  data,
  defaultExpandAll,
  parentKey = '0'
}: {
  treeData: TreeData[];
  data: Data;
  defaultExpandAll?: boolean;
  parentKey?: string;
}) => {
  const keyFieldName = data.keyFieldName || 'key';
  treeData.forEach((item, inx) => {
    if (item[keyFieldName] == null) {
      const id = parentKey + '-' + inx;
      item[keyFieldName] = id;
    }
    if (item.value == null) {
      // 若没有传入 value，则指定默认 value 为 key 值
      item.value = item[keyFieldName];
    }
    if (data && defaultExpandAll) {
      data.expandedKeys = [...data.expandedKeys, item[keyFieldName]];
    }
    if (item.children) {
      pretreatTreeData({ treeData: item.children, data, defaultExpandAll, parentKey: item[keyFieldName] });
    }
  });
  return treeData;
};

/**
 * 遍历树，根据key查找节点
 * @param param0 
 * @returns 
 */
export const traverseTree = ({
  data,
  targetKey,
  isEdit
}: {
  data: Data;
  targetKey: string;
  isEdit?: boolean;
}): { parent?: TreeData, index: number, node: TreeData } | null => {
  const { treeData, } = data;
  const keyFieldName = isEdit ? 'key' : data.keyFieldName || 'key';

  if (!treeData || treeData.length === 0) return null;
  const searchTree = (treeNode: TreeData, index: number, parent?: TreeData) => {
    if (treeNode[keyFieldName] === targetKey) {
      return {
        parent,
        node: treeNode,
        index
      };
    } else if (treeNode.children) {
      for (let i = 0; i < treeNode.children.length; i++) {
        const result = searchTree(treeNode.children[i], i, treeNode);
        if (result !== null) return result;
      }
    }
    return null;
  };

  for (let i = 0; i < treeData.length; i++) {
    const result = searchTree(treeData[i], i);
    if (result) return result;
  }
  return null;
};

/**
 * 数组扁平化
 * @param arr 数组
 * @returns
 */
const flatten = (arr: any[]) => {
  return arr.reduce((res, next) => {
    return res.concat(Array.isArray(next) ? flatten(next) : next);
  }, []);
};

/**
 * 获取所有叶子节点
 * @param treeData treeNodes 数据
 * @param keyFieldName 标识字段
 * @returns
 */
const getLeafNodes = (treeData: TreeData[], keyFieldName: string) => {
  const result: any[] = [];
  if (!treeData || treeData.length === 0) return;
  treeData.forEach((item) => {
    if (!item.children || item.children.length === 0) result.push(item[keyFieldName]);
    else result.push(getLeafNodes(item.children || [], keyFieldName));
  });
  return flatten(result);
};

/**
 * 排除父节点
 * @param checkedKeys 选中复选框的树节点 key 值
 * @param data 组件数据
 * @returns
 */
export const excludeParentKeys = (data: Data, checkedKeys: React.Key[]) => {
  const { treeData, keyFieldName = 'key' } = data;
  const result: any = [],
    leafNodes = getLeafNodes(treeData, keyFieldName);

  if (checkedKeys && Array.isArray(checkedKeys)) {
    checkedKeys.forEach((key) => {
      if (leafNodes.indexOf(key) !== -1) result.push(key);
    });
  }
  return result;
};

/**
 * 输出选中节点的 value 值
 * @param treeData treeNodes 数据
 * @param checkedKeys 选中复选框的树节点 keyFieldName 值
 * @param keyFieldName 标识字段
 * @returns
 */
export const outputNodeValues = (treeData: TreeData[], keys: React.Key[], keyFieldName: string) => {
  const result: any[] = [];
  treeData
    .filter((def) => !!def)
    .forEach((item) => {
      if ((keys || []).includes(item[keyFieldName])) result.push(item.value);
      result.push(outputNodeValues(item.children || [], keys, keyFieldName));
    });
  return flatten(result);
};

/**
 * 根据keyFieldName设置节点数据
 * @param treeData treeNodes 数据
 * @param newNodeData 节点数据
 * @returns
 */
export const updateNodeData = (treeData: TreeData[], newNodeData: TreeData, keyFieldName: string) => {
  treeData = treeData.map((item) => {
    if (item[keyFieldName] === newNodeData[keyFieldName]) {
      item = {
        ...item,
        ...newNodeData
      };
    } else if (item.children) {
      item.children = updateNodeData(item.children, newNodeData, keyFieldName);
    }
    return item;
  });
  return treeData;
};

/**
 * 根据选中节点的 value 此筛选出选中节点的 key
 * @param treeData treeNodes 数据
 * @param checkedValues 选中复选框的树节点 key 值
 * @param keyFieldName 标识字段
 * @returns
 */
export const filterCheckedKeysByCheckedValues = (treeData: TreeData[], checkedValues: string[], keyFieldName) => {
  if (!treeData || treeData.length === 0) return;
  const result: any[] = [];
  treeData.forEach((item) => {
    if ((checkedValues || []).includes(item.value)) {
      result.push(item[keyFieldName]);
    }
    if (item.children) {
      result.push(filterCheckedKeysByCheckedValues(item.children || [], checkedValues, keyFieldName));
    }
  });
  return flatten(result);
};
/**
 * 查找父节点
 * @param key 子节点key
 * @param tree
 * @param keyFieldName 标识字段
 * @returns
 */
export const getParentKey = (key, tree, keyFieldName: string) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item[keyFieldName] === key)) {
        parentKey = node[keyFieldName];
      } else if (getParentKey(key, node.children, keyFieldName)) {
        parentKey = getParentKey(key, node.children, keyFieldName);
      }
    }
  }
  return parentKey;
};

/**
 * 获取树的key数组
 * @param treeData 树节点数据
 * @param dataList key数组
 * @param keyFieldName 标识字段
 */
export const generateList = (treeData, dataList, keyFieldName) => {
  for (let i = 0; i < treeData.length; i++) {
    const node = treeData[i];
    const { [keyFieldName]: key, title } = node;
    dataList.push({ key, title });
    if (node.children) {
      generateList(node.children, dataList, keyFieldName);
    }
  }
};

/**
 * 遍历树，根据key数组返回节点
 * @param treeData 树数据 
 * @param keys key数组 
 * @param keyFieldName 标识字段
 * @returns 
 */
export const filterTreeDataByKeys = (treeData: TreeData[] = [], keys: React.Key[], keyFieldName: string) => {
  const filteredTreeData: TreeData[] = [];

  const filterTreeData = (treeData: TreeData[], parent: TreeData[]) => {
    treeData.forEach(node => {
      const { children = [], ...res } = node;
      const newChildren = [];
      if (children.length) {
        filterTreeData(children, newChildren);
      }
      if (keys.includes(res[keyFieldName])) {
        parent.push({
          ...res,
          children: newChildren
        });
      }
    })
  };

  filterTreeData(treeData, filteredTreeData);
  return filteredTreeData;
};

/**
 * 获取代码提示片段
 * @param data 组件数据
 * @returns 代码提示片段
 */
export const getNodeSuggestions = (data: Data) => [
  {
    label: 'node',
    insertText: `node.`,
    detail: `当前节点`,
    properties: [
      {
        label: 'isRoot',
        insertText: `{isRoot}`,
        detail: `当前节点是否为根节点`
      },
      {
        label: 'isLeaf',
        insertText: `{isLeaf}`,
        detail: `当前节点是否为叶子节点`
      },
      {
        label: 'checkable',
        insertText: `{checkable}`,
        detail: `当前节点的checkable值`
      },
      {
        label: 'depth',
        insertText: `{depth}`,
        detail: `当前节点的深度`
      },
      {
        label: data.keyFieldName || 'key',
        insertText: `{${data.keyFieldName || 'key'}}` + ' === ',
        detail: `当前节点标识字段值`
      },
      {
        label: data.titleFieldName || 'title',
        insertText: `{${data.titleFieldName || 'title'}}` + ' === ',
        detail: `当前节点标题字段值`
      },
      {
        label: data.childrenFieldName || 'children',
        insertText: `{${data.childrenFieldName || 'children'}}` + ' === ',
        detail: `当前节点子节点字段值`
      },
    ]
  }
];