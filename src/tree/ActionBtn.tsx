import { Button, Modal } from 'antd';
import React from 'react';
import { ActionBtnsProps, DELETE_BTN_ID, MODIFY_BTN_ID, TreeData } from './constants';
import css from './ActionBtns.less';

export default function ActionBtns({ record, outputItem, data, env, outputs }: ActionBtnsProps) {
  const { actionBtns, treeData } = data;
  const hasChildren = record?.children?.length > 0;

  /**
   * 删除节点
   * @param treeData treeNodes 数据
   * @param key  节点的key
   * @returns
   */
  const deleteNode = (treeData: TreeData[], key: string) => {
    return treeData.map((item) => {
      if (item.key === key) {
        return null;
      } else if (item.children) {
        item.children = deleteNode(item.children, key).filter((def) => !!def) as TreeData[];
      }
      return item;
    });
  };

  const btnClick = (id) => {
    if (env?.runtime) {
      if (id === MODIFY_BTN_ID) {
        data.isEditing = record.key;
      } else {
        if (id === DELETE_BTN_ID) {
          data.treeData = deleteNode(treeData, record.key).filter((def) => !!def) as TreeData[];
        }
        outputs[id](outputItem);
      }
    }
  };

  const confirm = () => {
    const text = hasChildren
      ? '确定删除节点"${title}"及其所有子节点吗？此操作不可恢复！'
      : '确定删除节点"${title}"吗？此操作不可恢复！';
    Modal.confirm({
      content: env.i18n({ text, params: { title: env.i18n(record.title) } }),
      okText: env.i18n('确定'),
      cancelText: env.i18n('取消'),
      closable: true,
      onOk: () => {
        btnClick(DELETE_BTN_ID);
      }
    });
  };

  const renderActionBtn = (btn, btnIdx) => {
    const { id, title, size, type, showText = true } = btn;
    if (id === DELETE_BTN_ID && hasChildren && !data.allNodeDeletable) return;
    const renderBtn = () => {
      return (
        <Button
          size={size}
          type={type}
          style={{
            ...btn.style
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (env.edit) return;
            if (id !== DELETE_BTN_ID) btnClick(id);
            else confirm();
          }}
        >
          {showText && env.i18n(title)}
        </Button>
      );
    };
    return (
      <div key={id} data-btn-id={id}>
        {renderBtn()}
      </div>
    );
  };

  const wrapperStyle: React.CSSProperties = {
    flex: `0 0 ${(actionBtns?.length + 1) * 60}px`,
    justifyContent: 'end'
  };
  return (
    <div className={css['action-btns']} style={wrapperStyle} data-action-btns>
      {actionBtns.map((btn, btnIdx) => !btn.hidden && renderActionBtn(btn, btnIdx))}
    </div>
  );
}
