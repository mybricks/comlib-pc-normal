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
    const id = parentKey + '-' + inx;
    // key不是唯一标识但源数据存在该字段时需要额外处理
    if (keyFieldName !== 'key' && item.key != null) {
      item._key = item.key;
    }
    item.key = item[keyFieldName] == undefined ? id : String(item[keyFieldName]);
    if (item.value == null) {
      // 若没有传入 value，则指定默认 value 为 key 值
      item.value = item.key;
    }
    if (data && defaultExpandAll) {
      data.expandedKeys = [...data.expandedKeys, item.key];
    }
    if (item.children) {
      pretreatTreeData({ treeData: item.children, data, defaultExpandAll, parentKey: item.key });
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
  treeData,
  targetKey,
  isParent = false,
}: {
  treeData: TreeData[];
  targetKey: string;
  isParent?: boolean;
}) => {
  if (!treeData || treeData.length === 0) return null;
  const searchTree = (treeNode: TreeData, parent?: TreeData) => {
    if (treeNode.key === targetKey) {
      return isParent && parent ? parent : treeNode;
    } else if (treeNode.children) {
      for (let i = 0; i < treeNode.children.length; i++) {
        const result = searchTree(treeNode.children[i], treeNode);
        if (result !== null) return result;
      }
    }
    return null;
  };

  for (let i = 0; i < treeData.length; i++) {
    const result = searchTree(treeData[i]);
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
 * @returns
 */
const getLeafNodes = (treeData: TreeData[]) => {
  const result: any[] = [];
  if (!treeData || treeData.length === 0) return;
  treeData.forEach((item) => {
    if (!item.children || item.children.length === 0) result.push(item.key);
    else result.push(getLeafNodes(item.children || []));
  });
  return flatten(result);
};

/**
 * 排除父节点
 * @param checkedKeys 选中复选框的树节点 key 值
 * @param treeData treeNodes 数据
 * @returns
 */
export const excludeParentKeys = (treeData: TreeData[], checkedKeys: React.Key[]) => {
  const result: any = [],
    leafNodes = getLeafNodes(treeData);

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
 * @param checkedKeys 选中复选框的树节点 key 值
 * @returns
 */
export const outputNodeValues = (treeData: TreeData[], keys: React.Key[]) => {
  const result: any[] = [];
  treeData
    .filter((def) => !!def)
    .forEach((item) => {
      if ((keys || []).includes(item.key)) result.push(item.value);
      result.push(outputNodeValues(item.children || [], keys));
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
    if (item.key === newNodeData[keyFieldName]) {
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
 * @returns
 */
export const filterCheckedKeysByCheckedValues = (treeData: TreeData[], checkedValues: string[]) => {
  if (!treeData || treeData.length === 0) return;
  const result: any[] = [];
  treeData.forEach((item) => {
    if ((checkedValues || []).includes(item.value)) {
      result.push(item.key);
    }
    if (item.children) {
      result.push(filterCheckedKeysByCheckedValues(item.children || [], checkedValues));
    }
  });
  return flatten(result);
};
/**
 * 查找父节点
 * @param key 子节点key
 * @param tree
 * @returns
 */
export const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

/**
 * 获取树的key数组
 * @param treeData 树节点数据
 * @param dataList key数组
 */
export const generateList = (treeData, dataList) => {
  for (let i = 0; i < treeData.length; i++) {
    const node = treeData[i];
    const { key, title } = node;
    dataList.push({ key, title });
    if (node.children) {
      generateList(node.children, dataList);
    }
  }
};

/**
 * 遍历树，根据key数组返回节点
 * @param treeData 树数据 
 * @param keys key数组 
 * @returns 
 */
export const filterTreeDataByKeys = (treeData: TreeData[] = [], keys: React.Key[]) => {
  const filteredTreeData: TreeData[] = [];

  const filterTreeData = (treeData: TreeData[], parent: TreeData[]) => {
    treeData.forEach(node => {
      const { children = [], ...res } = node;
      const newChildren = [];
      if (children.length) {
        filterTreeData(children, newChildren);
      }
      if (keys.includes(res.key)) {
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