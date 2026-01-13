import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Empty, Tree, message } from 'antd';
import type { TreeProps } from 'antd/es/tree';
import uniq from 'lodash/uniq';
import { deepCopy, typeCheck, uuid } from '../utils';
import {
  setCheckboxStatus,
  generateList,
  updateNodeData,
  getParentKey,
  filterCheckedKeysByCheckedValues,
  excludeParentKeys,
  outputNodeValues,
  traverseTree,
  keyToString,
  getFieldNames
} from './utils';
import { Data, TreeData } from './types';
import { DragConfigKeys, InputIds, OutputIds, placeholderTreeData } from './constants';
import TreeNode from './Components/TreeNode/index';
import MenuTreeNode from './Components/TreeNode/MenuTreeNode';
import AutoSizer from 'react-virtualized-auto-sizer';

import css from './style.less';
import useParentHeight from './hooks/use-parent-height';
import cx from 'classnames';
const { DirectoryTree } = Tree

export default function (props: RuntimeParams<Data>) {
  const { env, data, style, inputs, outputs, onError, logger, title, slots } = props;

  const [checkedKeys, setCheckedKeys] = useState(data.checkedKeys);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(
    data.defaultExpandAll ? data.expandedKeys : []
  );
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const selectedValuesRef = useRef<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(false);
  const [treeLoadedKeys, setTreeLoadKeys] = useState<React.Key[]>([]);
  const [_treeKeys, _setTreeKeys] = useState<{ key: string; title: string; depth: number }[]>([]);

  const curentLoadNode = useRef({});
  const treeKeys = useRef<{ key: string; title: string; depth: number }[]>([]);
  const setTreeDataDone = useRef<null | ((arg: any) => any)>(null);
  const onDropDone = useRef<null | ((arg: any) => any)>(null);

  const ref = useRef<HTMLDivElement>(null);

  const treeRef = useRef(null);

  const needForceUpdate = useRef(true); // 默认需要强制更新

  const [parentHeight] = useParentHeight(ref);

  const { keyFieldName, titleFieldName, childrenFieldName } = getFieldNames({ data, env });

  const rootKey = useMemo(() => {
    return uuid();
  }, []);

  const updateDefaultTreeData = useCallback(() => {
    let treeData: TreeData[] = data.treeData;
    const jsonString = decodeURIComponent(data.staticData);
    // 使用静态数据
    if (data.useStaticData) {
      try {
        const jsonData = JSON.parse(jsonString);
        treeData = jsonData;
      } catch {
        console.error('静态数据格式错误');
      }
    }
    if (env.edit && data.useStaticData === false) {
      treeData = placeholderTreeData;
    } else if (env.runtime && data.useStaticData === false) {
      if (JSON.stringify(data.treeData) !== JSON.stringify(placeholderTreeData)) {
        // 兼容 卸载问题
        return treeData;
      }
      // 这里之前应该是避免动态数据时，运行时一开始treeData 数据是搭建态的
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
      if (data.openDepth < 0 && i.children?.length) {
        keys.push(i.key);
      } else if (i.depth < data.openDepth && i.children?.length) {
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

  /** 更新expandedKeys */
  useEffect(() => {
    updateExpandedKeys();
  }, [data.openDepth]);

  /** 更新treeKeys */
  useEffect(() => {
    treeKeys.current = [];
    generateList(data.treeData, treeKeys.current, {
      keyFieldName,
      titleFieldName,
      childrenFieldName
    });
    _setTreeKeys([...treeKeys.current]);

    if (needForceUpdate.current) {
      clearCheckedKeys();
      updateExpandedKeys();

      // 如果 data.treeData 的数据包含了 children，并且 chilren 不为数组，那么这个父节点需要记录到 treeLoadedKeys 中
      let _treeLoadedKeys = getTreeLoadedKeys(data.treeData, []);
      setTreeLoadKeys(_treeLoadedKeys);
    }

    if (setTreeDataDone?.current) {
      setTreeDataDone.current(data.treeData);
      setTreeDataDone.current = null;
    }

    needForceUpdate.current = false;

    function getTreeLoadedKeys(treeData: TreeData[], keys: React.Key[]) {
      treeData.forEach((node) => {
        if (node.children && Array.isArray(node.children) && node.children.length) {
          keys.push(node[keyFieldName]);
          getTreeLoadedKeys(node.children, keys);
        }
      });
      return keys;
    }

  }, [data.treeData]);

  /** 按标签搜索，高亮展示树节点
   * @param searchValue 搜索值
   */
  const search = useCallback((searchValue: string) => {
    data.searchValue = searchValue;
    const searchedKeys = treeKeys.current.map((item) => {
      if (item.title?.indexOf(data.searchValue) > -1) {
        return getParentKey(item.key, data.treeData, { keyFieldName, childrenFieldName });
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
   * @returns 符合过滤方法的树节点及父节点
   */
  const filter = useCallback(() => {
    const filterKeys: React.Key[] = [];
    treeKeys.current.forEach((item) => {
      if (data.filterNames.some((filterName) => filterMethods(filterName)(item))) {
        let childKey = item.key;
        filterKeys.push(childKey);
        while (getParentKey(childKey, data.treeData, { keyFieldName, childrenFieldName })) {
          const parentKey = getParentKey(childKey, data.treeData, {
            keyFieldName,
            childrenFieldName
          });
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
      inputs['treeData']?.((value: TreeData[], relOutputs) => {
        needForceUpdate.current = true;

        setTreeLoadKeys([]); // 刷新组件加载状态
        setExpandedKeys([]); // 设置数据源，清除展开状态

        if (value && Array.isArray(value)) {
          data.treeData = [...value];
        } else {
          data.treeData = [];
        }
        setTreeDataDone.current = relOutputs['setTreeDataDone'];
        outputs[OutputIds.OnChange](deepCopy(data.treeData));
      });

      // 更新节点数据
      inputs['nodeData']?.((nodeData: TreeData, relOutputs) => {
        if (typeCheck(nodeData, 'OBJECT')) {
          data.treeData = [
            ...updateNodeData(data.treeData, nodeData, { keyFieldName, childrenFieldName })
          ];
          outputs[OutputIds.OnChange](deepCopy(data.treeData));

          setExpandedKeys([...data.expandedKeys]);
          // setExpandedKeys(
          //   [...data.expandedKeys].filter((item, i, self) => item && self.indexOf(item) === i)
          // );
          relOutputs['setNodeDataDone'](nodeData);
        }
      });

      // 设置异步加载数据
      inputs['setLoadData'] &&
        inputs['setLoadData']((nodeData: TreeData, relOutputs) => {
          if (typeCheck(nodeData, 'OBJECT')) {
            let myCurentLoadNode = curentLoadNode.current[nodeData[keyFieldName]] as any;
            const { node, resolve } = myCurentLoadNode as any;
            // const { node, resolve } = curentLoadNode.current as any;
            const newNodeData = {
              ...nodeData,
              [keyFieldName]: node[keyFieldName]
            };
            data.treeData = updateNodeData(data.treeData, newNodeData, {
              keyFieldName,
              childrenFieldName
            });
            resolve();
            /** 更新treeKeys一维数组 */
            treeKeys.current = [];
            generateList(data.treeData, treeKeys.current, {
              keyFieldName,
              titleFieldName,
              childrenFieldName
            });
            _setTreeKeys([...treeKeys.current]);

            setTreeLoadKeys(uniq([...treeLoadedKeys, keyToString(node[keyFieldName])]));
            relOutputs[OutputIds.SetLoadDataDone](nodeData);
            outputs[OutputIds.OnChange](deepCopy(data.treeData));
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
            { keyFieldName, childrenFieldName },
            data.valueType
          );

          selectedValuesRef.current = selectedValues;
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
          data.treeData = [
            ...setCheckboxStatus({ treeData: data.treeData, childrenFieldName, value: true })
          ];
          relOutputs['setDisableCheckboxDone']();
          outputs[OutputIds.OnChange](deepCopy(data.treeData));
        });
      inputs['enableCheckbox'] &&
        inputs['enableCheckbox']((value: any, relOutputs) => {
          data.treeData = [
            ...setCheckboxStatus({ treeData: data.treeData, childrenFieldName, value: false })
          ];
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

      /** @description 1.0.66 动态设置父子勾选联动 */
      inputs['setCheckStrictly'] &&
        inputs['setCheckStrictly']((value: boolean, relOutputs) => {
          if (!!data.checkable) {
            // 支持可勾选
            data.checkStrictly = !value;
            relOutputs['setCheckStrictlyDone']('done');
          } else {
            relOutputs['setCheckStrictlyDone']('请开启支持勾选');
          }
          outputs[OutputIds.OnChange](deepCopy(data.treeData));
        });

      /** @description 1.0.80 删除节点 */
      inputs['removeNode']?.((value, relOutputs) => {
        if (typeCheck(value, 'OBJECT')) {
          data.treeData = filterTree(data.treeData, keyFieldName, value, childrenFieldName);
          outputs[OutputIds.OnChange](deepCopy(data.treeData));
          relOutputs['removeNodeDone']('done');
        }

        function filterTree(
          treeData: TreeNode[],
          keyFieldName: string,
          value: any,
          childrenFieldName: string
        ): TreeNode[] {
          return treeData
            .map((node) => {
              if (node[childrenFieldName]) {
                node[childrenFieldName] = filterTree(
                  node[childrenFieldName],
                  keyFieldName,
                  value,
                  childrenFieldName
                );
              }
              return node;
            })
            .filter((node) => node[keyFieldName] !== value[keyFieldName]);
        }
      });

      /** @description 1.0.81 是否允许拖拽释放 */
      inputs['beforeDropNext']?.((value, relOutputs) => {
        try {
          onDropDone?.current?.resolve?.(value);
        } catch (e) { }
      });
    }
  }, [expandedKeys, treeLoadedKeys]);

  useEffect(() => {
    const resultKeys =
      data.outParentKeys || data.checkStrictly
        ? checkedKeys
        : excludeParentKeys(data, checkedKeys, { keyFieldName, childrenFieldName });
    inputs['submit'] &&
      inputs['submit']((val, relOutputs) => {
        relOutputs['submit'](
          outputNodeValues(
            data.treeData,
            resultKeys,
            { keyFieldName, childrenFieldName },
            data.valueType
          )
        );
      });
  }, [checkedKeys]);

  useEffect(() => {
    /** @description 1.0.62 获取选中节点数据 */
    inputs[InputIds.GetSelectedKeys] &&
      inputs[InputIds.GetSelectedKeys]((_, relOutput) => {
        relOutput[OutputIds.ReturnSelectedKeys](selectedValuesRef.current);
      });
  }, []);

  /**
   * 勾选事件处理2
   * @param checkedKeys
   */
  const onCheck: TreeProps['onCheck'] = useCallback((checkedKeys: React.Key[], info) => {
    if (env.edit) return;
    const checked = data.checkStrictly ? checkedKeys.checked : checkedKeys;
    data.checkedKeys = [...checked];
    setCheckedKeys([...checked]);
    if (data.useCheckEvent) {
      const resultKeys =
        data.outParentKeys || data.checkStrictly
          ? checked
          : excludeParentKeys(data, checked, { keyFieldName, childrenFieldName });
      outputs[OutputIds.OnCheck](
        outputNodeValues(
          data.treeData,
          resultKeys,
          { keyFieldName, childrenFieldName },
          data.valueType
        )
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
   * @param keys
   * @param node TreeNode 的 props
   */
  const onSelect = (keys: React.Key[], { node, selected }) => {
    // 禁止取消选中，则将空值重置为当前选中值
    if (data.disableCancelSelect && !keys.length) {
      keys = selectedKeys;
    }
    console.log("onSelect", { keyFieldName, childrenFieldName }, data.valueType)
    const selectedValues = outputNodeValues(
      data.treeData,
      keys,
      { keyFieldName, childrenFieldName },
      data.valueType
    );

    console.log("onSelect", {
      treeData: data.treeData,
      keys,
      keyName: { keyFieldName, childrenFieldName },
      valueType: data.valueType
    })
    if (data.clickExpandable) {
      const keyIndex = expandedKeys.indexOf(node[keyFieldName]);
      if (keyIndex < 0) {
        setExpandedKeys([...expandedKeys, node[keyFieldName]]);
      } else {
        setExpandedKeys(expandedKeys.filter((key) => key !== node[keyFieldName]));
      }
    }
    setSelectedKeys([...keys]);
    selectedValuesRef.current = selectedValues;
    outputs[OutputIds.OnNodeClick](selectedValues);
  };

  /**
   * onDrop事件处理
   * 注: node TreeNode 的props
   */
  const onDrop: TreeProps['onDrop'] = async (info) => {
    // 创建了「拖拽释放前」事件，并且有连线
    if (outputs['beforeDrop'].getConnections().length) {
      // 创建异步任务
      outputs['beforeDrop'](info);
      console.log(1);
      let result = await new Promise((resolve) => {
        onDropDone.current = {
          resolve
        };
      });

      // 拒绝
      if (!result) {
        return;
      }
    }

    /**
     * info.node: 落下的节点信息
     * info.dragNode: 拖拽的节点信息
     * info.dropPosition: 落下的位置信息
     */
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropFlag = info.dropPosition - Number(dropPos[dropPos.length - 1]); // dropPos[dropPos.length - 1]: 落下节点的index

    const dragNodeInfo = traverseTree({
      data,
      targetKey: dragKey as string,
      fieldNames: { keyFieldName, childrenFieldName }
    });
    const dropNodeInfo = traverseTree({
      data,
      targetKey: dropKey as string,
      fieldNames: { keyFieldName, childrenFieldName }
    });
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
          dropNode.isLeaf = false;
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
      return info.dropNode['data-allow-drop'];
    } else {
      return true;
    }
    // if (dropPosition === 0) {
    //   console.log(1)
    //   return true;
    // } else {
    //   console.log(2)
    //   return info.dropNode['data-allow-drop'];
    // }
  };

  /**
   * @description v1.0.52 异步加载事件回调
   * */
  const onLoadData: TreeProps['loadData'] = (node) => {
    if (treeLoadedKeys.includes(node.key)) {
      return Promise.resolve();
    }
    const originNode = node['data-origin-node'];
    return new Promise((resolve) => {
      // curentLoadNode.current = {
      //   node: originNode,
      //   resolve
      // };

      curentLoadNode.current[node[keyFieldName]] = {
        node: originNode,
        resolve
      };

      outputs['loadData'](originNode);
    });
  };

  const filteredKeys = useMemo(() => {
    return data.filterValue ? filter() : treeKeys.current.map((i) => i.key);
  }, [data.filterValue, treeKeys.current, _treeKeys]);

  const isEmpty = useMemo(() => {
    return filteredKeys.length === 0;
  }, [filteredKeys.length]);

  const onMouseLeave = (info) => {
    if (info.node.key === data.popUpVisibleProps?.key) {
      data.popUpVisibleProps = { key: '', visible: false };
    }
  };

  const treeWithHeight = (height?) => {
    if (data.useMenuMode) {
      return menuTreeRender(height)
    }
    return (
      <Tree
        checkable={!!data.checkable}
        draggable={
          data.draggable
            ? (node) => {
              return node['data-draggable'];
            }
            : false
        }
        height={height}
        ref={treeRef}
        rootStyle={
          !(style.height === 'fit-content' && !data.scrollHeight) ? { minHeight: '100%' } : {}
        }
        allowDrop={allowDrop}
        loadData={env.runtime && data.useLoadData ? onLoadData : undefined}
        loadedKeys={env.runtime && data.loadDataOnce ? treeLoadedKeys : []}
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
        onMouseLeave={onMouseLeave}
        blockNode
      >
        {TreeNode({
          props,
          fieldNames: { keyFieldName, titleFieldName, childrenFieldName },
          setExpandedKeys,
          treeData: data.treeData || [],
          filteredKeys,
          depth: 0,
          parent: { key: rootKey }
        })}
      </Tree>
    );
  };
  const menuTreeRender = useCallback((height?) => {
    console.log('menuTreeRender')
    return <DirectoryTree
      checkable={!!data.checkable}
      draggable={
        data.draggable
          ? (node) => {
            return node['data-draggable'];
          }
          : false
      }
      height={height}
      ref={treeRef}
      rootStyle={
        !(style.height === 'fit-content' && !data.scrollHeight) ? { minHeight: '100%' } : {}
      }
      // treeData={FormatTreeData({
      //   props,
      //   fieldNames: { keyFieldName, titleFieldName, childrenFieldName },
      //   setExpandedKeys,
      //   treeData: data.treeData || [],
      //   filteredKeys,
      //   depth: 0,
      //   parent: { key: rootKey }
      // })} 
      allowDrop={allowDrop}
      loadData={env.runtime && data.useLoadData ? onLoadData : undefined}
      loadedKeys={env.runtime && data.loadDataOnce ? treeLoadedKeys : []}
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
      onMouseLeave={onMouseLeave}
      blockNode
      showIcon={false}
    >
      {MenuTreeNode({
        props,
        fieldNames: { keyFieldName, titleFieldName, childrenFieldName },
        setExpandedKeys,
        treeData: data.treeData || [],
        filteredKeys,
        depth: 0,
        parent: { key: rootKey }
      })}
    </DirectoryTree>
  }, [checkedKeys, selectedKeys, expandedKeys, treeLoadedKeys, autoExpandParent, filteredKeys, data])


  return (
    <div
      ref={ref}
      className={cx({
        [css.emptyWrapper]: isEmpty,
        [css.singleCompact]: data.useCompactTheme,
        [css.myTree]: true,
        [css.myTreeEllipsis]: data.titleEllipsis,
      })}
      style={{
        maxHeight: isEmpty
          ? void 0
          : style.height === 'fit-content'
            ? data.scrollHeight
            : parentHeight,
        // height: isEmpty ? data.scrollHeight : void 0,
        height: style.height === 'fit-content' ? data.scrollHeight : parentHeight || void 0
        // overflowY: data.scrollHeight ? 'scroll' : void 0,
      }}
    >
      {isEmpty ? (
        <Empty
          description={<span>{env.i18n(data.description)}</span>}
          image={data.isImage ? data.image : void 0}
        />
      ) : style.height === 'fit-content' && !data.scrollHeight ? (
        treeWithHeight()
      ) : (
        <AutoSizer disableWidth style={{ minHeight: style.height }}>
          {({ height }) => {
            return treeWithHeight(height);
          }}
        </AutoSizer>
      )}
    </div>
  );
}
