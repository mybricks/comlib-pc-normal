import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Empty, Tree, Input } from 'antd';
import { Data, TreeData } from './constants';
import { pretreatTreeData, setCheckboxStatus } from './utils';
import ActionBtns from './ActionBtn';
import { MODIFY_BTN_ID } from './constants';
import { deepCopy, typeCheck } from '../utils';
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
const excludeParentKeys = (treeData: TreeData[], checkedKeys: React.Key[]) => {
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
const updateNodeData = (treeData: TreeData[], newNodeData: TreeData, keyFieldName: string) => {
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
const filterCheckedKeysByCheckedValues = (treeData: TreeData[], checkedValues: string[]) => {
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
const getParentKey = (key, tree) => {
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
const generateList = (treeData, dataList) => {
  for (let i = 0; i < treeData.length; i++) {
    const node = treeData[i];
    const { key, title } = node;
    dataList.push({ key, title });
    if (node.children) {
      generateList(node.children, dataList);
    }
  }
};

export default function ({ env, data, inputs, outputs }: RuntimeParams<Data>) {
  const [checkedKeys, setCheckedKeys] = useState(data.checkedKeys);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(
    data.defaultExpandAll ? data.expandedKeys : []
  );
  const [autoExpandParent, setAutoExpandParent] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const treeKeys = useRef<any>(null);

  const keyFieldName = data.keyFieldName || 'key';

  useEffect(() => {
    treeKeys.current = [];
    generateList(data.treeData, treeKeys.current);
  }, [data.treeData]);

  useEffect(() => {
    if (env.runtime) {
      inputs['outParentKeys'] &&
        inputs['outParentKeys']((value) => {
          if (typeof value === 'boolean') data.outParentKeys = value;
        });
      inputs['treeData'] &&
        inputs['treeData']((value: TreeData[]) => {
          if (value && Array.isArray(value)) {
            data.expandedKeys = [];
            data.treeData = pretreatTreeData({
              treeData: [...value],
              data,
              defaultExpandAll: data.defaultExpandAll
            });
            setExpandedKeys([...data.expandedKeys]);
          } else {
            data.treeData = [];
          }
        });
      // 更新节点数据
      inputs['nodeData'] &&
        inputs['nodeData']((nodeData: TreeData) => {
          if (typeCheck(nodeData, 'OBJECT')) {
            data.treeData = [
              ...updateNodeData(
                data.treeData,
                pretreatTreeData({
                  treeData: [nodeData],
                  data,
                  defaultExpandAll: data.defaultExpandAll
                })[0],
                keyFieldName
              )
            ];
            setExpandedKeys(
              [...data.expandedKeys].filter((item, i, self) => item && self.indexOf(item) === i)
            );
          }
        });
      // 搜索
      inputs['searchValue'] &&
        inputs['searchValue']((searchValue: string) => {
          data.searchValue = searchValue;
          const searchedKeys = treeKeys.current.map((item) => {
            if (item.title.indexOf(searchValue) > -1) {
              return getParentKey(item.key, data.treeData);
            }
            return null;
          });
          setExpandedKeys(
            [...searchedKeys, ...data.expandedKeys].filter(
              (item, i, self) => item && self.indexOf(item) === i
            )
          );
          setAutoExpandParent(true);
        });
      // 自定义添加提示文案
      inputs['addTips'] &&
        inputs['addTips']((ds: string[]) => {
          Array.isArray(ds)
            ? (data.addTips = ds)
            : (data.addTips = new Array(data.maxDepth || 1000).fill(ds));
        });
      inputs['checkedValues'] &&
        inputs['checkedValues']((value: []) => {
          if (value && Array.isArray(value)) {
            const inputCheckedKeys = filterCheckedKeysByCheckedValues(data.treeData, value);
            data.checkedKeys = inputCheckedKeys;
            setCheckedKeys(inputCheckedKeys);
          }
        });
      inputs['disableCheckbox'] &&
        inputs['disableCheckbox']((value: any) => {
          data.treeData = [...setCheckboxStatus({ treeData: data.treeData, value: true })];
        });
      inputs['enableCheckbox'] &&
        inputs['enableCheckbox']((value: any) => {
          data.treeData = [...setCheckboxStatus({ treeData: data.treeData, value: false })];
        });
    }
  }, []);

  useEffect(() => {
    const resultKeys =
      data.outParentKeys || data.checkStrictly
        ? checkedKeys
        : excludeParentKeys(data.treeData, checkedKeys);
    inputs['submit']((val, relOutputs) => {
      relOutputs['submit'](outputNodeValues(data.treeData, resultKeys));
    });
  }, [checkedKeys]);

  // useEffect(() => {
  //   inputs['outSelectedValues']((val, relOutputs) => {
  //     relOutputs['outSelectedValues'](outputNodeValues(data.treeData, selectedKeys));
  //   });
  // }, [selectedKeys]);

  const onCheck = useCallback((checkedKeys: React.Key[], info) => {
    // if (env.runtime) {
    //   if (!data.outParentKeys) {
    //     const noParentKeys = excludeParentKeys(checkedKeys, data.treeData);
    //     outputs["check"](noParentKeys);
    //   } else {
    //     outputs["check"](checkedKeys);
    //   }
    // }
    const checked = data.checkStrictly ? checkedKeys.checked : checkedKeys;
    data.checkedKeys = [...checked];
    setCheckedKeys([...checked]);
    if (data.useCheckEvent) {
      const resultKeys =
        data.outParentKeys || data.checkStrictly
          ? checked
          : excludeParentKeys(data.treeData, checked);
      outputs['check'](outputNodeValues(data.treeData, resultKeys));
    }
  }, []);

  const onExpand = useCallback((expandedKeys: React.Key[]) => {
    data.expandedKeys = [...expandedKeys];
    setExpandedKeys([...expandedKeys]);
    setAutoExpandParent(false);
  }, []);

  const onSelect = (selectedKeys: React.Key[], { node, selected }) => {
    const selectedValues = outputNodeValues(data.treeData, selectedKeys);
    if (data.clickExpandable) {
      const keyIndex = expandedKeys.indexOf(node.key);
      if (keyIndex < 0) {
        setExpandedKeys([...expandedKeys, node.key]);
      } else {
        setExpandedKeys(expandedKeys.filter((key) => key !== node.key));
      }
    }
    setSelectedKeys([...selectedKeys]);
    outputs['click'](selectedValues);
  };

  const renderAddTitle = (item, isRoot?: boolean) => {
    item.title = env.i18n(item.title);
    item.placeholder = env.i18n(item.placeholder);
    const tipStyle = {
        color: 'rgb(204,204,204)',
        display: data.isAdding === item.key ? 'none' : 'block',
        marginLeft: data.checkable ? '20px' : void 0
      },
      inputStyle = {
        display: data.isAdding === item.key ? 'block' : 'none',
        marginLeft: data.checkable ? '20px' : void 0
      };
    return (
      <span
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <span
          style={tipStyle}
          onClick={(e) => {
            data.isAdding = item.key;
          }}
        >
          {item.title}
        </span>
        <Input
          style={inputStyle}
          bordered={false}
          size="small"
          onPressEnter={({ target }) => {
            data.isAdding = '';
            const node = {
              title: target.value,
              value: target.value,
              key: item.key
            };
            // 添加
            if (isRoot) {
              data.treeData = [...data.treeData, node];
            } else {
              Array.isArray(item.parent?.children)
                ? item.parent?.children.push(node)
                : (item.parent.children = [node]);
            }
            if (data.defaultExpandAll) {
              data.expandedKeys.push(item.key);
              setExpandedKeys([...data.expandedKeys]);
            }
            outputs['addNodeDone']({ node, parent: item.parent });
          }}
          placeholder={item.placeholder}
        />
      </span>
    );
  };

  const renderTitle = (item) => {
    item.title = env.i18n(item.title || '');
    // 搜索
    const index = item.title.indexOf(data.searchValue);
    const beforeStr = item.title.substr(0, index);
    const afterStr = item.title.substr(index + data?.searchValue?.length);
    const wrapperStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    };
    // 修改
    const titleStyle = {
        display: data.isEditing === item.key ? 'none' : 'block'
      },
      inputStyle = {
        display: data.isEditing === item.key ? 'block' : 'none'
      };
    const outputItem = deepCopy(item);
    if (outputItem._key) {
      outputItem.key = outputItem._key;
    }

    const editInput = (
        <Input
          style={inputStyle}
          bordered={false}
          defaultValue={item.title}
          size="middle"
          onClick={(e) => {
            e.stopPropagation();
          }}
          onPressEnter={({ target }) => {
            item.title = target.value;
            outputItem.title = target.value;
            data.isEditing = '';
            const { children, ...res } = outputItem;
            outputs[MODIFY_BTN_ID](res);
          }}
        />
      ),
      actionBtns =
        data.isEditing !== item.key &&
        data.useActions &&
        ActionBtns({ data, record: item, outputItem: outputItem, env, outputs });
    if (index > -1) {
      return (
        <div style={wrapperStyle}>
          <span style={titleStyle}>
            {beforeStr}
            <span style={{ color: '#f00' }}>{data.searchValue}</span>
            {afterStr}
          </span>
          {editInput}
          {actionBtns}
        </div>
      );
    }
    return (
      <div style={wrapperStyle}>
        <span style={titleStyle}>{item.title}</span>
        {editInput}
        {actionBtns}
      </div>
    );
  };

  const renderTreeNode = (treeData: TreeData[], depth = 0, parent = { key: '0' }) => {
    const { TreeNode } = Tree;
    const hasAddNode = data.addable && (!data.maxDepth || depth < data.maxDepth);
    const addNodeKey = `${parent.key}-${treeData.length}`;
    return (
      <>
        {treeData.map((item, inx) => {
          return (
            <>
              <TreeNode
                key={item.key}
                data-tree-node-id={item.key}
                title={renderTitle(item)}
                disableCheckbox={item.disableCheckbox}
              >
                {renderTreeNode(item.children || [], depth + 1, item)}
              </TreeNode>
            </>
          );
        })}
        {/* 添加节点 */}
        {hasAddNode && (
          <TreeNode
            checkable={false}
            selectable={false}
            key={addNodeKey}
            title={renderAddTitle(
              {
                title:
                  data.addTips && data.addTips[depth] ? `添加${data.addTips[depth]}` : '添加节点',
                placeholder: `请输入节点名称，按回车保存`,
                key: addNodeKey,
                parent
              },
              depth === 0
            )}
          />
        )}
      </>
    );
  };

  return (
    <div>
      {data && data.treeData.length === 0 ? (
        <Empty description={<span>{env.i18n('暂无数据')}</span>} />
      ) : (
        <Tree
          checkable={data.checkable}
          checkStrictly={data.checkStrictly}
          onExpand={onExpand}
          expandedKeys={env.edit ? data.expandedKeys : expandedKeys}
          autoExpandParent={autoExpandParent}
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          defaultExpandAll={data.defaultExpandAll}
          defaultCheckedKeys={data.checkedKeys}
          selectedKeys={selectedKeys}
          onSelect={onSelect}
          blockNode
        >
          {renderTreeNode(data.treeData || [])}
        </Tree>
      )}
    </div>
  );
}
