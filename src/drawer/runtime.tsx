import React, { useCallback, useEffect, useState } from 'react';
import { Button, Drawer } from 'antd';
import classnames from 'classnames';
import { Data, InputIds, SlotIds, Location, OutputIds } from './constants';
import * as Icons from '@ant-design/icons';
import css from './runtime.less';

export default function ({
  style,
  env,
  data,
  slots,
  inputs,
  outputs,
  createPortal
}: RuntimeParams<Data>) {
  const [visible, setVisible] = useState(style.display !== 'none');
  const { edit, runtime } = env;
  const debug = !!(runtime && runtime.debug);
  const {
    title,
    position,
    showMask,
    width,
    height,
    closable,
    useFooter,
    footerAlign,
    bodyStyle,
    maskClosable,
    destroyOnClose
  } = data;

  const onClose = useCallback(() => {
    setVisible(false);
    // onFooterBtnClick(OutputIds.Cancel);
  }, []);

  const registerOutputsEvent = useCallback((id: string, relOutputs: any, isConnected: boolean) => {
    slots[SlotIds.Content].outputs[id]((val) => {
      isConnected && setVisible(false);
      relOutputs[id](val);
    });
  }, []);

  useEffect(() => {
    if (runtime) {
      inputs[InputIds.Close](() => {
        onClose();
      });
      inputs[InputIds.Open]((val: any, relOutputs: any) => {
        setVisible(true);
        slots[SlotIds.Content].inputs[SlotIds.DataSource](val);
        data.footerBtns.forEach(({ id, isConnected }) => {
          registerOutputsEvent(id, relOutputs, isConnected);
        });
      });
      inputs[InputIds.SetTitle]((val) => {
        data.title = val;
      });
    }
  }, []);

  const onFooterBtnClick = useCallback((id, isConnected?: boolean) => {
    outputs[`${id}Click`]?.();
    !isConnected && setVisible(false);
  }, []);

  const footer = useFooter
    ? data.footerBtns.map((item: any) => {
        const { title, id, showText, icon, useIcon, location, isConnected, outputDs, ...res } =
          item;
        const Icon = useIcon && Icons && Icons[icon as string]?.render();

        return (
          <Button
            {...res}
            onClick={() => onFooterBtnClick(id, isConnected)}
            data-btn-id={id}
            key={id}
            className={css['footer-btns']}
          >
            {useIcon && location !== Location.BACK && Icon}
            {showText && env.i18n(title)}
            {useIcon && location === Location.BACK && Icon}
          </Button>
        );
      })
    : null;

  const children = slots[SlotIds.Content].render();

  if (edit || debug) {
    return createPortal(
      <Drawer
        className={classnames(debug && !visible && css.hide)}
        closable={closable}
        maskClosable={maskClosable}
        mask={showMask}
        title={env.i18n(title)}
        placement={position}
        visible={edit ? true : visible}
        onClose={onClose}
        width={width}
        height={height}
        bodyStyle={bodyStyle}
        footerStyle={{
          display: 'flex',
          justifyContent: footerAlign
        }}
        footer={footer}
        getContainer={false}
        destroyOnClose={destroyOnClose}
      >
        {children}
      </Drawer>
    );
  }

  return (
    <Drawer
      maskClosable={maskClosable}
      mask={showMask}
      title={env.i18n(title)}
      placement={position}
      visible={visible}
      onClose={onClose}
      width={width}
      height={height}
      bodyStyle={bodyStyle}
      footerStyle={{
        display: 'flex',
        justifyContent: footerAlign
      }}
      footer={footer}
      destroyOnClose={destroyOnClose}
    >
      {children}
    </Drawer>
  );
}
