import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Drawer } from 'antd';
import { Data, InputIds, SlotIds, Location, OutputIds } from './constants';
import * as Icons from '@ant-design/icons';
import css from './runtime.less';

export default function ({ style, env, data, slots, inputs, outputs }: RuntimeParams<Data>) {
  const ref = useRef<any>();
  const { edit, runtime } = env;
  const [visible, setVisible] = useState(!!edit);
  const debug = !!(runtime && runtime.debug);
  const {
    title,
    position,
    showMask,
    width,
    height,
    useFooter,
    footerAlign,
    bodyStyle,
    maskClosable,
    destroyOnClose
  } = data;

  const onClose = useCallback(() => {
    setVisible(false);
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
        style.display = 'block';
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
        const { title, id, showText, icon, useIcon, location, isConnected, ...res } = item;
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
    return (
      <div className={css.container} ref={ref}>
        <Drawer
          // className={classnames(debug && !visible && css.hide)}
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
          afterVisibleChange={(visible) => {
            if (!visible) {
              style.display = 'none';
            }
          }}
        >
          {children}
        </Drawer>
      </div>
    );
  }
  return (
    <div className={css.container} ref={ref}>
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
        getContainer={false}
        footer={footer}
        destroyOnClose={destroyOnClose}
        afterVisibleChange={(visible) => {
          console.log(visible, 'afterVisibleChange');
          if (!visible) {
            style.display = 'none';
          }
        }}
      >
        {children}
      </Drawer>
    </div>
  );
}
