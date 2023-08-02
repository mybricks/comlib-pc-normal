import React from 'react';
import { Button, Dropdown, Menu, Modal } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { ActionBtn, ActionBtnsProps, DELETE_BTN_ID, MODIFY_BTN_ID, TreeData } from './constants';
import css from './ActionBtns.less';

export default function ActionBtns({ record, outputItem, data, env, outputs }: ActionBtnsProps) {
  const { treeData } = data;
  const hasChildren = record?.children?.length > 0;
  const { maxToEllipsis, useEllipsis, ...dropdownProps } = data.ellipsisActionBtnsConfig || {};

  /** 计算省略展示和正常展示的按钮列表 */
  let ellipsisActionBtns: ActionBtn[] = [];
  let actionBtns = data.actionBtns;
  if (env.runtime && useEllipsis) {
    let maxToEllipsisIdx = 0,
      tempMaxToEllipsis = 0;
    (data.actionBtns || []).forEach((btn) => {
      try {
        if (tempMaxToEllipsis < maxToEllipsis) {
          maxToEllipsisIdx += 1;
          if (!btn.hidden) {
            tempMaxToEllipsis += 1;
          }
        }
      } catch (e) {
        // console.log(e);
      }
    });
    ellipsisActionBtns = (data.actionBtns || []).slice(maxToEllipsisIdx).filter((btn) => {
      const isHidden =
        btn.hidden || (btn.id === DELETE_BTN_ID && hasChildren && !data.allNodeDeletable);
      return !isHidden;
    });
    actionBtns = (data.actionBtns || []).slice(0, maxToEllipsisIdx);
  }
  actionBtns = actionBtns.filter((btn) => {
    const isHidden =
      btn.hidden || (btn.id === DELETE_BTN_ID && hasChildren && !data.allNodeDeletable);
    return !isHidden;
  });
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

  /**
   * 按钮点击事件
   * @param id 按钮id
   */
  const btnClick = (id) => {
    if (id === MODIFY_BTN_ID) {
      data.isEditing = record.key;
    } else {
      if (id === DELETE_BTN_ID) {
        data.treeData = deleteNode(treeData, record.key).filter((def) => !!def) as TreeData[];
      }
      outputs[id](outputItem);
    }
  };

  /**
   * 删除节点的二次弹窗
   */
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

  const renderActionBtn = (btn) => {
    const { id, title, size, type, showText = true } = btn;
    const renderBtn = () => {
      return (
        <Button
          size={size}
          type={type}
          style={{
            ...btn.style
          }}
          onClick={(e) => {
            if (env.edit) return;
            e.stopPropagation();
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

  /**
   * 下拉按钮渲染
   * @param btn 按钮数据
   * @returns JSX
   */
  const renderMenuActionBtn = (btn: ActionBtn) => {
    if (env?.runtime && btn.hidden) {
      return null;
    }
    const onBtnClick = () => {
      if (env?.runtime) {
        btnClick(btn.id);
      }
    };

    return (
      <Menu.Item key={btn.id} id={btn.id} onClick={onBtnClick}>
        {renderActionBtn(btn)}
      </Menu.Item>
    );
  };

  const menu = <Menu>{ellipsisActionBtns.map((btn) => renderMenuActionBtn(btn))}</Menu>;

  return (
    <div className={css['action-btns']} style={wrapperStyle} data-action-btns>
      {actionBtns.map((btn) => !btn.hidden && renderActionBtn(btn))}
      {ellipsisActionBtns && !!ellipsisActionBtns.length && (
        <Dropdown overlay={menu} placement="bottomRight" {...dropdownProps}>
          <div className={css.ellipsisIcon}>
            <EllipsisOutlined />
          </div>
        </Dropdown>
      )}
    </div>
  );
}
