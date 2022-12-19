import React from 'react';
import { Data } from '../types';
import { Form, Button, Row, Col, Space } from 'antd';
import styles from '../styles.less';
import { unitConversion } from '../../../utils';

interface InlineLayoutProps {
  data: Data;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

const InlineLayout = (props: InlineLayoutProps) => {
  const { children, actions, data } = props;
  const { align, widthOption, width, span, inlinePadding } = data.actions;

  const actionStyle: React.CSSProperties = {
    textAlign: align,
    padding: inlinePadding?.map(String).map(unitConversion).join(' ')
  };
  const actionFlexBasis = widthOption === 'px' ? `${width}px` : `${(span * 100) / 24}%`;

  return (
    <div className={styles.slotInlineWrapper}>
      {children}
      {data.actions.visible && (
        <Col data-form-actions flex={`0 0 ${actionFlexBasis}`} style={actionStyle}>
          <Form.Item style={{ marginRight: 0 }}>{actions}</Form.Item>
        </Col>
      )}
    </div>
  );
};

export default InlineLayout;
