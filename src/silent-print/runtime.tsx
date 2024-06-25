import React, { useEffect, useRef } from 'react';
import { message } from 'antd';
import { Data, InputIds, SlotIds } from './constants';
import { useReactToPrint } from 'react-to-print';
import './index.less';

export default function MyComponent({
  data,
  env,
  _env,
  inputs,
  outputs,
  slots
}: RuntimeParams<Data>) {
  const { runtime } = env;
  const { documentTitle, contentSlotStyle, waitRenderTime } = data;
  const componentRef = useRef(null);

  const handlePrint = () => {
    outputs.afterPrint();
    _env.currentScenes.close();
  };

  const handlePrintAction = useReactToPrint({
    documentTitle,
    copyStyles: true,
    removeAfterPrint: true,
    content: () => componentRef.current,
    onAfterPrint: handlePrint
  });

  console.log(`waitRenderTime JD==> `, waitRenderTime);
  useEffect(() => {
    inputs[InputIds.StartPrint](() => {
      if (!runtime.debug) {
        setTimeout(() => {
          handlePrintAction();
        }, waitRenderTime || 2000);
      } else message.warn('请预览查看效果，调试不支持打印预览');
    });
  }, [runtime.debug, inputs, handlePrintAction, waitRenderTime]);

  const wrapperStyle: React.CSSProperties = { position: 'fixed', width: '100%', height: '100%' };
  if (!runtime) {
    wrapperStyle.top = '0';
    wrapperStyle.left = '0';
  } else {
    wrapperStyle.top = '-9999px';
    wrapperStyle.left = '-9999px';
  }

  return (
    <div style={wrapperStyle}>
      <div ref={componentRef} style={{ width: '100%', height: '100%' }}>
        {slots?.[SlotIds.CONTENT]?.render({ style: contentSlotStyle || {} })}
      </div>
    </div>
  );
}
