import React, { useCallback, useEffect } from 'react';
import { Button, Dropdown, Menu, Space, Image } from 'antd';
import * as Icons from '@ant-design/icons';
import { EllipsisOutlined } from '@ant-design/icons';
import { InputIds, OutputIds } from './constants';
import { BtnItem, Data, LocationEnum } from './types';
import css from './style.less';

export const checkIfMobile = (env) => {
  return env?.canvas?.type === 'mobile'
}

export default ({ env, data, inputs, outputs, slots }: RuntimeParams<Data>) => {
  const isMobile = checkIfMobile(env);
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
        inputs[`${InputIds.SetBtnOpenLoading}_${key}`]?.(() => {
          item.loading = true;
        });
        inputs[`${InputIds.SetBtnCloseLoading}_${key}`]?.(() => {
          item.loading = false;
        });
        inputs[`${InputIds.SetBtnStyle}_${key}`]?.((val: any) => {
          item.style = { ...(item.style || {}), ...(val || {}) };
        });
      });
    }
  }, []);

  /**
   * 获取没有权限时组件要做的操作
   * 返回值如下：
   *  1. hide: 隐藏
   *  2. disable: 禁用
   *  3. none: 什么都不用做
   * @param id 权限ID
   * @returns 没有权限时需要做的事情吗，如果有权限返回 none
   */
  const getWhatToDoWithoutPermission = (id?: string): 'none' | 'hide' | 'disable' => {
    const permission = !(env.runtime && id && !env?.hasPermission(id));
    if (permission) return 'none';

    // TODO: 等后续「无权限时」字段开放后，将返回值按类型返回
    return 'hide';
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
            alt={' '}
          ></Image>
        ) : null}
        {!useIcon || showText ? <span>{text}</span> : null}
        {useIcon && src && iconLocation === LocationEnum.BACK ? (
          <Image
            width={contentSize[1]}
            height={contentSize[0]}
            src={src}
            preview={false}
            alt={' '}
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
          const todo = getWhatToDoWithoutPermission(item.permission?.id);
          return (
            <Menu.Item
              key={item.key}
              disabled={todo === 'disable' ? true : item.disabled}
              onClick={() => onClick(item)}
            >
              {!item.isSlot
                ? renderTextAndIcon(item)
                : slots?.[item.key] && slots?.[item.key].render({ key: item.key })}
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
    const { allShape, allSize, allType, allDanger } = data;
    return btnList.map((item) => {
      const todo = getWhatToDoWithoutPermission(item.permission?.id);
      if (todo === 'hide') return;

      const { type, danger, size, shape, disabled, isCustom, loading, isSlot, key, style } = item;

      return !isSlot ? (
        <div key={key} className={css.button} data-btn-idx={item.key}>
          <Button
            type={(type as any) || allType}
            danger={typeof danger !== 'undefined' ? danger : allDanger}
            size={size || allSize}
            shape={shape || allShape}
            disabled={todo === 'disable' ? true : disabled}
            onClick={() => onClick(item)}
            onDoubleClick={() => onDoubleClick(item)}
            loading={loading}
            block={true}
            style={style || {}}
          >
            {renderBtnContext({ ...item, text: env.i18n(item.text) })}
          </Button>
        </div>
      ) : (
        <div className={css.emptyWrap} data-slot-idx={item.key}>
          {slots?.[key] && slots?.[key].render({ key })}
        </div>
      );
    });
  };

  const normalBtnList = (data.btnList || [])
    .filter(
      (item) =>
        !(
          getWhatToDoWithoutPermission(item.permission?.id) === 'hide' ||
          (item?.hidden && env.runtime)
        )
    )
    .filter((item, idx) =>
      env.runtime && data.useEllipses && data.maxShowNumber ? idx < data.maxShowNumber : true
    );

  const ellipsisBtnList = (data.btnList || [])
    .filter(
      (item) =>
        !(
          getWhatToDoWithoutPermission(item.permission?.id) === 'hide' ||
          (item?.hidden && env.runtime)
        )
    )
    .filter((item, idx) =>
      env.runtime && data.useEllipses && data.maxShowNumber ? idx >= data.maxShowNumber : false
    );

  return (
    <div
      className={`mybricks-toolbar ${css.toolbar} ${isMobile ? css.mobileToolbar : ''}`}
      style={{
        justifyContent: data.layout,
        gap: isMobile ? '8px 4px' : `${data.spaceSize?.[1]}px ${data.spaceSize?.[0]}px`,
        height: '100%'
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
