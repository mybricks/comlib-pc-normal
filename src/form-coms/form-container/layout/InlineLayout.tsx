import React from 'react';
import { Data } from '../types';
import { Form, Button, Row, Col, Space } from 'antd';
import styles from '../styles.less';

interface InlineLayoutProps {
  data: Data;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

const InlineLayout = (props: InlineLayoutProps) => {
  const { children, actions, data } = props;
  const flexBasis = `${(data.actions.span * 100) / 24}%`;

  return (
    <div className={styles.slotInlineWrapper}>
      {children}
      {data.actions.visible && (
        <Col
          data-form-actions
          flex={`0 0 ${flexBasis}`}
          style={{
            textAlign: data.actions.align
          }}
        >
          <Form.Item>{actions}</Form.Item>
        </Col>
      )}
    </div>
  );
};

export default InlineLayout;
