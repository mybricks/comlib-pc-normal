import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Empty, Tree, message } from 'antd';
import type { TreeProps } from 'antd/es/tree';
import { deepCopy, typeCheck, uuid } from '../utils';
import {
  setCheckboxStatus,
  generateList,
  updateNodeData,
  getParentKey,
  filterCheckedKeysByCheckedValues,
  excludeParentKeys,
  outputNodeValues,
  filterTreeDataByKeys,
  traverseTree,
  keyToString
} from './utils';
import { Data, TreeData } from './types';
import { DragConfigKeys, InputIds, OutputIds, placeholderTreeData } from './constants';
import TreeNode from './Components/TreeNode/index';
import css from './style.less';

export default function (props: RuntimeParams<Data>) {
  const { env, data, inputs, outputs, onError, logger, title } = props;

  const [checkedKeys, setCheckedKeys] = useState(data.checkedKeys);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(
    data.defaultExpandAll ? data.expandedKeys : []
  );
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(false);
  const treeKeys = useRef<{ key: string; title: string; depth: number }[]>([]);

  const keyFieldName = env.edit ? 'key' : data.keyFieldName || 'key';
  const titleFieldName = env.edit ? 'title' : data.titleFieldName || 'title';

  const rootKey = useMemo(() => {
    return uuid();
  }, []);

  const updateDefaultTreeData = useCallback(() => {
    let treeData: TreeData[] = data.treeData;
    const jsonString = decodeURIComponent(data.staticData);
    try {
      const jsonData = JSON.parse(jsonString);
      treeData = jsonData;
    } catch {
      console.error('静态数据格式错误');
    }
    if (env.edit && data.useStaticData === false) {
      treeData = placeholderTreeData;
    } else if (env.runtime && data.useStaticData === false) {
      treeData = [];
    }
    return treeData;
  }, []);

  /** 重置checkedKeys */
  const clearCheckedKeys = useCallback(() => {
    data.checkedKeys = [];
    setCheckedKeys([]);
  }, []);

  /** 更新expandedKeys */
  const updateExpandedKeys = useCallback(() => {
    const keys: React.Key[] = [];
    treeKeys.current.map((i) => {
      if (data.openDepth < 0) {
        keys.push(i.key);
      } else if (i.depth < data.openDepth) {
        keys.push(i.key);
      }
    });
    const strKeys = keys.map(keyToString);
    data.expandedKeys = strKeys;
    setExpandedKeys(strKeys);
  }, []);
  useEffect(() => {
    data.treeData = updateDefaultTreeData();
  }, [data.useStaticData, data.staticData]);
  /** 更新treeKeys */
  useEffect(() => {
    treeKeys.current = [];
    generateList(data.treeData, treeKeys.current, { keyFieldName, titleFieldName });
    clearCheckedKeys();
    updateExpandedKeys();
  }, [data.treeData]);

  /** 按标签搜索，高亮展示树节点
   * @param searchValue 搜索值
   */
  const search = useCallback((searchValue: string) => {
    data.searchValue = searchValue;
    const searchedKeys = treeKeys.current.map((item) => {
      if (item.title?.indexOf(data.searchValue) > -1) {
        return getParentKey(item.key, data.treeData, keyFieldName);
      }
      return null;
    });
    const strKeys = searchedKeys.map(keyToString);
    setExpandedKeys(
      [...strKeys, ...data.expandedKeys].filter((item, i, self) => item && self.indexOf(item) === i)
    );
    setAutoExpandParent(true);
  }, []);

  /** 过滤
   * @returns 符合符合过滤方法的树节点及父节点
   */
  const filter = useCallback(() => {
    const filterKeys: React.Key[] = [];
    treeKeys.current.forEach((item) => {
      if (data.filterNames.some((filterName) => filterMethods(filterName)(item))) {
        let childKey = item.key;
        filterKeys.push(childKey);
        while (getParentKey(childKey, data.treeData, keyFieldName)) {
          const parentKey = getParentKey(childKey, data.treeData, keyFieldName);
          if (parentKey === childKey) {
            console.error(`树中存在标识重复的节点, 重复key: ${parentKey}`);
            return;
          }
          childKey = parentKey;
          filterKeys.push(parentKey);
        }
      }
    });
    // const filteredTreeData = filterTreeDataByKeys(data.treeData, filterKeys, keyFieldName);
    const strKeys = filterKeys.map(keyToString);
    setExpandedKeys(strKeys);
    return filterKeys;
  }, []);

  /**
   * 过滤方法合集
   */
  const filterMethods = useCallback((filterName) => {
    switch (filterName) {
      case 'byTitle':
        return (node: TreeData) => {
          return node.title?.indexOf(data.filterValue) > -1;
        };
      case 'byKey':
        return (node: TreeData) => {
          return node.key?.indexOf(data.filterValue) > -1;
        };
      default:
        return (node: TreeData) => {
          return node[filterName]?.indexOf(data.filterValue) > -1;
        };
    }
  }, []);

  useEffect(() => {
    if (env.runtime) {
      inputs['outParentKeys'] &&
        inputs['outParentKeys']((value) => {
          if (typeof value === 'boolean') data.outParentKeys = value;
        });

      // 设置数据源
      inputs['treeData'] &&
        inputs['treeData']((value: TreeData[], relOutputs) => {
          if (value && Array.isArray(value)) {
            data.treeData = [...value];
            relOutputs['setTreeDataDone'](data.treeData);
          } else {
            data.treeData = [];
            relOutputs['setTreeDataDone'](data.treeData);
          }
          outputs[OutputIds.OnChange](deepCopy(data.treeData));
        });
      // 更新节点数据
      inputs['nodeData'] &&
        inputs['nodeData']((nodeData: TreeData, relOutputs) => {
          if (typeCheck(nodeData, 'OBJECT')) {
            data.treeData = [...updateNodeData(data.treeData, nodeData, keyFieldName)];
            outputs[OutputIds.OnChange](deepCopy(data.treeData));
            setExpandedKeys(
              [...data.expandedKeys].filter((item, i, self) => item && self.indexOf(item) === i)
            );
            relOutputs['setNodeDataDone'](nodeData);
          }
        });

      // 搜索
      inputs['searchValue'] &&
        inputs['searchValue']((searchValue: string, relOutputs) => {
          search(searchValue);
          relOutputs['searchValueDone'](searchValue);
        });

      // 过滤
      inputs['filter'] &&
        inputs['filter']((filterValue: string, relOutputs) => {
          data.filterValue = filterValue;
          relOutputs['filterDone'](filterValue);
        });

      // 设置选中节点
      inputs.setSelectedKeys &&
        inputs.setSelectedKeys((keys: Array<string> = [], relOutputs) => {
          if (!Array.isArray(keys)) {
            return onError('设置选中节点参数是数组');
          }
          const strKeys = keys.map(keyToString);
          setSelectedKeys(strKeys);
          relOutputs['setSelectedKeysDone'](keys);
          const selectedValues = outputNodeValues(
            data.treeData,
            strKeys,
            keyFieldName,
            data.valueType
          );
          outputs[OutputIds.OnNodeClick](selectedValues);
        });

      // 设置展开节点
      inputs.setExpandedKeys &&
        inputs.setExpandedKeys((keys: Array<string> = [], relOutputs) => {
          if (!Array.isArray(keys)) {
            return onError('设置展开节点参数是数组');
          }
          const strKeys = keys.map(keyToString);
          data.expandedKeys = strKeys;
          setExpandedKeys(strKeys);
          relOutputs['setExpandedKeysDone'](keys);
        });

      // 设置勾选项
      inputs['checkedValues'] &&
        inputs['checkedValues']((keys: [], relOutputs) => {
          if (keys && Array.isArray(keys)) {
            const inputCheckedKeys = filterCheckedKeysByCheckedValues(
              treeKeys.current,
              keys,
              keyFieldName
            );
            const strKeys = inputCheckedKeys.map(keyToString);
            data.checkedKeys = strKeys;
            setCheckedKeys(strKeys);
            relOutputs['setCheckedKeysDone'](keys);
          }
        });
      inputs['disableCheckbox'] &&
        inputs['disableCheckbox']((value: any, relOutputs) => {
          data.treeData = [...setCheckboxStatus({ treeData: data.treeData, value: true })];
          relOutputs['setDisableCheckboxDone']();
          outputs[OutputIds.OnChange](deepCopy(data.treeData));
        });
      inputs['enableCheckbox'] &&
        inputs['enableCheckbox']((value: any, relOutputs) => {
          data.treeData = [...setCheckboxStatus({ treeData: data.treeData, value: false })];
          relOutputs['setEnableCheckboxDone']();
          outputs[OutputIds.OnChange](deepCopy(data.treeData));
        });

      // 设置拖拽功能
      inputs[InputIds.SetDragConfig] &&
        inputs[InputIds.SetDragConfig]((ds: object, relOutputs) => {
          let config = {
            draggable: false,
            allowDrop: true,
            useDropScope: false
          };
          if (typeof ds === 'boolean') {
            config.draggable = ds;
          } else if (typeCheck(ds, 'object')) {
            config = {
              ...config,
              ...ds
            };
          }
          DragConfigKeys.forEach((key) => {
            config[key] != null && (data[key] = config[key]);
          });
          relOutputs['setDragConfigDone'](ds);
        });

      // 设置展开深度
      inputs[InputIds.SetOpenDepth] &&
        inputs[InputIds.SetOpenDepth]((depth, relOutputs) => {
          if (typeof depth === 'number') {
            data.openDepth = depth;
            relOutputs['setOpenDepthDone'](depth);
          } else {
            logger.warn(`${title}:【设置展开深度】输入数据应该是数字`);
          }
          updateExpandedKeys();
        });

      // 自定义添加提示文案
      inputs['addTips'] &&
        inputs['addTips']((ds: string[], relOutputs) => {
          Array.isArray(ds)
            ? (data.addTips = ds)
            : (data.addTips = new Array(data.maxDepth || 1000).fill(ds));
          relOutputs['addTipsDone'](ds);
        });

      /** @description 1.0.42 获取组件数据 */
      inputs[InputIds.GetTreeData] &&
        inputs[InputIds.GetTreeData]((_, relOutput) => {
          relOutput[OutputIds.ReturnTreeData](deepCopy(data.treeData));
        });
    }
  }, []);

  useEffect(() => {
    const resultKeys =
      data.outParentKeys || data.checkStrictly ? checkedKeys : excludeParentKeys(data, checkedKeys);
    inputs['submit'] &&
      inputs['submit']((val, relOutputs) => {
        relOutputs['submit'](
          outputNodeValues(data.treeData, resultKeys, keyFieldName, data.valueType)
        );
      });
  }, [checkedKeys]);

  /**
   * 勾选事件处理
   * @param checkedKeys
   */
  const onCheck: TreeProps['onCheck'] = useCallback((checkedKeys: React.Key[], info) => {
    if (env.edit) return;
    const checked = data.checkStrictly ? checkedKeys.checked : checkedKeys;
    data.checkedKeys = [...checked];
    setCheckedKeys([...checked]);
    if (data.useCheckEvent) {
      const resultKeys =
        data.outParentKeys || data.checkStrictly ? checked : excludeParentKeys(data, checked);
      outputs[OutputIds.OnCheck](
        outputNodeValues(data.treeData, resultKeys, keyFieldName, data.valueType)
      );
    }
  }, []);

  /**
   * 展开事件处理
   * @param expandedKeys
   */
  const onExpand = useCallback((expandedKeys: React.Key[]) => {
    data.expandedKeys = [...expandedKeys];
    setExpandedKeys([...expandedKeys]);
    setAutoExpandParent(false);
  }, []);

  /**
   * 选择事件处理
   * @param selectedKeys
   * @param node TreeNode 的 props
   */
  const onSelect = (selectedKeys: React.Key[], { node, selected }) => {
    const selectedValues = outputNodeValues(
      data.treeData,
      selectedKeys,
      keyFieldName,
      data.valueType
    );
    if (data.clickExpandable) {
      const keyIndex = expandedKeys.indexOf(node[keyFieldName]);
      if (keyIndex < 0) {
        setExpandedKeys([...expandedKeys, node[keyFieldName]]);
      } else {
        setExpandedKeys(expandedKeys.filter((key) => key !== node[keyFieldName]));
      }
    }
    setSelectedKeys([...selectedKeys]);
    outputs[OutputIds.OnNodeClick](selectedValues);
  };

  /**
   * onDrop事件处理
   * 注: node TreeNode 的props
   */
  const onDrop: TreeProps['onDrop'] = (info) => {
    /**
     * info.node: 落下的节点信息
     * info.dragNode: 拖拽的节点信息
     * info.dropPosition: 落下的位置信息
     */
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropFlag = info.dropPosition - Number(dropPos[dropPos.length - 1]); // dropPos[dropPos.length - 1]: 落下节点的index

    const dragNodeInfo = traverseTree({ data, targetKey: dragKey as string });
    const dropNodeInfo = traverseTree({ data, targetKey: dropKey as string });
    if (!dragNodeInfo || !dropNodeInfo) return;
    const { parent: dragNodeParent, node: dragNode, index: dragNodeIndex } = dragNodeInfo;
    const { parent: dropNodeParent, node: dropNode, index: dropNodeIndex } = dropNodeInfo;

    /** 判断是否满足拖拽范围限制 */
    switch (data.useDropScope) {
      case 'parent':
        if (dropFlag === 0 && dropNode[keyFieldName] !== dragNodeParent?.[keyFieldName]) {
          // 拖拽到dropNode的第一个子节点
          message.error(env.i18n(data.dropScopeMessage));
          return;
        }
        if (dropFlag !== 0 && dragNodeParent?.[keyFieldName] !== dropNodeParent?.[keyFieldName]) {
          message.error(env.i18n(data.dropScopeMessage));
          return;
        }
        break;
    }

    // 删除原来的节点
    dragNodeParent.children?.splice(dragNodeIndex, 1);
    switch (dropFlag) {
      // 移动到dropNode下面的第一个子级
      case 0:
        if (Array.isArray(dropNode?.children)) {
          dropNode.children.unshift(dragNode);
        } else {
          dropNode.children = [dragNode];
        }
        break;

      // 移动到和dropNode平级，在其后面
      case 1:
        let newInx = dropNodeIndex;
        if (
          dragNodeParent?.[keyFieldName] === dropNodeParent?.[keyFieldName] &&
          dragNodeIndex < dropNodeIndex
        ) {
          // 同一父节点，移动到dropNode后面时，由于dragNode已被删除，index需要减1
          newInx--;
        }
        dropNodeParent.children?.splice(newInx + 1, 0, dragNode);
        break;

      // 移动到和dropNode平级，在其前面
      case -1:
        dropNodeParent?.children?.splice(dropNodeIndex, 0, dragNode);
        break;
    }

    outputs[OutputIds.OnDropDone]({
      dragNodeInfo,
      dropNodeInfo,
      flag: dropFlag,
      treeData: data.treeData
    });

    outputs[OutputIds.OnChange](deepCopy(data.treeData));
  };

  /**
   * allowDrop事件处理
   * @param dragNode 拖拽的节点信息
   * @param dropNode 落下的节点信息
   * @param dropPosition 落下的位置
   * 注: node TreeNode 的props
   */
  const allowDrop: TreeProps['allowDrop'] = (info) => {
    if (!data.draggable && data.allowDrop) return false;
    const dropPosition = info.dropPosition;
    // 放置在子级
    if (dropPosition === 0) {
      return true;
    } else {
      return info.dropNode['data-allow-drop'];
    }
  };

  const filteredKeys = useMemo(() => {
    return data.filterValue ? filter() : treeKeys.current.map((i) => i.key);
  }, [data.filterValue, treeKeys.current]);

  const isEmpty = useMemo(() => {
    return filteredKeys.length === 0;
  }, [filteredKeys.length]);

  return (
    <div
      className={`${isEmpty ? css.emptyWrapper : ''} ${
        data.useCompactTheme ? css.singleCompact : ''
      }`}
      style={{
        maxHeight: isEmpty ? void 0 : data.scrollHeight,
        height: isEmpty ? data.scrollHeight : void 0,
        overflowY: data.scrollHeight ? 'scroll' : void 0
      }}
    >
      {isEmpty ? (
        <Empty
          description={<span>{env.i18n(data.description)}</span>}
          image={data.isImage ? data.image : void 0}
        />
      ) : (
        <Tree
          checkable={!!data.checkable}
          draggable={
            data.draggable
              ? (node) => {
                  return node['data-draggable'];
                }
              : false
          }
          allowDrop={allowDrop}
          showLine={data.showLine}
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
          onDrop={onDrop}
          blockNode
        >
          {TreeNode(props, setExpandedKeys, data.treeData || [], filteredKeys, 0, { key: rootKey })}
        </Tree>
      )}
    </div>
  );
}
