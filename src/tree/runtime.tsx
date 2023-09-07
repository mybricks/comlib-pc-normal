import React, {
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import * as Icons from '@ant-design/icons';
import { Empty, Tree, Input, Image, Space, message, TreeNodeProps } from 'antd';
import type { TreeProps } from 'antd/es/tree';
import { ExpressionSandbox } from '../../package/com-utils';
import { Data, IconType, TreeData } from './types';
import { OutputIds } from './constants';
import {
  pretreatTreeData,
  setCheckboxStatus,
  generateList,
  updateNodeData,
  getParentKey,
  filterCheckedKeysByCheckedValues,
  excludeParentKeys,
  outputNodeValues,
  filterTreeDataByKeys,
  traverseTree
} from './utils';
import ActionBtns from './ActionBtn';
import { MODIFY_BTN_ID } from './types';
import { deepCopy, typeCheck, uuid } from '../utils';

export default function ({ env, data, inputs, outputs, onError, logger }: RuntimeParams<Data>) {
  const [checkedKeys, setCheckedKeys] = useState(data.checkedKeys);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(
    data.defaultExpandAll ? data.expandedKeys : []
  );
  const [autoExpandParent, setAutoExpandParent] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const treeKeys = useRef<any>(null);

  const keyFieldName = env.edit ? 'key' : data.keyFieldName || 'key';
  const titleFieldName = env.edit ? 'title' : data.titleFieldName || 'title';
  const childrenFieldName = env.edit ? 'children' : data.childrenFieldName || 'children';

  const rootKey = useMemo(() => {
    return uuid();
  }, []);

  useEffect(() => {
    treeKeys.current = [];
    generateList(data.treeData, treeKeys.current, keyFieldName);
  }, [data.treeData]);

  /** 按标签搜索，高亮展示树节点
   * @param searchValue 搜索值
   */
  const search = useCallback((searchValue: string) => {
    data.searchValue = searchValue;
    const searchedKeys = treeKeys.current.map((item) => {
      if (filterMethods.byTitle(item)) {
        return getParentKey(item[keyFieldName], data.treeData, keyFieldName);
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
        let childKey = item[keyFieldName];
        filterKeys.push(childKey);
        while (getParentKey(childKey, data.treeData, keyFieldName)) {
          const parentKey = getParentKey(childKey, data.treeData, keyFieldName);
          childKey = parentKey;
          filterKeys.push(parentKey);
        }
      }
    });
    const filteredTreeData = filterTreeDataByKeys(data.treeData, filterKeys, keyFieldName);
    return filteredTreeData;
  }, []);

  /**
   * 过滤方法合集
   */
  const filterMethods = useMemo(() => {
    return {
      byTitle: (node: TreeData) => {
        return node[titleFieldName]?.indexOf(data.filterValue) > -1;
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
            const inputCheckedKeys = filterCheckedKeysByCheckedValues(
              data.treeData,
              value,
              keyFieldName
            );
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
      data.outParentKeys || data.checkStrictly ? checkedKeys : excludeParentKeys(data, checkedKeys);
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
      outputs[OutputIds.ON_CHECK](
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
    outputs[OutputIds.NODE_CLICK](selectedValues);
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
          message.error(data.dropScopeMessage);
          return;
        }
        if (dropFlag !== 0 && dragNodeParent?.[keyFieldName] !== dropNodeParent?.[keyFieldName]) {
          message.error(data.dropScopeMessage);
          return;
        }
        break;
    }

    // 删除原来的节点
    if (!dragNodeParent) {
      data.treeData.splice(dragNodeIndex, 1);
    } else {
      dragNodeParent.children?.splice(dragNodeIndex, 1);
    }

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
        dropNodeParent?.children?.splice(dropNodeIndex + 1, 0, dragNode);
        break;

      // 移动到和dropNode平级，在其前面
      case -1:
        dropNodeParent?.children?.splice(dropNodeIndex, 0, dragNode);
        break;
    }

    outputs[OutputIds.ON_DROP_DONE]({
      dragNodeInfo,
      dropNodeInfo,
      flag: dropFlag
    });
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
            }
            if (data.defaultExpandAll) {
              data.expandedKeys.push(item[keyFieldName]);
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
   * 计算图标动态显示表达式
   * @param item 节点数据
   * @param icon 图标数据
   */
  const getDynamicDisplay = (item: TreeNodeProps, icon: IconType): boolean => {
    let dynamicDisplay = true;

    if (icon.displayRule === 'dynamic' && icon.displayExpression) {
      const context = {
        ...item
      };
      const sandbox: ExpressionSandbox = new ExpressionSandbox({ context, prefix: 'node' });
      try {
        dynamicDisplay = sandbox.executeWithTemplate(icon.displayExpression);
      } catch (error: any) {
        onError?.(`树[${icon.title}]图标: ${error}`);
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
    const Icon: { gutter: number; jsx?: ReactNode } = {
      gutter: 0
    };
    if (item.icon || (icon?.src === 'custom' && icon?.customIcon)) {
      Icon.gutter = icon?.gutter?.[0] || 8;
      Icon.jsx = (
        <Image
          width={icon?.size[1] || 14}
          height={icon?.size[0] || 14}
          src={item.icon || icon?.customIcon}
          preview={false}
        />
      );
    }
    if (icon?.src === 'inner') {
      Icon.gutter = icon?.gutter?.[0] || 8;
      Icon.jsx = Icons && (
        <span style={{ fontSize: Math.max(...icon?.size) }}>
          {Icons[icon?.innerIcon || ('FolderOpenOutlined' as string)]?.render()}
        </span>
      );
    }
    return Icon;
  };

  /**
   * 树节点标题渲染
   * @param item 树节点数据
   * @returns JSX
   */
  const renderTitle = (item, outputItem, isRoot) => {
    const title = env.i18n(item[titleFieldName] || '');

    const Icon = getNodeIcon(outputItem);

    // 搜索
    const index = title?.indexOf(data.searchValue);
    const beforeStr = title.substr(0, index);
    const afterStr = title.substr(index + data?.searchValue?.length);
    const wrapperStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    };
    // 修改
    const titleStyle: CSSProperties = {
        display: data.isEditing === item[keyFieldName] ? 'none' : void 0
      },
      inputStyle = {
        display: data.isEditing === item[keyFieldName] ? 'block' : 'none'
      };

    /**只读态 */
    const Title = (
      <Space size={Icon.gutter} style={titleStyle} className="title">
        {Icon.jsx}
        {index > -1 ? (
          <div>
            {beforeStr}
            <span style={{ color: '#f00' }}>{data.searchValue}</span>
            {afterStr}
          </div>
        ) : (
          title
        )}
      </Space>
    );

    /**编辑态 */
    const editInput = (
        <Input
          style={inputStyle}
          bordered={false}
          defaultValue={title}
          size="middle"
          onClick={(e) => {
            e.stopPropagation();
          }}
          onPressEnter={({ target }) => {
            item[titleFieldName] = target.value;
            outputItem[titleFieldName] = target.value;
            data.isEditing = '';
            const { [childrenFieldName]: children, ...res } = outputItem;
            outputs[MODIFY_BTN_ID](res);
          }}
        />
      ),
      actionBtns =
        data.isEditing !== item[keyFieldName] &&
        data.useActions &&
        ActionBtns({ data, record: item, outputItem, env, outputs, onError });
    return (
      <div style={wrapperStyle}>
        {Title}
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
              title={renderTitle(item, outputItem, depth === 0)}
              disableCheckbox={item.disableCheckbox}
              checkable={checkable}
            >
              {renderTreeNode(item[childrenFieldName] || [], depth + 1, item)}
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
          {renderTreeNode(treeData || [])}
        </Tree>
      )}
    </div>
  );
}
