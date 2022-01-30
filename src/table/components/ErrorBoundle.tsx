import React from 'react';

interface Props {
  errorTip?: string;
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
      error
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    const { hasError } = this.state;
    const { children, errorTip } = this.props;
    if (!hasError) {
      return children;
    }
    return <div style={{ color: 'red' }}>{errorTip || `渲染错误`}</div>;
  }
}
