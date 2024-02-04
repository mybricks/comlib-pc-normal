import React, { useCallback, useEffect, useRef } from 'react';
import { Button, Dropdown, Menu, Space, Image } from 'antd';
import * as Icons from '@ant-design/icons';
import { EllipsisOutlined } from '@ant-design/icons';
import { InputIds, OutputIds } from './constants';
import { BtnItem, Data, LocationEnum } from './types';
import css from './style.less';
import { checkIfMobile } from '../utils';

export default ({ env, data, inputs, outputs, slots }: RuntimeParams<Data>) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isMobile = checkIfMobile(env);
  useEffect(() => {
    if (env.runtime) {
      (data.btnList || []).forEach((item) => {
        const { key } = item;

        const btn = wrapperRef.current!.querySelector(
          `div[data-btn-key="${key}"]`
        ) as HTMLDivElement;

        // 初始化按钮动态隐藏逻辑，默认隐藏的按钮先隐藏了
        if (item.hidden) {
          if (btn?.style) btn.style.display = 'none';
        } else {
          if (btn?.style) btn.style.display = 'block';
        }

        inputs[`${InputIds.SetBtnText}_${key}`]?.((val: string, relOutputs) => {
          if (val && typeof val === 'string') {
            item.text = val;
            relOutputs[`${OutputIds.SetBtnTextDone}_${key}`](val);
          }
        });
        inputs[`${InputIds.SetDisable}_${key}`]?.((_, relOutputs) => {
          item.disabled = true;
          relOutputs[`${OutputIds.SetDisableDone}_${key}`]();
        });
        inputs[`${InputIds.SetEnable}_${key}`]?.((_, relOutputs) => {
          item.disabled = false;
          relOutputs[`${OutputIds.SetEnableDone}_${key}`]();
        });
        // 动态隐藏按钮通过 style.display = 'none' 实现，防止出现初始化时先渲染后再隐藏的问题
        inputs[`${InputIds.SetHidden}_${key}`]?.((_, relOutputs) => {
          if (btn?.style) btn.style.display = 'none';
          item.hidden = true;
          relOutputs[`${OutputIds.SetHiddenDone}_${key}`]();
        });
        // 动态显示按钮通过 style.display = 'block' 实现，防止出现初始化时先隐藏后再出现的问题
        inputs[`${InputIds.SetVisible}_${key}`]?.((_, relOutputs) => {
          if (btn?.style) btn.style.display = 'block';
          item.hidden = false;
          relOutputs[`${OutputIds.SetVisibleDone}_${key}`]();
        });
        inputs[`${InputIds.SetBtnOpenLoading}_${key}`]?.((_, relOutputs) => {
          item.loading = true;
          relOutputs[`${OutputIds.SetBtnOpenLoadingDone}_${key}`]();
        });
        inputs[`${InputIds.SetBtnCloseLoading}_${key}`]?.((_, relOutputs) => {
          item.loading = false;
          relOutputs[`${OutputIds.SetBtnCloseLoadingDone}_${key}`]();
        });
        inputs[`${InputIds.SetBtnStyle}_${key}`]?.((val: any, relOutputs) => {
          item.style = { ...(item.style || {}), ...(val || {}) };
          relOutputs[`${OutputIds.SetBtnStyleDone}_${key}`](val);
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
  const getWhatToDoWithoutPermission = (
    permission: BtnItem['permission']
  ): 'none' | 'hide' | 'hintLink' => {
    const hasPermission = !(env.runtime && permission?.id && !env?.hasPermission(permission?.id));
    if (hasPermission) return 'none';

    if (permission.registerData?.noPrivilege) {
      return permission.registerData.noPrivilege;
    }
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
          const todo = getWhatToDoWithoutPermission(item.permission);
          if (todo === 'hintLink')
            return (
              <a
                href={item.permission?.hintLink}
                target="_blank"
                style={{ textDecoration: 'underline' }}
              >
                {item.permission?.registerData?.title || '无权限'}
              </a>
            );
          return (
            <Menu.Item key={item.key} disabled={item.disabled} onClick={() => onClick(item)}>
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
      const todo = getWhatToDoWithoutPermission(item.permission);
      if (todo === 'hide') return;

      const { type, danger, size, shape, disabled, isCustom, loading, isSlot, key, style } = item;

      if (todo === 'hintLink')
        return (
          <a
            href={item.permission?.hintLink}
            target="_blank"
            style={{ textDecoration: 'underline' }}
          >
            {item.permission?.registerData?.title || '无权限'}
          </a>
        );

      return !isSlot ? (
        <div key={key} className={css.button} data-btn-idx={item.key} data-btn-key={item.key}>
          <Button
            type={(type as any) || allType}
            danger={typeof danger !== 'undefined' ? danger : allDanger}
            size={size || allSize}
            shape={shape || allShape}
            disabled={disabled}
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
        <div className={css.emptyWrap} data-slot-idx={item.key} data-btn-key={item.key}>
          {slots?.[key] && slots?.[key].render({ key })}
        </div>
      );
    });
  };

  // 动态隐藏按钮通过 style.display = 'none' 实现，所以需要将动态隐藏的按钮（即 item.hidden === true）的按钮不用 filter 掉
  const normalBtnList = (data.btnList || [])
    .filter((item) => !(getWhatToDoWithoutPermission(item.permission) === 'hide'))
    .reduce(
      (pre, item) => {
        // 非运行时或者没有设置最大显示数量时，全量展示
        if (!(env.runtime && data.useEllipses && data.maxShowNumber)) {
          pre.btnList.push(item);
          return pre;
        }

        // 非隐藏按钮的数量小于最大显示数量时，将按钮添加到展示列表中
        if (pre.btnCount < data.maxShowNumber) pre.btnList?.push?.(item);

        if (!item?.hidden) pre.btnCount++;

        return pre;
      },
      {
        btnList: [] as BtnItem[],
        // 非隐藏按钮的数量
        btnCount: 0
      }
    ).btnList;

  const ellipsisBtnList = (data.btnList || [])
    .filter(
      (item) =>
        !(getWhatToDoWithoutPermission(item.permission) === 'hide' || (item?.hidden && env.runtime))
    )
    .filter((item, idx) =>
      env.runtime && data.useEllipses && data.maxShowNumber ? idx >= data.maxShowNumber : false
    );

  return (
    <div
      ref={wrapperRef}
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
