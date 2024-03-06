import { DownOutlined } from '@ant-design/icons';
import { Alert, Tooltip, Tree, message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import copy from 'copy-to-clipboard';
import { typeCheck, uuid } from '../utils';
import { Data, dataSourceTypeMap, InputIds, OutputIds, TypeEnum } from './constant';
import css from './runtime.less';

export default function ({ env, data, inputs, outputs, title, logger }: RuntimeParams<Data>) {
  const {
    colors,
    collapseStringsAfterLength,
    displayObjectSize,
    enableClipboard,
    copyValueWithLabel,
    enableOutput
  } = data;
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (env.runtime) {
      inputs[InputIds.SetJsonData]?.((val, relOutputs) => {
        if (typeof val === 'string') {
          data.json = encodeURIComponent(val);
          relOutputs['setJsonDataDone'](data.json);
        } else if (typeCheck(val, ['ARRAY', 'OBJECT'])) {
          data.json = val;
          relOutputs['setJsonDataDone'](data.json);
        } else {
          console.error(`${title}:输入的JSON数据不合法`);
        }
      });
      inputs[InputIds.GetJsonData]?.((_, outputRels) => {
        outputRels[OutputIds.JsonData](data.jsonObj);
      });
      inputs[InputIds.SetExpandDepth]?.((val, relOutputs) => {
        if (typeof val === 'number' && val > -2) {
          data.collapsed = val;
          relOutputs['setExpandDepthDone'](data.collapsed);
        } else {
          logger.warn('json展示[设置展开深度]: 请输入≥-1的数字');
        }
      });
    }
  }, []);

  useEffect(() => {
    if (typeof data.json === 'string') {
      try {
        data.jsonObj = JSON.parse(decodeURIComponent(data.json));
        setIsError(false);
      } catch (e) {
        setIsError(true);
        console.warn(`${title}:输入的JSON数据不合法`);
        data.jsonObj = dataSourceTypeMap[data.dataSourceType];
      }
    } else if (data.json && typeCheck(data.json, ['ARRAY', 'OBJECT'])) {
      data.jsonObj = data.json;
    } else {
      data.jsonObj = dataSourceTypeMap[data.dataSourceType];
      setIsError(false);
    }
  }, [data.json]);

  const rootKey: React.Key = useMemo(() => {
      return uuid();
    }, []),
    keyToData = new Map(),
    expandedKeys: React.Key[] = [];

  if (enableClipboard || enableOutput) keyToData.set(rootKey, data.jsonObj);
  if (data.collapsed !== 0) expandedKeys.push(rootKey);

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
        color: colors[typeof value === 'string' ? 'string' : 'number'],
        wordBreak: 'break-all'
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
    if (dispalyEllisps) valString = valString.substring(0, collapseStringsAfterLength) + '...';

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
        {dispalyEllisps ? <Tooltip title={value}>{valueEle}</Tooltip> : valueEle}
        {displayCount && (
          <span className={css.count}>{`${count} ${count > 1 ? 'items' : 'item'}`}</span>
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
          label: key,
          children: null
        };
      if (typeCheck(value, ['ARRAY', 'OBJECT'])) {
        child.children = getTreeData(value, rand + 1);
        if (data.collapsed === -1 || rand < data.collapsed) expandedKeys.push(nodeKey);
      }
      treeData.push(child);
      if (enableClipboard || enableOutput) {
        keyToData.set(nodeKey, value);
      }
    }
    return treeData;
  };
  const rootStyle = useMemo(() => {
    return {
      backgroundColor: data.colors[TypeEnum.BackgroundColor],
      '--json--view--node-hover-bgcolor': data.colors[TypeEnum.NodeHoverBackgroundColor]
    };
  }, [data.colors[TypeEnum.NodeHoverBackgroundColor], data.colors[TypeEnum.BackgroundColor]]);

  /** @description TODO：支持不展示根节点 */
  const treeData = [
    {
      title: getTitle({
        key: rootKey,
        value: data.jsonObj
      }),
      key: rootKey,
      children: getTreeData(data.jsonObj, 1)
    }
  ];

  if (isError && env.edit) {
    return <Alert message={`${title}:输入的JSON数据不合法`} type="error" />;
  }

  const editConfig = env.edit
    ? {
        expandedKeys
      }
    : {};
  return (
    <Tree
      treeData={treeData}
      rootStyle={rootStyle}
      className={css.root}
      showLine={{ showLeafIcon: false }}
      switcherIcon={<DownOutlined />}
      defaultExpandedKeys={expandedKeys}
      {...editConfig}
      key={expandedKeys.toString()}
      onSelect={(keys: any[], { node }) => {
        const nodeData = keyToData.get(node.key);
        if (enableClipboard) {
          //* 复制到剪贴板
          try {
            const nodeDataStr =
              copyValueWithLabel && node.label !== undefined
                ? JSON.stringify({ [node.label]: nodeData })
                : typeof nodeData !== 'string' || data.copyStringWithQuotation
                ? JSON.stringify(nodeData)
                : nodeData;
            copy(nodeDataStr);
            message.success('节点数据已成功复制到剪贴板');
          } catch (e) {
            message.error('复制失败');
            console.error('复制失败', e);
          }
        }
        if (enableOutput) {
          outputs[OutputIds.Select] && outputs[OutputIds.Select](nodeData);
        }
      }}
    />
  );
}
