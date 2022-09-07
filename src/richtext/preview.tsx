import { useComputed } from "@mybricks/rxui";
import React, { useEffect } from "react";
import css from './runtime.less';

export default function({ env, modalCtx, data, inputs, logger }) {
  useEffect(() => {
    inputs['dataSource']((val: string) => {
      modalCtx.editor?.setContent(val);
      modalCtx.content = val;
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