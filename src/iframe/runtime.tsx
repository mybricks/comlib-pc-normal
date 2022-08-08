import React, { useEffect, useRef } from 'react';
import { Result } from 'antd';
import { Data, InputIds } from './constants';

export default function ({ env, data, inputs }: RuntimeParams<Data>) {
  const { runtime } = env;
  const iframeRef = useRef<HTMLIFrameElement>();

  useEffect(() => {
    if (runtime) {
      inputs[InputIds.SetUrl]((url: string) => {
        if (typeof url === 'string') {
          data.url = url;
          if (
            data.useSrcDoc &&
            iframeRef.current?.contentWindow?.document?.write
          ) {
            iframeRef.current.contentWindow.document.write(data.url);
          }
        }
      });
    }
  }, []);

  if (!data.url) {
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <Result status="info" title="暂无链接" />
      </div>
    );
  }

  if (data.useSrcDoc) {
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
        width="100%"
        height="100%"
      />
    );
  }
  return (
    <iframe
      src={data.url}
      style={{ border: 'none' }}
      width="100%"
      height="100%"
    />
  );
}
