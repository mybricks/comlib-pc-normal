import React from 'react';

interface Props {
  fallback: React.ReactNode;
}
export default class ErrorBoundary extends React.PureComponent<Props> {
  state = {
    hasError: false,
    error: null,
    errorInfo: null
  };
  constructor(props) {
    super(props);
  }
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
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
