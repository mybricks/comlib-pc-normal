import React, { useMemo } from 'react';
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

  const actionFlexBasis =
    data.actions.widthOption === 'px'
      ? `${data.actions.width}px`
      : `${(data.actions.span * 100) / 24}%`;

  return (
    <>
      {children}
      {data.actions.visible && (
        <Col
          data-form-actions
          flex={`0 0 ${actionFlexBasis}`}
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
