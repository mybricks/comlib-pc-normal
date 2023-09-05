import React, { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Icons from '@ant-design/icons';
import { Empty, Tree, Input, Image, Space } from 'antd';
import { ExpressionSandbox } from '../../package/com-utils';
import { Data, TreeData } from './constants';
import {
  pretreatTreeData,
  setCheckboxStatus,
  generateList,
  updateNodeData,
  getParentKey,
  filterCheckedKeysByCheckedValues,
  excludeParentKeys,
  outputNodeValues,
  filterTreeDataByKeys
} from './utils';
import ActionBtns from './ActionBtn';
import { MODIFY_BTN_ID } from './constants';
import { deepCopy, typeCheck, uuid } from '../utils';

export default function ({ env, data, inputs, outputs, onError, logger }: RuntimeParams<Data>) {
  const [checkedKeys, setCheckedKeys] = useState(data.checkedKeys);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(
    data.defaultExpandAll ? data.expandedKeys : []
  );
  const [autoExpandParent, setAutoExpandParent] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const treeKeys = useRef<any>(null);

  const keyFieldName = data.keyFieldName || 'key';

  const rootKey = useMemo(() => {
    return uuid();
  }, []);

  useEffect(() => {
    treeKeys.current = [];
    generateList(data.treeData, treeKeys.current);
  }, [data.treeData]);

  /** 按标签搜索，高亮展示树节点
   * @param searchValue 搜索值
   */
  const search = useCallback((searchValue: string) => {
    data.searchValue = searchValue;
    const searchedKeys = treeKeys.current.map((item) => {
      if (filterMethods.byTitle(item)) {
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
  }, []);

  /** 过滤：符合过滤方法的树节点及父节点
   * @param filterMethod 过滤方法
   * @returns 符合条件的节点key数组
   */
  const filter = useCallback((filterMethod: (nodeData: TreeData) => boolean) => {
    const filterKeys: React.Key[] = [];
    treeKeys.current.forEach((item) => {
      if (filterMethod(item)) {
        let childKey = item.key;
        filterKeys.push(childKey);
        while (getParentKey(childKey, data.treeData)) {
          const parentKey = getParentKey(childKey, data.treeData);
          childKey = parentKey;
          filterKeys.push(parentKey);
        }
      }
    });
    const filteredTreeData = filterTreeDataByKeys(data.treeData, filterKeys);
    return filteredTreeData;
  }, []);

  /**
   * 过滤方法合集
   */
  const filterMethods = useMemo(() => {
    return {
      byTitle: (node: TreeData) => {
        return node.title?.indexOf(data.filterValue) > -1;
      }
    };
  }, []);

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
          search(searchValue);
        });
      // 自定义添加提示文案
      inputs['addTips'] &&
        inputs['addTips']((ds: string[]) => {
          Array.isArray(ds)
            ? (data.addTips = ds)
            : (data.addTips = new Array(data.maxDepth || 1000).fill(ds));
        });
      // 设置勾选项
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

      inputs.setSelectedKeys &&
        inputs.setSelectedKeys((keys: Array<string>) => {
          if (!Array.isArray(keys)) {
            return onError('设置选中项参数是数组');
          }
          setSelectedKeys(keys);
        });

      // 过滤
      inputs['filter'] &&
        inputs['filter']((filterValue: string) => {
          data.filterValue = filterValue;
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

  /**
   * 勾选事件处理
   * @param checkedKeys
   */
  const onCheck = useCallback((checkedKeys: React.Key[], info) => {
    if (env.edit) return;
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
   */
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

  /**
   * 添加节点渲染
   * @param item 树节点数据
   * @param isRoot 是否为根节点
   * @returns JSX
   */
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

  /**
   * 树节点图标渲染
   * @param item 节点数据
   * @returns JSX
   */
  const getNodeIcon = (item) => {
    const { iconConfig } = data;
    if (item.icon || (iconConfig?.defaultSrc === 'custom' && iconConfig?.customIcon))
      return (
        <Image
          width={iconConfig?.size[1] || 14}
          height={iconConfig?.size[0] || 14}
          src={item.icon || iconConfig?.customIcon}
          preview={false}
        />
      );
    if (iconConfig?.defaultSrc === 'inner') {
      return (
        Icons && (
          <span style={{ fontSize: Math.max(...iconConfig?.size) }}>
            {Icons[iconConfig?.innerIcon || ('FolderOpenOutlined' as string)]?.render()}
          </span>
        )
      );
    }
    return void 0;
  };

  /**
   * 树节点标题渲染
   * @param item 树节点数据
   * @returns JSX
   */
  const renderTitle = (item, isRoot) => {
    item.title = env.i18n(item.title || '');

    const Icon = getNodeIcon(item);

    // 搜索
    const index = item.title?.indexOf(data.searchValue);
    const beforeStr = item.title.substr(0, index);
    const afterStr = item.title.substr(index + data?.searchValue?.length);
    const wrapperStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    };
    // 修改
    const titleStyle: CSSProperties = {
        display: data.isEditing === item.key ? 'none' : void 0
      },
      inputStyle = {
        display: data.isEditing === item.key ? 'block' : 'none'
      };

    const outputItem = deepCopy(item);
    if (outputItem._key) {
      outputItem.key = outputItem._key;
    }
    if (outputItem.isRoot === undefined) {
      outputItem.isRoot = isRoot;
    }
    if (outputItem.isLeaf === undefined) {
      outputItem.isLeaf = !outputItem.children?.length;
    }

    /**只读态 */
    const title = (
      <Space size={data.iconConfig?.gutter} style={titleStyle} className="title">
        {Icon}
        {index > -1 ? (
          <div>
            {beforeStr}
            <span style={{ color: '#f00' }}>{data.searchValue}</span>
            {afterStr}
          </div>
        ) : (
          item.title
        )}
      </Space>
    );

    /**编辑态 */
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
        ActionBtns({ data, record: item, outputItem, env, outputs, onError });
    return (
      <div style={wrapperStyle}>
        {title}
        {editInput}
        {actionBtns}
      </div>
    );
  };

  /**
   * 树节点勾选框动态显示表达式
   * @param node 节点数据
   * @param isRoot 是否根节点
   */
  const getDynamicCheckable = (node: TreeData, isRoot?: boolean): boolean => {
    if (env.edit) return true;
    let dynamicDisplay = true;
    if (data.checkable && data.checkboxDisplayScript) {
      const context = deepCopy(node);
      if (context._key) {
        context.key = context._key;
      }
      if (context.isRoot === undefined) {
        context.isRoot = isRoot;
      }
      if (context.isLeaf === undefined) {
        context.isLeaf = !context.children?.length;
      }
      const sandbox: ExpressionSandbox = new ExpressionSandbox({ context, prefix: 'node' });
      try {
        dynamicDisplay = !!sandbox.executeWithTemplate(data.checkboxDisplayScript);
      } catch (error: any) {
        onError?.(`树组件[${node.title}]节点: ${error}`);
      }
    }
    return dynamicDisplay;
  };

  /**
   * 树节点遍历渲染
   * @param treeData 树数据
   * @param depth 当前层级
   * @param parent 父节点数据
   * @returns JSX
   */
  const renderTreeNode = (treeData: TreeData[], depth = 0, parent = { key: rootKey }) => {
    const { TreeNode } = Tree;
    const hasAddNode = data.addable && (!data.maxDepth || depth < data.maxDepth);
    const lastTreeNode = treeData[treeData.length - 1];
    const addNodeKey = `${parent.key}-${lastTreeNode?.key}`;
    return (
      <>
        {treeData.map((item, inx) => {
          const checkable = getDynamicCheckable(item, depth === 0);
          return (
            <TreeNode
              key={item.key}
              data-tree-node-id={item.key}
              title={renderTitle(item, depth === 0)}
              disableCheckbox={item.disableCheckbox}
              checkable={checkable}
            >
              {renderTreeNode(item.children || [], depth + 1, item)}
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

  const treeData = useMemo(() => {
    return data.filterValue ? filter(filterMethods.byTitle) : data.treeData;
  }, [data.filterValue, data.treeData]);

  return (
    <div>
      {treeData?.length === 0 ? (
        <Empty description={<span>{env.i18n('暂无数据')}</span>} />
      ) : (
        <Tree
          checkable={data.checkable}
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
          blockNode
        >
          {renderTreeNode(treeData || [])}
        </Tree>
      )}
    </div>
  );
}
