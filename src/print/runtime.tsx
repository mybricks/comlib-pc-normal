import React, { useEffect, useRef, useCallback } from 'react';
import { Modal, message } from 'antd';
import { Data, InputIds, SlotIds } from './constants';
import { useReactToPrint } from 'react-to-print';
import css from './index.less';

export default function MyComponent({
  data,
  env,
  _env,
  inputs,
  outputs,
  slots
}: RuntimeParams<Data>) {
  const { edit, runtime } = env;
  const { documentTitle, closeScene, closable, useFooter, width } = data;
  const componentRef = useRef(null);

  const handlePrint = useCallback(() => {
    if (closeScene) {
      _env.currentScenes.close();
    }
    outputs.afterPrint();
  }, [closeScene, _env, outputs]);

  const handlePrintAction = useReactToPrint({
    documentTitle,
    copyStyles: true,
    removeAfterPrint: true,
    content: () => componentRef.current,
    onAfterPrint: handlePrint
  });

  useEffect(() => {
    if (!runtime.debug) {
      inputs[InputIds.StartPrint](() => {
        handlePrintAction();
      });
    }
  }, [runtime.debug, inputs, handlePrintAction]);

  const handleClose = useCallback(() => {
    _env.currentScenes.close();
  }, []);

  const popupContent = (
    <Modal
      visible={true}
      width={width}
      onCancel={handleClose}
      cancelText={'取消'}
      okText={'打印预览'}
      wrapClassName={css.container}
      onOk={
        env.runtime && env.runtime.debug
          ? () => {
              message.open({
                type: 'warning',
                content: '请预览查看效果，调试不支持打印预览'
              });
            }
          : handlePrintAction
      }
      mask={!env.edit}
      footer={!useFooter ? null : undefined}
      closable={closable}
      getContainer={!(edit || runtime.debug) ? () => env?.canvasElement || document.body : false}
    >
      {data.useTop && slots?.[SlotIds.TOPWORKSPACE] && (
        <div>{slots?.[SlotIds.TOPWORKSPACE].render()}</div>
      )}
      <div ref={componentRef}>{slots?.[SlotIds.CONTENT].render()}</div>
    </Modal>
  );

  const getContent = () => {
    if (runtime?.debug) {
      return (
        <div className={css.debugMask}>
          <div className={css.mask}>{popupContent}</div>
        </div>
      );
    } else if (env.edit) {
      return <div className={css.antdMask}>{popupContent}</div>;
    }
    return popupContent;
  };

  return getContent();
}
