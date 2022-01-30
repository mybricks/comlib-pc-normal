import React, { ReactNode } from 'react';
import classnames from 'classnames';
import { Button, Dropdown, Menu, Popconfirm } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { BaseButtonProps } from 'antd/es/button/button';
import { observe } from '@mybricks/rxui';
// import Icon from '@es/icon-select';
import { TableContent } from '../runtime';
import { getTemplateRenderScript } from '../utils';
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
  useBtnMargin?: boolean;
}

export default function ActionBtns({
  colIndex,
  actionBtns,
  record,
  btnWrapDataSetKey = 'table-action',
  btnDataSetKey = 'table-btn',
  ellipsisActionBtns,
  dropdownProps,
  useBtnMargin
}: ActionBtnsProps) {
  const tableContent = observe(TableContent, { from: 'parents' });
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
    if (location === Location.FRONT) {
      return (
        <>
          <Icon type={icon} />
          <span>{text}</span>
        </>
      );
    }
    if (location === Location.BACK) {
      return (
        <>
          <span>{text}</span>
          <Icon type={icon} />
        </>
      );
    }
  };
  const isHiddenBtn = (btn) => {
    let isHidden = false;
    if (btn.isHiddenScript) {
      try {
        isHidden = eval(getTemplateRenderScript(btn.isHiddenScript))(record);
      } catch (e) {
        console.log(e);
      }
    }
    if (tableContent?.env?.runtime && isHidden) {
      return isHidden;
    }
    return false;
  };
  const isDisabledBtn = (btn) => {
    let isDisabled = false;
    if (btn.isDisabledScript) {
      try {
        isDisabled = eval(getTemplateRenderScript(btn.isDisabledScript))(
          record
        );
      } catch (e) {
        console.log(e);
      }
    }
    return isDisabled;
  };
  const renderActionBtn = (btn, btnIdx) => {
    let isDisabled = isDisabledBtn(btn);
    let isHidden = isHiddenBtn(btn);
    const {
      icon,
      showText = true,
      useIcon,
      supportPopover,
      popConfig = {}
    } = btn;
    const {
      popTitle = '标题',
      popContent = '内容',
      popOkText = '确认',
      popCancelText = '取消',
      popPlacement = 'top',
      popIcon = 'ExclamationCircleFilled',
      useIcon: usePopIcon
    } = popConfig;
    if (tableContent?.env?.runtime && isHidden) {
      return null;
    }
    // fixme: focusArea失焦问题
    const onPopConfirm = () => {
      tableContent.outputs[btn.id]({ ...record });
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

    const Btn = () => {
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
          marginBottom: useBtnMargin ? 4 : 0,
          marginTop: useBtnMargin ? 4 : 0,
          marginRight: btnIdx !== actionBtns.length - 1 ? 4 : 0
        }}
      >
        {btn.supportPopover && tableContent?.env?.runtime ? (
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
            onConfirm={onPopConfirm}
            icon={usePopIcon ? <Icon type={popIcon} /> : false}
          >
            <div>
              <Btn />
            </div>
          </Popconfirm>
        ) : (
          <Btn />
        )}
      </div>
    );
  };
  const renderMenuActionBtn = (btn) => {
    let isDisabled = isDisabledBtn(btn);
    let isHidden = isHiddenBtn(btn);
    const { icon, showText = true, useIcon } = btn;

    if (tableContent?.env?.runtime && isHidden) {
      return null;
    }
    return (
      <Menu.Item
        key={btn.id}
        id={btn.id}
        disabled={isDisabled}
        onClick={() => {
          if (tableContent?.env?.runtime) {
            tableContent.outputs[btn.id]({ ...record });
          }
        }}
      >
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
      </Menu.Item>
    );
  };
  const menu = (
    <Menu>
      {(ellipsisActionBtns || []).map((btn) => renderMenuActionBtn(btn))}
    </Menu>
  );

  //  对齐方式
  const align = tableContent?.data?.columns[colIndex]?.align;
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
      className={css['action-btns']}
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
