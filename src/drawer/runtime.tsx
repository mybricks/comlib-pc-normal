import React, { useEffect, useState } from 'react';
import { Drawer } from 'antd';
import classnames from 'classnames';
import { Data, InputIds, OutputIds, SlotIds } from './constants';
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
    useFooter,
    footerAlign,
    bodyStyle,
    maskClosable,
    destroyOnClose
  } = data;

  const onClose = () => {
    setVisible((oldVal) => {
      // 防止死循环
      if (oldVal === true) {
        outputs[OutputIds.Cancel](data.inputData);
      }
      return false;
    });
  };
  const getFlexPostion = () => {
    switch (footerAlign) {
      case 'right':
        return 'flex-end';
      case 'center':
        return 'center';
      default:
        return 'flex-start';
    }
  };
  const flexP = getFlexPostion();

  useEffect(() => {
    if (runtime) {
      inputs[InputIds.Close](() => {
        onClose();
      });

      inputs[InputIds.Open](() => {
        setVisible(true);
      });

      inputs[InputIds.SetTitle]((val) => {
        data.title = val;
      });

      inputs[InputIds.SetInputData]((val) => {
        data.inputData = val;
      });
    }
  }, []);

  const footer = useFooter && slots[SlotIds.Footer] && (
    <div>{slots && slots[SlotIds.Footer].render()}</div>
  );
  const children = slots[SlotIds.Content]?.render();
  if (edit || debug) {
    return createPortal(
      <Drawer
        className={classnames(debug && !visible && css.hide)}
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
          justifyContent: flexP
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
        justifyContent: flexP
      }}
      footer={footer}
      destroyOnClose={destroyOnClose}
    >
      {children}
    </Drawer>
  );
}
