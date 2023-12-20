import React, { useMemo, useState } from 'react';
import * as antd from 'antd';
import * as icons from '@ant-design/icons';
import ErrorBoundary from '../components/ErrorBoundary';
import { Data } from './types';
import { createElement } from './transform';

const ErrorStatus = ({ children = null }: { children?: any }) => (
  <div style={{ color: 'red' }}>
    自定义渲染错误
    <br />
    {children}
  </div>
);

const Component = ({ code, scope }: { code: string; scope: Record<string, any> }) => {
  const ReactNode = useMemo(() => {
    try {
      return createElement(code);
    } catch (error) {
      return error?.toString();
    }
  }, [code, scope]);
  return (
    <ErrorBoundary key={code} fallback={<ErrorStatus />}>
      {typeof ReactNode === 'function' ? (
        <ReactNode {...scope} />
      ) : (
        <ErrorStatus>{ReactNode}</ErrorStatus>
      )}
    </ErrorBoundary>
  );
};

export default ({ data, inputs, env, outputs, logger }: RuntimeParams<Data>) => {
  const { componentCode } = data;
  let staticProps = {};
  try {
    staticProps = JSON.parse(decodeURIComponent(data.props ?? '{}'));
  } catch (error) {
    logger.error('【自定义渲染】Mock数据格式错误');
  }
  const [props, setProps] = useState();
  inputs.props((props) => {
    setProps(props);
  });
  return (
    <Component
      code={decodeURIComponent(componentCode)}
      scope={{ props: props ?? staticProps, inject: { React, antd, icons }, events: outputs }}
    />
  );
};
