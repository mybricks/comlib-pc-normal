import React, { useMemo, useState } from 'react';
import * as antd from 'antd';
import * as icons from '@ant-design/icons';
import ErrorBoundary from '../components/ErrorBoundary';
import { Data } from './types';
import { createElement } from './transform';
import { DefaultCode } from './constants';

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
      const { node } = createElement(code, scope);
      return node;
    } catch (error) {
      return error?.toString();
    }
  }, [code, scope]);
  return (
    <ErrorBoundary key={code} fallback={<ErrorStatus />}>
      {React.isValidElement(ReactNode) ? ReactNode : <ErrorStatus>{ReactNode}</ErrorStatus>}
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
      code={decodeURIComponent(componentCode ?? DefaultCode)}
      scope={{ props: props ?? staticProps, context: { React, antd, icons, env }, events: outputs }}
    />
  );
};
