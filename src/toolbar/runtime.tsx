import React, { useCallback, useEffect } from 'react';
import { Button, Dropdown, Menu, Space, Image } from 'antd';
import * as Icons from '@ant-design/icons';
import { EllipsisOutlined } from '@ant-design/icons';
import { InputIds, OutputIds } from './constants';
import { BtnItem, Data, LocationEnum } from './types';
import css from './style.less';

export default ({ env, data, inputs, outputs }: RuntimeParams<Data>) => {
  useEffect(() => {
    if (env.runtime) {
      (data.btnList || []).forEach((item) => {
        const { key } = item;
        inputs[`${InputIds.SetBtnText}_${key}`]?.((val: string) => {
          if (val && typeof val === 'string') {
            item.text = val;
          }
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

  //如果data.dataType是'external'的
  useEffect(() => {
    if (env.runtime) {
      (data.btnList || []).forEach((item) => {
        const { key } = item;
        inputs[key]((ds: any) => {
          item.inVal = ds;
        });
      });
    }
  });

  //单击事件，数据的输出
  const onClick = (item: BtnItem) => {
    if (env.runtime) {
      const outputVal: string | number = item.dataType === 'external' ? item.inVal : item.outVal;
      outputs[item.key](outputVal);
    }
  };
  //双击事件，数据的输出
  const onDoubleClick = useCallback((item: BtnItem) => {
    if (env.runtime) {
      const outputVal: string | number = item.dataType === 'external' ? item.inVal : item.outVal;
      outputs[`${OutputIds.DoubleClick}_${item.key}`](outputVal);
    }
  }, []);

  const renderTextAndIcon = (item: BtnItem) => {
    const { useIcon, icon, iconLocation, iconDistance, text, showText, contentSize } = item;
    const Icon = Icons && Icons[icon as string]?.render();
    return (
      <Space size={iconDistance}>
        {useIcon && Icon && iconLocation === LocationEnum.FRONT ? (
          <span style={{ fontSize: contentSize[0] }}>{Icon}</span>
        ) : null}
        {!useIcon || showText ? <span>{text}</span> : null}
        {useIcon && Icon && iconLocation === LocationEnum.BACK ? (
          <span style={{ fontSize: contentSize[0] }}>{Icon}</span>
        ) : null}
      </Space>
    );
  };

  const renderTextAndCustom = (item: BtnItem) => {
    const { useIcon, iconLocation, iconDistance, text, showText, src, contentSize } = item;
    return (
      <Space size={iconDistance} className={css.space}>
        {useIcon && src && iconLocation === LocationEnum.FRONT ? (
          <Image
            width={contentSize[1]}
            height={contentSize[0]}
            src={src}
            preview={false}
            fallback={'加载失败'}
          ></Image>
        ) : null}
        {!useIcon || showText ? <span>{text}</span> : null}
        {useIcon && src && iconLocation === LocationEnum.BACK ? (
          <Image
            width={contentSize[1]}
            height={contentSize[0]}
            src={src}
            preview={false}
            fallback={'加载失败'}
          ></Image>
        ) : null}
      </Space>
    );
  };

  const renderBtnContext = (item: BtnItem) => {
    const { isCustom } = item;
    if (isCustom === true) {
      return renderTextAndCustom(item);
    } else {
      return renderTextAndIcon(item);
    }
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
      const { type, size, shape, disabled, isCustom } = item;
      return (
        <div key={item.key} data-btn-idx={item.key} className={css.button}>
          <Button
            type={type as any}
            size={size}
            shape={shape}
            disabled={disabled}
            onClick={() => onClick(item)}
            onDoubleClick={() => onDoubleClick(item)}
          >
            {renderBtnContext(item)}
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
        justifyContent: data.layout,
        gap: `${data.spaceSize?.[1]}px ${data.spaceSize?.[0]}px`
      }}
    >
      {(data.btnList || []).length > 0 || env.runtime ? (
        <>
          {renderBtnList(normalBtnList)}
          {renderEllipsisList(ellipsisBtnList)}
        </>
      ) : (
        <div className={css.suggestion}>在编辑栏中点击"添加按钮"</div>
      )}
    </div>
  );
};
