import React from 'react';
import { Tree, TreeNodeProps, Popover } from 'antd';
import { deepCopy } from '../../../utils';
import { getDynamicProps, keyToString } from '../../utils';
import { renderAddTitle } from './AddTitle';
import * as Icons from '@ant-design/icons';
import { ExpressionSandbox } from '../../../../package/com-utils';
import { ColorType, Data, IconType, TreeData } from '../../types';
import { renderTitle } from './Title';



/**
 * 树节点遍历渲染
 * @param treeData 树数据
 * @param depth 当前层级
 * @param parent 父节点数据
 * @returns JSX
 */
const FormatTreeData = ({
  props,
  setExpandedKeys,
  treeData,
  filteredKeys,
  fieldNames,
  depth,
  parent
}: {
  props: RuntimeParams<Data>;
  setExpandedKeys;
  treeData: TreeData[];
  filteredKeys: React.Key[];
  fieldNames: { keyFieldName: string; titleFieldName: string; childrenFieldName: string };
  depth: number;
  parent: { key: string };
}) => {
  const { data, slots, env } = props;
  const { keyFieldName, childrenFieldName, titleFieldName } = fieldNames;
//   const hasAddNode =
//     data.addable &&
//     (!data.maxDepth || depth < data.maxDepth) &&
//     treeData.some((node) => filteredKeys.includes(node[keyFieldName]));
  const lastTreeNode = treeData[treeData.length - 1];
//   const addNodeKey = `${parent[keyFieldName]}-${lastTreeNode?.[keyFieldName]}`;


/**
   * 计算动态显示表达式
   * @param item 节点数据
   * @param icon 动态数据数据
   */
   const getDynamicDisplay = (item: TreeNodeProps, data: IconType | ColorType): boolean => {
    let dynamicDisplay = true;

    if (data.displayRule === 'dynamic' && data.displayExpression) {
      const context = {
        ...item
      };
      const sandbox: ExpressionSandbox = new ExpressionSandbox({ context, prefix: 'node' });
      try {
        dynamicDisplay = sandbox.executeWithTemplate(data.displayExpression);
      } catch (error: any) {
        // onError?.(`树[${data.title}]: ${error}`);
      }
    }
    return dynamicDisplay;
  };

  /**
   * 树节点图标渲染
   * @param item 节点数据
   * @returns JSX
   */
  const getNodeIcon = (item) => {
    const icon = data.icons?.find((i) => getDynamicDisplay(item, i));
    if (item.icon || (icon?.src === 'custom' && icon?.customIcon)) {
      const gutter = icon?.gutter?.[0] || 8;
      const IconCustom = Icons[item.icon || icon?.customIcon]
      return <IconCustom  style={{gutter: gutter}}/>
    }
    if (icon?.src === 'inner') {
      const gutter = icon?.gutter?.[0] || 8;
      const IconCustom = Icons[icon.innerIcon || 'FolderOpenOutlined']
      return <IconCustom  style={{gutter: gutter}}/>
    }
  };
  return treeData.map((item, inx) => {
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

        const dynamicProps = getDynamicProps({ props, fieldNames, context: outputItem });
        const disabled = dynamicProps.disabledFlag;
        const checkable = dynamicProps.checkableFlag;
        const draggable = dynamicProps.draggableFlag;
        const allowDrop = dynamicProps.allowDropFlag;
        const disableHoverPop = dynamicProps.disableHoverPopFlag || false;
        let equalKey = data.popUpVisibleProps?.key === outputItem[keyFieldName];
        const runtimeVisible =
          env.runtime && data.popUpVisibleProps?.visible && equalKey ? { visible: true } : {};

        return {
            ...item, 
            isLeaf: !item[childrenFieldName]?.length,
            title: renderTitle(props, item, outputItem, depth === 0, {
              disableHoverPop,
              runtimeVisible
            }),
            disabled,
            checkable,
            draggable,
            allowDrop,
            icon: ()=>getNodeIcon(outputItem),
            children: item[childrenFieldName] ?
              FormatTreeData({
                props,
                setExpandedKeys,
                treeData: item[childrenFieldName],
                filteredKeys,
                depth: depth + 1,
                fieldNames,
                parent: item,
              }) : []
          } 
        }  
        // return (
        //   <TreeNode
        //     {...item}
        //     data-origin-node={item}
        //     key={keyToString(item[keyFieldName])}
        //     className={css.treeNode}
        //     data-tree-node-id={item[keyFieldName]}
        //     data-draggable={draggable}
        //     data-allow-drop={allowDrop}
        //     data-disable-hover={disableHoverPop}
        //     title={renderTitle(props, item, outputItem, depth === 0, {
        //       disableHoverPop,
        //       runtimeVisible
        //     })}
        //     disableCheckbox={item.disableCheckbox}
        //     disabled={disabled}
        //     checkable={checkable}
        //     style={{
        //       display: filteredKeys.includes(item[keyFieldName]) ? void 0 : 'none'
        //     }}
        //   >
        //     {renderTreeNode({
        //       props,
        //       setExpandedKeys,
        //       treeData: item[childrenFieldName] || [],
        //       filteredKeys,
        //       depth: depth + 1,
        //       fieldNames,
        //       parent: item
        //     })}
        //   </TreeNode>
        // );
      )}
//       {/* 添加节点 */}
//       {hasAddNode && (
//         <TreeNode
//           checkable={false}
//           selectable={false}
//           key={addNodeKey}
//           title={renderAddTitle(
//             props,
//             setExpandedKeys,
//             {
//               title:
//                 data.addTips && data.addTips[depth] ? `添加${data.addTips[depth]}` : '添加节点',
//               placeholder: `请输入节点名称，按回车保存`,
//               key: addNodeKey,
//               parent
//             },
//             depth === 0
//           )}
//         />
//       )}
//     </>
//   );


export default FormatTreeData;
