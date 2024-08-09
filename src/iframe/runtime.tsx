import React, { useEffect, useRef, useState } from 'react';
import { Result, Spin } from 'antd';
import { Data, InputIds } from './constants';
import axios from 'axios';
import css from './runtime.less';

function getErrorMessage(url: string) {
  let currentDomain = window.location.hostname;
  let currentProtocol = window.location.protocol;
  let iframeProtocol;
  try {
    const iframeUrl = new URL(url);
    iframeProtocol = iframeUrl.protocol;
  } catch (error) {
    console.log('无法解析 iframe 的 src');
  }
  if (iframeProtocol) {
    if (iframeProtocol !== currentProtocol && currentProtocol === 'https:') {
      return `Mixed Content: The page at '${currentProtocol}//${currentDomain}' was loaded over HTTPS, but requested an insecure frame ${url}'. This request has been blocked; the content must be served over HTTPS.`;
    }
  }
  return '';
}

export default function ({ env, data, inputs }: RuntimeParams<Data>) {
  const { runtime } = env;
  const iframeRef = useRef<HTMLIFrameElement>();
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    if (runtime) {
      inputs[InputIds.SetUrl]((url: string, outputRels: { setUrlDone: (val: string) => void }) => {
        if (typeof url === 'string') {
          data.url = url;
          if (data.useSrcDoc && iframeRef.current?.contentWindow?.document?.write) {
            iframeRef.current.contentWindow.document.write(data.url);
          }
          if (outputRels['setUrlDone']) {
            outputRels['setUrlDone'](url);
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    if (env.runtime) {
      let message = getErrorMessage(data.url);
      setErrorMessage(message);
    }
  }, [data.url, env.runtime]);

  if (!data.url) {
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <Result status="info" title="暂无链接" />
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
              width="100%"
              height="100%"
              id={data.id}
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
        width="100%"
        height="100%"
        id={data.id}
      />
    );
  }
  if (env.edit)
    return (
      <div className={css.wrapper}>
        <Spin {...spinConfig}>
          <iframe
            src={data.url}
            id={data.id}
            style={{ border: 'none' }}
            width="100%"
            height="100%"
          />
        </Spin>
      </div>
    );
  if (errorMessage) {
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          padding: '24px',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <span className={css.errorMessage}>{errorMessage}</span>
      </div>
    );
  }
  return (
    <iframe
      src={data.url}
      id={data.id}
      style={{ border: 'none' }}
      width="100%"
      height="100%"
      onErrorCapture={(e) => console.log('capture', e)}
    />
  );
}
