import React from 'react';
import * as Icons from '@ant-design/icons';
import { Button, Dropdown, Menu, Modal, Image } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { ExpressionSandbox } from '../../../../package/com-utils';
import { deepCopy } from '../../../utils';
import { ActionBtn, ActionBtnsProps, DELETE_BTN_ID, MODIFY_BTN_ID, TreeData } from '../../types';
import { OutputIds } from '../../constants';
import css from './style.less';

export default function ActionBtns({
  record,
  outputItem,
  data,
  env,
  outputs,
  onError
}: ActionBtnsProps) {
  const { treeData, removeConfirm } = data;
  const keyFieldName = env.edit ? 'key' : data.keyFieldName || 'key';

  const hasChildren = record?.children?.length > 0;
  const { maxToEllipsis, useEllipsis, ...dropdownProps } = data.ellipsisActionBtnsConfig || {};

  /**
   * 删除节点
   * @param treeData treeNodes 数据
   * @param key 节点的key
   * @param keyFieldName 标识字段
   * @returns
   */
  const deleteNode = (treeData: TreeData[], key: string) => {
    return treeData.map((item) => {
      if (item[keyFieldName] === key) {
        return null;
      } else if (item.children) {
        item.children = deleteNode(item.children, key).filter((def) => !!def) as TreeData[];
      }
      return item;
    });
  };

  /**
   * 删除节点的二次弹窗
   */
  const confirm = () => {
    // const text = hasChildren
    //   ? '确定删除节点"${title}"及其所有子节点吗？此操作不可恢复！'
    //   : '确定删除节点"${title}"吗？此操作不可恢复！';

    const sandbox: ExpressionSandbox = new ExpressionSandbox({ context: record });
    const confirmTitle = sandbox.executeWithTemplate(removeConfirm);
    const content = hasChildren
      ? `确定删除节点${record.title}及其所有子节点吗？此操作不可恢复！`
      : `确定删除节点"${record.title}"吗？此操作不可恢复！`;
    Modal.confirm({
      // content: env.i18n({ text, params: { title: env.i18n(record.title) } }),
      content: confirmTitle,
      okText: env.i18n('确定'),
      cancelText: env.i18n('取消'),
      closable: true,
      onOk: () => {
        btnClick(DELETE_BTN_ID);
      }
    });
  };

  /**
   * 按钮点击事件
   * @param id 按钮id
   */
  const btnClick = (id) => {
    if (id === MODIFY_BTN_ID && data.editInline) {
      data.isEditing = record[keyFieldName];
    } else {
      if (id === DELETE_BTN_ID) {
        data.treeData = deleteNode(treeData, record[keyFieldName]).filter(
          (def) => !!def
        ) as TreeData[];
        outputs[OutputIds.OnChange](deepCopy(data.treeData));
      }
      outputs[id](outputItem);
    }
  };

  /**
   * 计算按钮动态显示表达式
   * @param btn 按钮数据
   */
  const getDynamicDisplay = (btn: ActionBtn): boolean => {
    if (env.edit) return true;
    let dynamicDisplay = true;
    const context = {
      ...outputItem
    };
    const sandbox: ExpressionSandbox = new ExpressionSandbox({ context, prefix: 'node' });
    if (btn.displayScript) {
      try {
        dynamicDisplay = sandbox.executeWithTemplate(btn.displayScript);
      } catch (error: any) {
        onError?.(`树组件[${btn.title}]操作项: ${error}`);
      }
    }
    return dynamicDisplay;
  };

  /**
   * 操作项图标渲染
   * @param btn 按钮数据
   * @returns JSX
   */
  const getNodeIcon = (btn: ActionBtn) => {
    const { iconConfig, title } = btn;
    if (iconConfig?.src === 'custom' && iconConfig?.customIcon)
      return (
        <Image
          width={iconConfig?.size[1] ?? 14}
          height={iconConfig?.size[0] ?? 14}
          style={{
            marginRight: title ? iconConfig?.gutter ?? 8 : void 0
          }}
          src={iconConfig?.customIcon}
          preview={false}
        />
      );
    if (iconConfig?.src === 'inner') {
      return (
        Icons && (
          <span
            style={{
              fontSize: Math.max(...iconConfig?.size),
              marginRight: title ? iconConfig?.gutter ?? 8 : void 0
            }}
          >
            {Icons[iconConfig?.innerIcon ?? ('EditOutlined' as string)]?.render()}
          </span>
        )
      );
    }
    return void 0;
  };

  /** 计算省略展示和正常展示的按钮列表 */
  let ellipsisActionBtns: ActionBtn[] = [];
  let actionBtns = data.actionBtns.filter((btn) => {
    const dynamicDisplay = getDynamicDisplay(btn);
    const isHidden =
      btn.hidden ?? (btn.id === DELETE_BTN_ID && hasChildren && !data.allNodeDeletable);
    return !isHidden && dynamicDisplay;
  });
  if (env.runtime && useEllipsis) {
    let maxToEllipsisIdx = 0,
      tempMaxToEllipsis = 0;
    (actionBtns || []).forEach((btn) => {
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
    ellipsisActionBtns = (actionBtns || []).slice(maxToEllipsisIdx);
    actionBtns = (actionBtns || []).slice(0, maxToEllipsisIdx);
  }

  /**
   * 普通按钮渲染
   * @param btn
   * @returns JSX
   */
  const renderActionBtn = (btn) => {
    const { id, title, type, danger } = btn;
    const renderBtn = () => {
      return (
        <Button
          type={type}
          size="small"
          style={{
            ...btn.style
          }}
          danger={danger}
          onClick={(e) => {
            if (env.edit) return;
            e.stopPropagation();
            if (id !== DELETE_BTN_ID) btnClick(id);
            else confirm();
          }}
          icon={getNodeIcon(btn)}
        >
          {env.i18n(title)}
        </Button>
      );
    };
    return (
      <div key={id} data-btn-id={id}>
        {renderBtn()}
      </div>
    );
  };

  /**
   * 下拉按钮渲染
   * @param btn 按钮数据
   * @returns JSX
   */
  const renderMenuActionBtn = (btn: ActionBtn) => {
    const { id, title, type, hidden } = btn;
    if (env?.runtime && hidden) {
      return null;
    }

    return (
      <Menu.Item
        key={id}
        id={id}
        danger={type === 'danger'}
        onClick={({ domEvent }) => {
          if (env.edit) return;
          domEvent.stopPropagation();
          if (id !== DELETE_BTN_ID) btnClick(id);
          else confirm();
        }}
        icon={getNodeIcon(btn)}
      >
        {env.i18n(title)}
      </Menu.Item>
    );
  };

  const menu = <Menu>{ellipsisActionBtns.map((btn) => renderMenuActionBtn(btn))}</Menu>;

  return (
    <div
      className={
        data.actionsShowWay === 'hover' && env.runtime
          ? css['action-btns_dynamic']
          : css['action-btns']
      }
      data-action-btns
    >
      {actionBtns.map((btn) => !btn.hidden && renderActionBtn(btn))}
      {ellipsisActionBtns && !!ellipsisActionBtns.length && (
        <Dropdown overlay={menu} placement="bottomRight" {...dropdownProps}>
          <EllipsisOutlined
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </Dropdown>
      )}
    </div>
  );
}
