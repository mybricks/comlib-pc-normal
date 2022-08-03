import { useComputed } from "@mybricks/rxui";
import React, { useEffect } from "react";
import css from './runtime.less';

export default function({ env, modalCtx, data, inputs, logger }) {
  useEffect(() => {
    inputs['dataSource']((val: string) => {
      modalCtx.editor?.setContent(val);
      modalCtx.content = val;
    });
    inputs['slotProps'](({ value }: any) => {
      if (value === void 0) return;
      if (typeof value !== 'string') {
        logger.error(`富文本数据源不是字符串`);
        return;
      }
      modalCtx.editor?.setContent(value);
      modalCtx.content = value;
    });
  }, [])

  const preiewContent = useComputed(() => {
    if (!modalCtx.content && !env.runtime) {
      return <div style={data.style}>外部动态输入内容</div>;
    }
   
    return (
      <div
        className={css['text-container']}
        dangerouslySetInnerHTML={{ __html: modalCtx.content || '' }}
        style={data.style}
      ></div>
    );
  });

  return preiewContent;
}