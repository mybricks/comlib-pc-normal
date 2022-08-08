import { DownOutlined } from '@ant-design/icons';
import { Alert, Tooltip, Tree, message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import copy from 'copy-to-clipboard';
import { typeCheck, uuid } from '../utils';
import { Data, InputIds, OutputIds } from './constant';
import css from './runtime.less';

export default function ({
  env,
  data,
  inputs,
  outputs,
  title
}: RuntimeParams<Data>) {
  const {
    dataSource,
    colors,
    collapsed,
    collapseStringsAfterLength,
    displayObjectSize,
    enableClipboard,
    enableOutput,
    style,
    useSlotProps
  } = data;
  const [jsonObj, setJsonObj] = useState(data.json);
  useEffect(() => {
    if (env.runtime) {
      inputs[InputIds.SetJsonData] && inputs[InputIds.SetJsonData](setJsonObj);
      useSlotProps && inputs[InputIds.SlotProps](setJsonObj);
    }
  }, []);
  if (!typeCheck(jsonObj, ['ARRAY', 'OBJECT'])) {
    try {
      setJsonObj(JSON.parse(jsonObj));
    } catch (e) {
      if (env.edit)
        return <Alert message={`${title}:输入的JSON数据不合法`} type="error" />;
      else {
        console.warn(`${title}:输入的JSON数据不合法`);
        setJsonObj([]);
      }
    }
  }

  const rootKey: React.Key = useMemo(() => {
      return uuid();
    }, []),
    keyToData = new Map(),
    expandedKeys: React.Key[] = [];
  if (enableClipboard || enableOutput) keyToData.set(rootKey, jsonObj);
  if (collapsed !== 0) expandedKeys.push(rootKey);
  /**
   * 树节点的title渲染
   * @param props 组件属性
   * @returns title节点
   */
  const getTitle = (props): JSX.Element => {
    const { key, value } = props;

    const keyStyle = {
        color: colors['key']
      },
      valStyle = {
        color: colors[typeof value === 'string' ? 'string' : 'number']
      };

    // 根据数据类型计算要显示的valString
    let valString = value,
      count = value?.length;
    if (typeCheck(value, 'ARRAY')) {
      valStyle.color = colors['bracket'];
      valString = count === 0 ? '[]' : '[...]';
    }
    if (typeCheck(value, 'OBJECT')) {
      valStyle.color = colors['bracket'];
      count = Object.keys(value).length;
      valString = count === 0 ? '{}' : '{...}';
    }
    const displayCount: boolean = displayObjectSize && value !== valString,
      dispalyEllisps: boolean =
        collapseStringsAfterLength !== 0 &&
        valString === value &&
        count > collapseStringsAfterLength;
    if (dispalyEllisps)
      valString = valString.substring(0, collapseStringsAfterLength) + '...';

    const valueEle = (
      <span key={uuid()} style={valStyle}>
        {typeof value === 'string' ? ` "${valString}"` : ` ${valString}`}
      </span>
    );

    return (
      <div className={css.titleWrapper}>
        <span key={uuid()} style={keyStyle}>
          {key !== rootKey && key}
        </span>
        {key !== rootKey && ':'}
        {dispalyEllisps ? (
          <Tooltip title={value}>{valueEle}</Tooltip>
        ) : (
          valueEle
        )}
        {displayCount && (
          <span className={css.count}>
            {`${count} ${count > 1 ? 'items' : 'item'}`}
          </span>
        )}
      </div>
    );
  };
  /**
   * 根据json对象获取树数据
   * @param obj json对象
   * @param rand 当前深度
   * @returns TreeNode[]格式数据
   */
  const getTreeData = (obj: object, rand: number) => {
    const treeData = [];
    for (let key in obj) {
      const value = obj[key],
        nodeKey = uuid(),
        child = {
          title: getTitle({
            key,
            value
          }),
          key: nodeKey,
          children: null
        };
      if (typeCheck(value, ['ARRAY', 'OBJECT'])) {
        child.children = getTreeData(value, rand + 1);
        if (collapsed === -1 || rand < collapsed) expandedKeys.push(nodeKey);
      }
      treeData.push(child);
      if (enableClipboard || enableOutput) {
        keyToData.set(nodeKey, value);
      }
    }
    return treeData;
  };

  const treeData = [
    {
      title: getTitle({
        key: rootKey,
        value: jsonObj
      }),
      key: rootKey,
      children: getTreeData(jsonObj, 1)
    }
  ];
  const defaultTreeData = [
    {
      title: getTitle({
        key: rootKey,
        value: []
      }),
      key: rootKey
    }
  ];
  const editSettings = {
      treeData: dataSource === 2 ? defaultTreeData : treeData,
      showLine: { showLeafIcon: false },
      switcherIcon: <DownOutlined />,
      expandedKeys,
      style
    },
    runtimeSettings = {
      treeData: treeData,
      showLine: { showLeafIcon: false },
      switcherIcon: <DownOutlined />,
      defaultExpandedKeys: expandedKeys,
      style
    };
  if (env.edit) return <Tree {...editSettings} />;
  return (
    <Tree
      {...runtimeSettings}
      key={expandedKeys.toString()}
      onSelect={(keys: any[], { node }) => {
        const nodeData = keyToData.get(node.key);
        if (enableClipboard) {
          //* 复制到剪贴板
          try {
            copy(JSON.stringify(nodeData));
            message.success(env.i18n('节点数据已成功复制到剪贴板'));
          } catch (e) {
            message.error(env.i18n('复制失败'));
            console.error(env.i18n('复制失败'), e);
          }
        }
        if (enableOutput) {
          outputs[OutputIds.Select] && outputs[OutputIds.Select](nodeData);
        }
      }}
      onExpand={(keys) => {
        // setExpandedKeys(keys);
      }}
    />
  );
}
