import { TreeNodeProps } from "antd";
import { Data, IconType } from "./types";
import { ExpressionSandbox } from '../../../package/com-utils';
import { FieldNames } from "rc-tree/lib/interface";

/**
 * 遍历树组件
 * @param treeData 
 * @param fieldNames 字段映射 
 * @param cb 回调函数
 * @param _depth 节点深度
 */
export const traversalTree = (treeData: TreeNodeProps[], fieldNames: FieldNames, cb, _depth = 0) => {
    treeData.forEach((node) => {
        cb({
            ...node,
            _depth
        });
        const { [fieldNames.children || 'children']: children } = node;
        if (Array.isArray(children)) {
            traversalTree(children, fieldNames, cb, _depth + 1);
        }
    });
};

/**
 * 更新节点数据
 */
export const setTreeDataForLoadData = (data, curNode, treeData, newNodeData = {}) => {
    let newTreeData = [];
    const trueValueFieldName = data.valueFieldName || 'value';
    const trurChildrenFieldName = data.childrenFieldName || 'children';

    newTreeData = treeData.map((item) => {
        if (item[trueValueFieldName] === curNode[trueValueFieldName]) {
            item = {
                ...item,
                ...newNodeData
            };
        } else {
            if (Array.isArray(item[trurChildrenFieldName])) {
                item[trurChildrenFieldName] = setTreeDataForLoadData(
                    data,
                    curNode,
                    item[trurChildrenFieldName],
                    newNodeData
                );
            }
        }

        return item;
    });

    return newTreeData;
};

/**
 * 获取字段映射
 * @param data 组件数据
 * @returns 字段映射
 */
export const getFieldNames = (data: Data,) => {
    const fieldNames = {
        label: data.labelFieldName || 'label',
        value: data.valueFieldName || 'value',
        children: data.childrenFieldName || 'children'
    };

    return fieldNames;
};

/**
 * 计算图标动态显示表达式
 * @param item 节点数据
 * @param icon 图标数据
 */
export const getDynamicDisplay = (item: TreeNodeProps, icon: IconType, onError?): boolean => {
    let dynamicDisplay = true;

    if (icon.displayRule === 'dynamic' && icon.displayExpression) {
        const context = {
            ...item
        };
        const sandbox: ExpressionSandbox = new ExpressionSandbox({ context, prefix: 'node' });
        try {
            dynamicDisplay = sandbox.executeWithTemplate(icon.displayExpression);
        } catch (error: any) {
            onError?.(`树选择[${icon.title}]图标: ${error}`);
        }
    }
    return dynamicDisplay;
};
