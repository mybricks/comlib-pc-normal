import React, { useCallback, useEffect } from 'react';
import { Button, Dropdown, Menu, Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { EllipsisOutlined } from '@ant-design/icons';
import { InputIds } from './constants';
import { BtnItem, Data, LocationEnum } from './types';
import css from './style.less';

export default ({ env, data, inputs, outputs }: RuntimeParams<Data>) => {
  useEffect(() => {
    if (env.runtime) {
      (data.btnList || []).forEach((item) => {
        const { key } = item;
        inputs[`${InputIds.SetOutputVal}_${key}`]?.((val: any) => {
          item.outputValue = val;
        });
        inputs[`${InputIds.SetDisable}_${key}`]?.(() => {
          item.disabled = true;
        });
        inputs[`${InputIds.SetEnable}_${key}`]?.(() => {
          item.disabled = false;
        });
        inputs[`${InputIds.SetHidden}_${key}`]?.(() => {
          item.hidden = true;
        });
        inputs[`${InputIds.SetVisible}_${key}`]?.(() => {
          item.hidden = false;
        });
      });
    }
  }, []);

  const hasPermission = (key) => {
    if (env.runtime && key && !env?.hasPermission({ key })) {
      return false;
    }
    return true;
  };

  const onClick = (item: BtnItem) => {
    if (env.runtime) {
      outputs[item.key](item.outputValue);
    }
  };

  const onDoubleClick = useCallback((item: BtnItem) => {
    if (env.runtime) {
      outputs[item.doubleClickKey](item.outputValue);
    }
  }, []);

  const renderTextAndIcon = (item: BtnItem) => {
    const { useIcon, icon, iconLocation, iconDistance, text, showText } = item;
    const Icon = Icons && Icons[icon as string]?.render();
    return (
      <Space size={iconDistance}>
        {useIcon && Icon && iconLocation === LocationEnum.FRONT ? <span>{Icon}</span> : null}
        {!useIcon || showText ? <span>{text}</span> : null}
        {useIcon && Icon && iconLocation === LocationEnum.BACK ? <span>{Icon}</span> : null}
      </Space>
    );
  };

  const renderEllipsisList = (btnList: BtnItem[]) => {
    if (!btnList.length) {
      return null;
    }
    const menu = (
      <Menu>
        {btnList.map((item) => {
          return (
            <Menu.Item key={item.key} disabled={item.disabled} onClick={() => onClick(item)}>
              {renderTextAndIcon(item)}
            </Menu.Item>
          );
        })}
      </Menu>
    );
    return (
      <Dropdown overlay={menu} placement="bottomRight">
        <div className={css.ellipsisIcon}>
          <EllipsisOutlined />
        </div>
      </Dropdown>
    );
  };
  const renderBtnList = (btnList: BtnItem[]) => {
    if (!btnList.length) {
      return null;
    }
    return btnList.map((item) => {
      if (!hasPermission(item.permissionKey) || item.hidden) return;
      const { type, size, shape, disabled } = item;
      return (
        <div key={item.key} data-btn-idx={item.key}>
          <Button
            type={type as any}
            size={size}
            shape={shape}
            disabled={disabled}
            onClick={() => onClick(item)}
            onDoubleClick={() => onDoubleClick(item)}
          >
            {renderTextAndIcon(item)}
          </Button>
        </div>
      );
    });
  };

  const normalBtnList = (data.btnList || [])
    .filter((item) => !(!hasPermission(item.permissionKey) || item.hidden))
    .filter((item, idx) =>
      env.runtime && data.useEllipses && data.maxShowNumber ? idx < data.maxShowNumber : true
    );

  const ellipsisBtnList = (data.btnList || [])
    .filter((item) => !(!hasPermission(item.permissionKey) || item.hidden))
    .filter((item, idx) =>
      env.runtime && data.useEllipses && data.maxShowNumber ? idx >= data.maxShowNumber : false
    );

  return (
    <div
      className={css.toolbar}
      style={{
        justifyContent: data.layout
      }}
    >
      <Space size={data.spaceSize} wrap key={env.edit ? JSON.stringify(data.spaceSize) : undefined}>
        {(data.btnList || []).length > 0 || env.runtime ? (
          <>
            {renderBtnList(normalBtnList)}
            {renderEllipsisList(ellipsisBtnList)}
          </>
        ) : (
          <div className={css.suggestion}>在编辑栏中点击"添加按钮"</div>
        )}
      </Space>
    </div>
  );
};
