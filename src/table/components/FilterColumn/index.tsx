import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Tooltip, Dropdown, Menu, Checkbox, Button } from 'antd';
import { ControlOutlined, SettingOutlined } from '@ant-design/icons';
import { Tree } from 'antd';
import { DefaultRowKey, OutputIds } from '../../constants';
import style from './index.less';

const getDefaultCheckedKeys = (cloumns) => {
  return cloumns.map((item) => item._id);
};

const flatTree = (tree) => {
  let res = [] as any[];

  if (Array.isArray(tree)) {
    tree.forEach((item) => {
      res.push(item);
      if (item.children) {
        res.push(...flatTree(item.children));
      }
    });
  }
  return res;
};
const moveEle = (list, item, sourceIndex, targetIndex) => {
  list.splice(targetIndex, 0, item);
  list.splice(targetIndex < sourceIndex ? sourceIndex + 1 : sourceIndex, 1);
};

export default function FilterColumnRender({ data, env, dataSource, outputs }) {
  //表格筛选栏渲染
  const [checkedKeys, setCheckedKeys] = useState<string[]>(getDefaultCheckedKeys(data.columns));
  const rowKey = data.rowKey || DefaultRowKey;

  const treeData = useMemo(() => {
    return [...data.columns].reduce(
      (tree, item) => {
        const newItem = {
          ...item,
          title: env.i18n(item.title)
        };
        // 用_id表示表格原始的key，
        newItem.key = item._id;
        if (item.fixed === 'left') {
          tree[0].children.push(newItem);
        } else if (item.fixed === 'right') {
          tree[2].children.push(newItem);
        } else {
          tree[1].children.push(newItem);
        }
        return tree;
      },
      [
        {
          title: '固定在左侧',
          key: 'left',
          disabled: true,
          checkable: false,
          children: []
        },
        {
          title: '不固定',
          key: 'center',
          disabled: true,
          checkable: false,
          children: []
        },
        {
          title: '固定在右侧',
          key: 'right',
          disabled: true,
          checkable: false,
          children: []
        }
      ]
    );
  }, [data.columns]);

  const checkedAll = useCallback((enable) => {
    if (enable) {
      setCheckedKeys(data.columns.map((item) => item._id));
    } else {
      setCheckedKeys([]);
    }
  }, []);

  useEffect(() => {
    if (data.useColumnSetting) {
      outputs?.[OutputIds.COLUMNS_CHANGE](data.columns);
    }
  }, [data.columns]);

  useEffect(() => {
    if (env.runtime) {
      data.columns = data.columns.map((item) => {
        item.visible = checkedKeys.includes(item._id);
        return item;
      });
    }
  }, [checkedKeys]);

  const changeOrder = useCallback(
    (props) => {
      const { dragNode, node } = props;

      // 将节点拍平，方便进行节点的删除和插入操作
      let treeList = flatTree(treeData);
      const currentColumn = data.columns.find((item) => item._id === dragNode.key);
      const position = node.pos;
      if (position.indexOf('0-0') === 0) {
        currentColumn.fixed = 'left';
      } else if (position.indexOf('0-2') === 0) {
        currentColumn.fixed = 'right';
      } else {
        currentColumn.fixed = 'center';
      }

      // dragNode为当前拖动的节点
      const currentIndex = treeList.findIndex((item) => item.key === dragNode.key);
      // node为插入位置的前一个节点
      const insertRreIndex = treeList.findIndex((item) => item.key === node.key) + 1;
      moveEle(treeList, dragNode, currentIndex, insertRreIndex);
      data.columns = treeList
        .filter((item) => !['left', 'right', 'center'].includes(item.key))
        .map((node) => data.columns.find((item) => item._id === node.key));
    },
    [treeData]
  );

  const menu = () => {
    return (
      <Menu>
        <Menu.Item key="checked">
          <Checkbox
            defaultChecked={true}
            indeterminate={checkedKeys.length > 0 && checkedKeys.length < data.columns.length}
            onChange={(e) => {
              checkedAll(e.target.checked);
            }}
            checked={checkedKeys.length === data.columns.length}
          >
            展示所有列
          </Checkbox>
        </Menu.Item>
        <Menu.Divider />
        {/* {genElements(coloumns)} */}
        <Tree
          checkable
          draggable
          rootClassName={style.treeRoot}
          onDrop={changeOrder}
          switcherIcon={null}
          expandedKeys={['right', 'center', 'left']}
          onCheck={(keys, e) => {
            const { key } = e.node;
            if (checkedKeys.includes(key)) {
              setCheckedKeys(checkedKeys.filter((item) => item !== key));
            } else {
              setCheckedKeys([...checkedKeys, key]);
            }
          }}
          checkedKeys={checkedKeys}
          treeData={treeData}
        />
      </Menu>
    );
  };

  const [visibleChange, setVisibleChange] = useState({ visible: false });
  const handleVisibleChange = (flag) => {
    setVisibleChange({ visible: flag });
  };

  const renderFilterColumn = () => {
    if (!data.useColumnSetting) {
      return null;
    }
    return (
      <div data-table-header-filter style={{ paddingLeft: '12px' }}>
        <Tooltip title="列设置">
          <Dropdown
            overlay={menu}
            placement="bottomRight"
            arrow={true}
            onVisibleChange={handleVisibleChange}
            visible={visibleChange.visible}
            trigger={['click']}
          >
            <Button icon={<SettingOutlined />}></Button>
          </Dropdown>
        </Tooltip>
      </div>
    );
  };

  return renderFilterColumn();
}
