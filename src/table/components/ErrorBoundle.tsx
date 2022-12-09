import React from 'react';
import css from './style.less';

interface Props {
  errorTip?: string;
  children?: any;
}
export default class ErrorBoundary extends React.PureComponent<Props> {
  state = {
    hasError: false,
    error: null,
    errorInfo: null
  };
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error: error?.stack || error?.message || error?.toString?.()
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
    this.setState({
      error: error?.stack || error?.message || error?.toString?.(),
      errorInfo: errorInfo?.stack || errorInfo?.message || errorInfo?.toString?.()
    });
  }

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, errorTip } = this.props;
    if (!hasError) {
      return children;
    }
    return (
      <div className={css.error}>
        <div>{errorTip || `渲染错误`}</div>
        <div>{error || errorInfo}</div>
      </div>
    );
  }
}
