import React from 'react';
import { deepCopy } from '../../../utils';
import { Data } from '../../types';
import { Input } from 'antd';
import { InputIds, OutputIds } from '../../constants';

/**
 * 添加节点渲染
 * @param item 树节点数据
 * @param isRoot 是否为根节点
 * @returns JSX
 */
export const renderAddTitle = (
  props: RuntimeParams<Data>,
  setExpandedKeys,
  item,
  isRoot?: boolean
) => {
  const { env, data, outputs } = props;
  const keyFieldName = env.edit ? 'key' : data.keyFieldName || 'key';
  const childrenFieldName = env.edit ? 'children' : data.childrenFieldName || 'children';

  item.title = env.i18n(item.title);
  item.placeholder = env.i18n(item.placeholder);
  const tipStyle = {
      color: 'rgb(204,204,204)',
      display: data.isAdding === item[keyFieldName] ? 'none' : 'block',
      marginLeft: data.checkable ? '20px' : void 0
    },
    inputStyle = {
      display: data.isAdding === item[keyFieldName] ? 'block' : 'none',
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
          data.isAdding = item[keyFieldName];
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
            key: item[keyFieldName]
          };
          // 添加
          if (isRoot) {
            data.treeData = [...data.treeData, node];
          } else {
            Array.isArray(item.parent?.[childrenFieldName])
              ? item.parent?.[childrenFieldName].push(node)
              : (item.parent[childrenFieldName] = [node]);
            data.treeData = [...data.treeData];
          }
          if (data.defaultExpandAll) {
            data.expandedKeys.push(item[keyFieldName]);
            setExpandedKeys([...data.expandedKeys]);
          }
          outputs[OutputIds.AddNodeDone]({ node, parent: item.parent });
          outputs[OutputIds.OnChange](deepCopy(data.treeData));
        }}
        placeholder={item.placeholder}
      />
    </span>
  );
};
