import React, { useEffect, useRef } from 'react';
import { Result, Spin } from 'antd';
import { Data, InputIds } from './constants';
import css from './runtime.less';

export default function ({ env, data, inputs }: RuntimeParams<Data>) {
  const { runtime } = env;
  const iframeRef = useRef<HTMLIFrameElement>();

  useEffect(() => {
    if (runtime) {
      inputs[InputIds.SetUrl]((url: string) => {
        if (typeof url === 'string') {
          data.url = url;
          if (data.useSrcDoc && iframeRef.current?.contentWindow?.document?.write) {
            iframeRef.current.contentWindow.document.write(data.url);
          }
        }
      });
    }
  }, []);

  if (!data.url) {
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <Result status='info' title='暂无链接' />
      </div>
    );
  }

  const spinConfig: any = {
    spinning: true,
    tip: '设计时不可操作',
    indicator: null
  };

  if (data.useSrcDoc) {
    if (env.edit)
      return (
        <div className={css.wrapper}>
          <Spin {...spinConfig}>
            <iframe
              ref={(node) => {
                if (node) {
                  iframeRef.current = node;
                }
                if (node?.contentWindow?.document?.write) {
                  node.contentWindow.document.write(data.url);
                }
              }}
              style={{ border: 'none' }}
              width='100%'
              height='100%'
            />
          </Spin>
        </div>
      );
    return (
      <iframe
        ref={(node) => {
          if (node) {
            iframeRef.current = node;
          }
          if (node?.contentWindow?.document?.write) {
            node.contentWindow.document.write(data.url);
          }
        }}
        style={{ border: 'none' }}
        width='100%'
        height='100%'
      />
    );
  }
  if (env.edit)
    return (
      <div className={css.wrapper}>
        <Spin {...spinConfig}>
          <iframe src={data.url} style={{ border: 'none' }} width='100%' height='100%' />
        </Spin>
      </div>
    );
  return <iframe src={data.url} style={{ border: 'none' }} width='100%' height='100%' />;
}
