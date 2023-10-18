import React from 'react';
import { Tree } from 'antd';
import { deepCopy } from '../../../utils';
import { Data, TreeData } from '../../types';
import { ExpressionSandbox } from '../../../../package/com-utils';
import { renderAddTitle } from './AddTitle';
import { renderTitle } from './Title';
const { TreeNode } = Tree;

/**
 * 树节点遍历渲染
 * @param treeData 树数据
 * @param depth 当前层级
 * @param parent 父节点数据
 * @returns JSX
 */
const renderTreeNode = (
  props: RuntimeParams<Data>,
  setExpandedKeys,
  treeData: TreeData[],
  depth,
  parent
) => {
  const { data, env, onError } = props;
  const keyFieldName = env.edit ? 'key' : data.keyFieldName || 'key';
  const titleFieldName = env.edit ? 'title' : data.titleFieldName || 'title';
  const childrenFieldName = env.edit ? 'children' : data.childrenFieldName || 'children';

  /**
   * 树节点勾选框动态显示表达式
   * @param node 节点数据
   * @param isRoot 是否根节点
   */
  const getDynamicCheckable = (context: TreeData): boolean => {
    let flag = true;
    if (data.checkable === 'custom' && data.checkableScript) {
      const sandbox: ExpressionSandbox = new ExpressionSandbox({ context, prefix: 'node' });
      try {
        flag = !!sandbox.executeWithTemplate(data.checkableScript);
      } catch (error: any) {
        onError?.(`树组件[${context[titleFieldName]}]节点可勾选: ${error}`);
      }
    }
    return flag;
  };

  /**
   * 树节点动态可拖拽表达式
   * @param node 节点数据
   * @param isRoot 是否根节点
   */
  const getDynamicDraggable = (context: TreeData): boolean => {
    let flag = true;
    if (data.draggable === 'custom' && data.draggableScript) {
      const sandbox: ExpressionSandbox = new ExpressionSandbox({ context, prefix: 'node' });
      try {
        flag = !!sandbox.executeWithTemplate(data.draggableScript);
      } catch (error: any) {
        onError?.(`树组件[${context[titleFieldName]}]节点可拖拽: ${error}`);
      }
    }
    return flag;
  };

  /**
   * 树节点动态可放置表达式
   * @param node 节点数据
   * @param isRoot 是否根节点
   */
  const getDynamicAllowDrop = (context: TreeData): boolean => {
    let flag = true;
    if (!!data.draggable && data.allowDrop === 'custom' && data.allowDropScript) {
      const sandbox: ExpressionSandbox = new ExpressionSandbox({ context, prefix: 'node' });
      try {
        flag = !!sandbox.executeWithTemplate(data.allowDropScript);
      } catch (error: any) {
        onError?.(`树组件[${context[titleFieldName]}]节点可放置: ${error}`);
      }
    }
    return flag;
  };

  const hasAddNode = data.addable && (!data.maxDepth || depth < data.maxDepth);
  const lastTreeNode = treeData[treeData.length - 1];
  const addNodeKey = `${parent[keyFieldName]}-${lastTreeNode?.[keyFieldName]}`;
  return (
    <>
      {treeData.map((item, inx) => {
        /** outputItem：用于表达式计算和输出的节点数据 */
        const outputItem = deepCopy(item);
        if (outputItem.isRoot === undefined) {
          outputItem.isRoot = depth === 0;
        }
        if (outputItem.isLeaf === undefined) {
          outputItem.isLeaf = !outputItem[childrenFieldName]?.length;
        }
        if (outputItem.depth === undefined) {
          outputItem.depth = depth;
        }
        if (outputItem._depth === undefined) {
          outputItem._depth = depth;
        }

        const checkable = getDynamicCheckable(outputItem);
        const draggable = getDynamicDraggable(outputItem);
        const allowDrop = getDynamicAllowDrop(outputItem);

        return (
          <TreeNode
            key={item[keyFieldName]}
            data-tree-node-id={item[keyFieldName]}
            data-draggable={draggable}
            data-allow-drop={allowDrop}
            title={renderTitle(props, item, outputItem, depth === 0)}
            disableCheckbox={item.disableCheckbox}
            checkable={checkable}
          >
            {renderTreeNode(props, setExpandedKeys, item[childrenFieldName] || [], depth + 1, item)}
          </TreeNode>
        );
      })}
      {/* 添加节点 */}
      {hasAddNode && (
        <TreeNode
          checkable={false}
          selectable={false}
          key={addNodeKey}
          title={renderAddTitle(
            props,
            setExpandedKeys,
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

export default renderTreeNode;
