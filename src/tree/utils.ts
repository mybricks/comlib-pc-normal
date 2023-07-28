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
