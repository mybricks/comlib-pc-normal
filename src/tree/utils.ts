import { deepCopy } from "../utils";
import { Data, TreeData, ValueType } from "./types";
import { DefaultFieldName, DefaultStaticData, InputIds, OutputIds, } from "./constants";
import { ExpressionSandbox } from '../../package/com-utils';
import set from 'lodash/set'
/**
 * @description 将key格式化为字符串
 * @param key 原始的key
 * @returns string
 */
export const keyToString = (key) => {
  if (typeof key === 'string') return key;
  return JSON.stringify(key);
};

export const setCheckboxStatus = ({
  treeData,
  childrenFieldName,
  value
}: {
  treeData: TreeData[];
  childrenFieldName: string;
  value: boolean;
}) => {
  if (!treeData || treeData.length === 0) return [];
  treeData.forEach((item) => {
    item.disableCheckbox = value;
    if (item[childrenFieldName]) {
      setCheckboxStatus({ treeData: item[childrenFieldName] || [], childrenFieldName, value }) ||
        [];
    }
  });
  return treeData;
};

/**
 * @description 获取字段映射信息
 * @param param0
 * @returns
 */
export const getFieldNames = ({
  data,
  env
}: {
  data: Data;
  env: Env;
}) => {
  const keyFieldName = env?.edit && !data.useStaticData ? DefaultFieldName.Key : data.keyFieldName || DefaultFieldName.Key;
  const titleFieldName = env?.edit && !data.useStaticData ? DefaultFieldName.Title : data.titleFieldName || DefaultFieldName.Title;
  const childrenFieldName = env?.edit && !data.useStaticData ? DefaultFieldName.Children : data.childrenFieldName || DefaultFieldName.Children;
  return {
    keyFieldName,
    titleFieldName,
    childrenFieldName
  }
};
/** 暂未使用
 * @description 预处理树组件数据
 * @param param0
 * @returns
 */
export const pretreatTreeData = ({
  treeData,
  data,
  defaultExpandAll,
  parentKey = '0',
  keyFieldName = DefaultFieldName.Key
}: {
  treeData: TreeData[];
  data: Data;
  defaultExpandAll?: boolean;
  parentKey?: string;
  keyFieldName: string;
}) => {
  treeData.forEach((item, inx) => {
    if (item[keyFieldName] == null) {
      const id = parentKey + '-' + inx;
      item[keyFieldName] = id;
    }
    if (data && defaultExpandAll) {
      data.expandedKeys = [...data.expandedKeys, item[keyFieldName]];
    }
    if (item.children) {
      pretreatTreeData({ treeData: item.children, data, defaultExpandAll, parentKey: item[keyFieldName], keyFieldName });
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
  fieldNames
}: {
  data: Data;
  targetKey: string;
  fieldNames: { keyFieldName: string; childrenFieldName: string };
}): { parent: TreeData; index: number; node: TreeData } | null => {
  const { treeData } = data;
  const { keyFieldName, childrenFieldName } = fieldNames;

  if (!treeData || treeData.length === 0) return null;
  const searchTree = (treeNode: TreeData, index: number, parent: TreeData) => {
    if (keyToString(treeNode[keyFieldName]) === targetKey) {
      return {
        parent,
        node: treeNode,
        index
      };
    } else if (treeNode[childrenFieldName]) {
      for (let i = 0; i < treeNode[childrenFieldName].length; i++) {
        const result = searchTree(treeNode[childrenFieldName][i], i, treeNode);
        if (result !== null) return result;
      }
    }
    return null;
  };

  for (let i = 0; i < treeData.length; i++) {
    const result = searchTree(treeData[i], i, { [childrenFieldName]: data.treeData } as TreeData);
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
const getLeafNodes = (treeData: TreeData[], keyFieldName: string, childrenFieldName: string) => {
  const result: any[] = [];
  if (!treeData || treeData.length === 0) return [];
  treeData.forEach((item) => {
    if (!item[childrenFieldName] || item[childrenFieldName].length === 0)
      result.push(item[keyFieldName]);
    else result.push(getLeafNodes(item[childrenFieldName] || [], keyFieldName, childrenFieldName));
  });
  return flatten(result);
};

/**
 * 排除父节点
 * @param checkedKeys 选中复选框的树节点 key 值
 * @param data 组件数据
 * @returns
 */
export const excludeParentKeys = (
  data: Data,
  checkedKeys: React.Key[],
  { keyFieldName, childrenFieldName }: { keyFieldName: string; childrenFieldName: string }
) => {
  const { treeData } = data;
  const result: any = [],
    leafNodeKeys = getLeafNodes(treeData, keyFieldName, childrenFieldName).map(keyToString);

  if (checkedKeys && Array.isArray(checkedKeys)) {
    checkedKeys.forEach((key) => {
      if (leafNodeKeys.indexOf(key) !== -1) result.push(key);
    });
  }
  return result;
};

/**
 * 输出选中节点的 value 值
 * @param treeData 树数据
 * @param checkedKeys 选中复选框的树节点 keyFieldName 值
 * @param keyFieldName 标识字段
 * @returns
 */
export const outputNodeValues = (
  treeData: TreeData[],
  keys: React.Key[],
  { keyFieldName, childrenFieldName }: { keyFieldName: string; childrenFieldName: string },
  valueType: string
) => {
  const result: any[] = [];
  treeData
    .filter((def) => !!def)
    .forEach((item) => {
      if ((keys || []).includes(keyToString(item[keyFieldName]))) {
        if (valueType === ValueType.TREE_NODE) {
          result.push(deepCopy(item));
        } else {
          result.push(item[keyFieldName]);
        }
      }
      result.push(
        outputNodeValues(
          item[childrenFieldName] || [],
          keys,
          { keyFieldName, childrenFieldName },
          valueType
        )
      );
    });
  return flatten(result);
};
/**
 * 查找newNodeData 在treeData中的访问路径
 * @param treeData treeNodes 数据
 * @param newNodeData 更新的节点数据
 * @param pathSoFar 访问路径
 * @returns 
 */
const findTargetNodeDataWithPath =  (
  treeData: TreeData[],
  newNodeData: TreeData,
  pathSoFar: any[] = [],
  { keyFieldName, childrenFieldName }: { keyFieldName: string; childrenFieldName: string }
)  => {
  let result: any = undefined
  for(let i = 0, size = treeData.length; i < size; i++) {
    const item = treeData[i]
    const newPath = [...pathSoFar, i];
    if(item[keyFieldName] === newNodeData[keyFieldName]) {
      result = item
      return { node: item, path: newPath }
    } else if(item[childrenFieldName] && item[childrenFieldName].length) {
      result = findTargetNodeDataWithPath(item[childrenFieldName], newNodeData, [...newPath, childrenFieldName], {
        keyFieldName,
        childrenFieldName
      })
      if( result.node) {
        return result
      }
    }
  }
  return { node: undefined, path: [] }
}
/**
 * 根据keyFieldName设置节点数据
 * @param treeData treeNodes 数据
 * @param newNodeData 节点数据
 * @returns
 */
export const updateNodeData = (
  treeData: TreeData[],
  newNodeData: TreeData,
  { keyFieldName, childrenFieldName }: { keyFieldName: string; childrenFieldName: string }
) => {
  let result = [...treeData]
  let targetNodeAndPath = findTargetNodeDataWithPath(treeData,
    newNodeData,
    [],
    { keyFieldName, childrenFieldName })
    // 这里不能直接改，不然影响 异步加载事件
    if(targetNodeAndPath.node) {
      set(result, targetNodeAndPath.path, {...targetNodeAndPath.node, ...newNodeData})
      // 这里不能Object.assign 直接改这个节点，不然影响可能 异步加载事件 参数值
      // Object.assign(targetNode, newNodeData)
    }
  return result;
};

/**
 * 根据选中节点的 value 此筛选出选中节点的 key
 * @param treeData treeNodes 数据
 * @param checkedValues 选中复选框的树节点 key 值
 * @param keyFieldName 标识字段
 * @returns
 */
export const filterCheckedKeysByCheckedValues = (flatTrees: TreeData[], checkedValues: string[], keyFieldName) => {
  if (!flatTrees || flatTrees.length === 0) return [];
  const result: any[] = [];
  flatTrees.forEach((item) => {
    if ((checkedValues || []).includes(item.value) || (checkedValues || []).includes(item.key)) {
      result.push(item.key);
    }
  });
  return result;
};

/**
 * 查找父节点
 * @param key 子节点key
 * @param tree
 * @param keyFieldName 标识字段
 * @returns
 */
export const getParentKey = (
  key,
  tree,
  { keyFieldName, childrenFieldName }: { keyFieldName: string; childrenFieldName: string }
) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node[childrenFieldName]) {
      if (node[childrenFieldName].some((item) => item[keyFieldName] === key)) {
        parentKey = node[keyFieldName];
      } else if (getParentKey(key, node[childrenFieldName], { keyFieldName, childrenFieldName })) {
        parentKey = getParentKey(key, node[childrenFieldName], { keyFieldName, childrenFieldName });
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
 * @param titleFieldName 标题字段
 */
export const generateList = (
  treeData,
  dataList,
  { keyFieldName, titleFieldName, childrenFieldName },
  parentKey = '0',
  depth = 0
) => {
  for (let i = 0; i < treeData.length; i++) {
    const node = treeData[i];
    if (node[keyFieldName] == null) {
      const id = parentKey + '-' + i;
      node[keyFieldName] = id;
    }
    const { [keyFieldName]: key, [titleFieldName]: title } = node;
    dataList.push({ ...node, key, title, depth });
    if (node[childrenFieldName]) {
      generateList(
        node[childrenFieldName],
        dataList,
        { keyFieldName, titleFieldName, childrenFieldName },
        key,
        depth + 1
      );
    }
  }
};

/** 暂未使用
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
        label: '_depth',
        insertText: `{_depth}`,
        detail: `当前节点的深度`
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
        label: data.keyFieldName || DefaultFieldName.Key,
        insertText: `{${data.keyFieldName || DefaultFieldName.Key}}` + ' === ',
        detail: `当前节点标识字段值`
      },
      {
        label: data.titleFieldName || DefaultFieldName.Title,
        insertText: `{${data.titleFieldName || DefaultFieldName.Title}}` + ' === ',
        detail: `当前节点标题字段值`
      },
      {
        label: data.childrenFieldName || DefaultFieldName.Children,
        insertText: `{${data.childrenFieldName || DefaultFieldName.Children}}` + ' === ',
        detail: `当前节点子节点字段值`
      },
    ]
  }
];

/**
 * @description 对树默认的静态数据源进行字符替换
 * @param fieldMap 字段映射
 * @returns 编码后的替换完成的树数据源
 */
export const replaceTreeFieldAfterEncoding = (data: Data, fieldMap: {
  title?: string,
  key?: string,
  children?: string
}) => {
  if (!fieldMap.title) {
    fieldMap.title = data.titleFieldName || DefaultFieldName.Title;
  }
  if (!fieldMap.key) {
    fieldMap.key = data.keyFieldName || DefaultFieldName.Key;
  }
  if (!fieldMap.children) {
    fieldMap.children = data.childrenFieldName || DefaultFieldName.Children;
  }

  const regKey = new RegExp(DefaultFieldName.Key, 'g');
  const regTitle = new RegExp(DefaultFieldName.Title, 'g');
  const regChildren = new RegExp(DefaultFieldName.Children, 'g');
  return encodeURIComponent(
    decodeURIComponent(DefaultStaticData)
      .replace(regKey, fieldMap.key)
      .replace(regTitle, fieldMap.title)
      .replace(regChildren, fieldMap.children)
  );
}

/**
* 树节点动态属性计算
* @param context 节点数据
* @param sandbox 表达式执行沙箱
* @param data 组件Data
* @param fieldMap 字段映射
*/
export const getDynamicProps = (
  {
    context,
    props,
    fieldNames
  }
    : {
      context: TreeData,
      props: RuntimeParams<Data>,
      fieldNames: { keyFieldName: string, titleFieldName: string, childrenFieldName: string }
    },
): {
  disabledFlag: boolean,
  checkableFlag: boolean,
  draggableFlag: boolean,
  allowDropFlag: boolean,
  disableHoverPopFlag: boolean
} => {
  const { data, onError } = props;
  const { titleFieldName } = fieldNames;
  let sandbox: ExpressionSandbox | undefined

  /**树节点动态禁用表达式 */
  let disabledFlag = context.disabled;
  if (data.disabledScript) {
    if (!sandbox) sandbox = new ExpressionSandbox({ context, prefix: 'node' });
    try {
      disabledFlag = sandbox.executeWithTemplate(data.disabledScript);
    } catch (error: any) {
      onError?.(`树组件[${context[titleFieldName]}]节点禁用计算错误: ${error}`);
    }
  }

  /**树节点勾选框动态显示表达式 */
  let checkableFlag = true;
  if (data.checkable === 'custom' && data.checkableScript) {
    if (!sandbox) sandbox = new ExpressionSandbox({ context, prefix: 'node' });
    try {
      checkableFlag = !!sandbox.executeWithTemplate(data.checkableScript);
    } catch (error: any) {
      onError?.(`树组件[${context[titleFieldName]}]节点可勾选: ${error}`);
    }
  }

  /**树节点动态可拖拽表达式 */
  let draggableFlag = true;
  if (data.draggable === 'custom' && data.draggableScript) {
    if (!sandbox) sandbox = new ExpressionSandbox({ context, prefix: 'node' });
    try {
      draggableFlag = !!sandbox.executeWithTemplate(data.draggableScript);
    } catch (error: any) {
      onError?.(`树组件[${context[titleFieldName]}]节点可拖拽: ${error}`);
    }
  }

  /**树节点动态可放置表达式 */
  let allowDropFlag = true;
  if (!!data.draggable && data.allowDrop === 'custom' && data.allowDropScript) {
    if (!sandbox) sandbox = new ExpressionSandbox({ context, prefix: 'node' });
    try {
      allowDropFlag = !!sandbox.executeWithTemplate(data.allowDropScript);
    } catch (error: any) {
      onError?.(`树组件[${context[titleFieldName]}]节点可放置: ${error}`);
    }
  }

  /**树节点动态禁用Hover 展示面板 表达式；未开启使用hover面板时，为true */
  let disableHoverPopFlag = data.useHoverPanel ? false : true;
  if (!!data.useHoverPanel && data.disabledHoverScript) {
    if (!sandbox) sandbox = new ExpressionSandbox({ context, prefix: 'node' });
    try {
      disableHoverPopFlag = !!sandbox.executeWithTemplate(data.disabledHoverScript);
    } catch (error: any) {
      onError?.(`树组件[${context[titleFieldName]}]节点可Hover: ${error}`);
    }
  }
  return {
    disabledFlag,
    checkableFlag,
    draggableFlag,
    allowDropFlag,
    disableHoverPopFlag
  };
};
/** 
 * 更新schema
 */
export const refreshSchema = (props: EditorResult<Data>) => {
  const { data, input, output, env } = props;
  const { keyFieldName, titleFieldName, childrenFieldName } = getFieldNames({ data, env });

  const stringArraySchema = {
    type: 'array',
    items: {
      type: 'string'
    }
  };
  const treeNodeSchema = {
    type: 'object',
    properties: {
      [titleFieldName]: {
        title: '标题',
        type: 'string',
      },
      [keyFieldName]: {
        title: '字段名',
        type: 'string',
      },
      disableCheckbox: {
        title: '禁用勾选',
        type: 'boolean',
      },
      isLeaf: {
        title: '设置为叶子结点',
        type: 'boolean',
        description: "开启「展开时异步加载自节点」时，设置有效，为false时，会强制将节点作为父节点"
      },
      [childrenFieldName]: {
        title: '子项',
        type: 'array',
        items: {
          type: 'object',
        },
      },
    },
  };
  const treeDataSchema = {
    title: '树数据',
    type: 'array',
    items: treeNodeSchema
  };
  const nodeInfoSchema = {
    type: 'object',
    properties: {
      parent: treeDataSchema,
      node: treeDataSchema,
      index: {
        type: 'number'
      }
    }
  };

  input.get(InputIds.SetLoadData)?.setSchema(treeNodeSchema);
  output.get(OutputIds.LoadData)?.setSchema(treeNodeSchema);

  input.get(InputIds.SetTreeData).setSchema(treeDataSchema);
  output.get(OutputIds.OnDropDone)?.setSchema({
    type: 'object',
    properties: {
      dropNodeInfo: nodeInfoSchema,
      dragNodeInfo: nodeInfoSchema,
      flag: {
        title: '位置标识',
        type: 'number'
      }
    }
  });

  switch (data.valueType) {
    case ValueType.TREE_NODE:
      output.get(OutputIds.OnNodeClick).setSchema(treeDataSchema);
      output.get(OutputIds.OnCheck)?.setSchema(treeDataSchema);
      output.get(OutputIds.ReturnSelectedKeys)?.setSchema(treeDataSchema);
      break;
    default:
      output.get(OutputIds.OnNodeClick).setSchema(stringArraySchema);
      output.get(OutputIds.OnCheck)?.setSchema(stringArraySchema);
      output.get(OutputIds.ReturnSelectedKeys)?.setSchema(stringArraySchema);
  }
}