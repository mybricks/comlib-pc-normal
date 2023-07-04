import React, { useCallback, useMemo } from 'react';
import { Form, Button, Row, Col, Space } from 'antd';
import { Data } from '../types';
import { getLabelCol } from '../utils';

interface HorizontalLayoutProps {
  data: Data;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

const HorizontalLayout = (props: HorizontalLayoutProps) => {
  const { children, actions, data } = props;

  // const actionFlexBasis =
  //   data.actions.widthOption === 'px'
  //     ? `${data.actions.width}px`
  //     : `${(data.actions.span * 100) / 24}%`;
  const { widthOption, width, span } = data.actions;

  const getFlexValue = useCallback(() => {
    if (widthOption === 'px') {
      return `0 0 ${width || 0}px`;
    } else if (widthOption === 'flexFull') {
      return 1;
    }

    return `0 0 ${(span * 100) / 24}%`;
  }, [widthOption, width, span]);

  return (
    <>
      {children}
      {data.actions.visible && (
        <Col
          flex={getFlexValue()}
          style={{
            textAlign: data.actions.align
          }}
        >
          <Form.Item label=" " colon={false}>
            {actions}
          </Form.Item>
        </Col>
      )}
    </>
  );
};

export default HorizontalLayout;
