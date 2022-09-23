import React from 'react';
import { Form, Button, Row, Col, Space } from 'antd';
import { Data } from '../types';

interface VerticalLayoutProps {
  data: Data;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

const VerticalLayout = (props: VerticalLayoutProps) => {
  const { children, actions, data } = props;

  return (
    <>
      {children}
      {data.actions.visible && (
        <Col data-form-actions flex={`0 0 ${100 / data.formItemColumn}%`}>
          <Form.Item label=" " colon={false}>
            {actions}
          </Form.Item>
        </Col>
      )}
    </>
  );
};

export default VerticalLayout;
