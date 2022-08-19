import React, { ReactNode } from 'react';
import classnames from 'classnames';
import { Button, Dropdown, Menu, Popconfirm } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { BaseButtonProps } from 'antd/es/button/button';
import * as Icons from '@ant-design/icons';
import { findColumnItemByKey } from '../utils';
import { getTemplateRenderScript } from '../../utils/runExpCodeScript';
import { TEMPLATE_RENDER_KEY } from '../constants';
import { Location } from '../types';
import css from './ActionBtns.less';

interface ActionBtn extends BaseButtonProps {
  id: string;
  title: string;
  icon: string;
  useIcon?: boolean;
  showText?: boolean;
  location?: Location;
  isHiddenScript: string;
  isDisabledScript: string;
  style?: React.CSSProperties;
}

interface ActionBtnsProps {
  colIndex: number;
  actionBtns: ActionBtn[];
  record: Record<string, any>;
  btnWrapDataSetKey?: boolean | string;
  btnDataSetKey?: string;
  ellipsisActionBtns?: any[];
  dropdownProps?: any;
  isRowBtn?: boolean;
  tableContent: any;
}

export default function ActionBtns({
  colIndex,
  actionBtns,
  record,
  btnWrapDataSetKey = 'table-action',
  btnDataSetKey = 'table-btn',
  ellipsisActionBtns,
  dropdownProps,
  isRowBtn,
  tableContent
}: ActionBtnsProps) {
  const btnWrapProps = {
    [`data-${btnWrapDataSetKey}`]: true
  };
  const btnProps = {
    [`data-${btnDataSetKey}`]: true
  };

  const btnItemR = ({
    icon,
    text,
    location = Location.FRONT
  }: {
    icon: ReactNode;
    text: string;
    location: Location;
  }) => {
    const Icon = Icons && Icons[icon as string]?.render();
    if (location === Location.FRONT) {
      return (
        <>
          {Icon}
          <span>{text}</span>
        </>
      );
    }
    if (location === Location.BACK) {
      return (
        <>
          <span>{text}</span>
          {Icon}
        </>
      );
    }
  };
  const isHiddenBtn = (btn) => {
    let isHidden = false;
    if (btn.isHiddenScript && tableContent?.env?.runtime) {
      try {
        isHidden = eval(getTemplateRenderScript(btn.isHiddenScript, false, TEMPLATE_RENDER_KEY))(record);
      } catch (e) {
        // console.log(e);
      }
    }
    return isHidden;
  };
  const isDisabledBtn = (btn) => {
    let isDisabled = false;
    if (btn.isDisabledScript && tableContent?.env?.runtime) {
      try {
        isDisabled = eval(getTemplateRenderScript(btn.isDisabledScript, false, TEMPLATE_RENDER_KEY))(
          record
        );
      } catch (e) {
        // console.log(e);
      }
    }
    return isDisabled;
  };
  const renderPopconfirm = (btn, renderBtn) => {
    let isDisabled = isDisabledBtn(btn);
    const onBtnClick = () => {
      if (tableContent?.env?.runtime) {
        tableContent.outputs[btn.id]({ ...record });
      }
    };

    const PopTitleFC = () => {
      const titleStyle = {
        fontWeight: 600
      };
      const contentStyle = {
        fontWeight: 400
      };
      return (
        <div>
          <div style={titleStyle}>{popTitle}</div>
          <div style={contentStyle}>{popContent}</div>
        </div>
      );
    };
    const {
      popTitle = '标题',
      popContent = '内容',
      popOkText = '确认',
      popCancelText = '取消',
      popPlacement = 'top',
      popIcon = 'ExclamationCircleFilled',
      useIcon: usePopIcon
    } = btn.popConfig || {};

    return (
      <Popconfirm
        disabled={isDisabled}
        overlayClassName={classnames(
          css.popConfirm,
          !usePopIcon && css.popConfirmNoIcon
        )}
        placement={popPlacement}
        title={<PopTitleFC />}
        okText={popOkText}
        cancelText={popCancelText}
        onConfirm={onBtnClick}
        icon={usePopIcon && popIcon ? Icons[popIcon]?.render() : false}
      >
        <div>{renderBtn(btn)}</div>
      </Popconfirm>
    );
  };

  const renderActionBtn = (btn, btnIdx) => {
    let isDisabled = isDisabledBtn(btn);
    let isHidden = isHiddenBtn(btn);
    const { icon, showText = true, useIcon, supportPopover } = btn;
    if (tableContent?.env?.runtime && isHidden) {
      return null;
    }
    if (
      tableContent?.env?.runtime &&
      !tableContent?.env?.hasPermission({ key: btn.permissionKey })
    ) {
      return null;
    }

    const renderBtn = () => {
      return (
        <Button
          size={btn.size}
          type={btn.type}
          // id={btn.id}
          style={{
            ...btn.style
          }}
          // key={btn.id}
          disabled={isDisabled}
          onClick={() => {
            if (tableContent?.env?.runtime && !supportPopover) {
              tableContent.outputs[btn.id]({ ...record });
            }
          }}
        >
          {useIcon
            ? btnItemR({
                icon,
                text: showText && btn.title,
                location: btn.location
              })
            : showText && btn.title}
        </Button>
      );
    };
    return (
      <div
        key={btn.id}
        // data-table-btn
        {...(btnDataSetKey ? btnProps : {})}
        data-col-index={colIndex}
        id={btn.id}
        style={{
          marginBottom: isRowBtn ? 4 : 0,
          marginTop: isRowBtn ? 4 : 0,
          marginRight: btnIdx !== actionBtns.length - 1 ? (isRowBtn ? 4 : 8) : 0
        }}
      >
        {btn.supportPopover && tableContent?.env?.runtime
          ? renderPopconfirm(btn, renderBtn)
          : renderBtn()}
      </div>
    );
  };

  const renderMenuActionBtn = (btn) => {
    let isDisabled = isDisabledBtn(btn);
    let isHidden = isHiddenBtn(btn);
    const { icon, showText = true, useIcon, supportPopover } = btn;
    if (tableContent?.env?.runtime && isHidden) {
      return null;
    }
    const renderBtn = () => {
      return (
        <div
          style={{
            ...btn.style
          }}
        >
          {useIcon
            ? btnItemR({
                icon,
                text: showText && btn.title,
                location: btn.location
              })
            : showText && btn.title}
        </div>
      );
    };
    const onBtnClick = () => {
      if (tableContent?.env?.runtime) {
        tableContent.outputs[btn.id]({ ...record });
      }
    };

    return (
      <Menu.Item
        key={btn.id}
        id={btn.id}
        disabled={isDisabled}
        onClick={() => {
          if (!supportPopover) {
            onBtnClick();
          }
        }}
      >
        {supportPopover && tableContent?.env?.runtime
          ? renderPopconfirm(btn, renderBtn)
          : renderBtn()}
      </Menu.Item>
    );
  };
  const menu = (
    <Menu>
      {(ellipsisActionBtns || []).map((btn) => renderMenuActionBtn(btn))}
    </Menu>
  );

  //  对齐方式
  const align = findColumnItemByKey(tableContent?.data?.columns, colIndex)?.column?.align;
  const justifyContents = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end'
  };

  const ellipsisActionBtnList = (ellipsisActionBtns || []).filter(
    (btn) => !isHiddenBtn(btn)
  );
  return (
    <div
      {...(btnWrapDataSetKey ? btnWrapProps : {})}
      // data-table-action
      data-col-index={colIndex}
      className={classnames(css['action-btns'], !isRowBtn && css.noWrap)}
      style={{
        justifyContent: justifyContents[align]
      }}
    >
      {actionBtns.map((btn, btnIdx) => renderActionBtn(btn, btnIdx))}
      {ellipsisActionBtnList && !!ellipsisActionBtnList.length && (
        <Dropdown overlay={menu} placement="bottomRight" {...dropdownProps}>
          <div className={css.ellipsisIcon}>
            <EllipsisOutlined />
          </div>
        </Dropdown>
      )}
    </div>
  );
}
