import React from 'react';
import { Data } from '../types';
import { Form, Col } from 'antd';
import styles from '../styles.less';
import { unitConversion } from '../../../utils';

interface InlineLayoutProps {
  data: Data;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  isEmpty: boolean;
}

const InlineLayout = (props: InlineLayoutProps) => {
  const { children, actions, data, isEmpty } = props;
  const { align, inlinePadding } = data.actions;

  const actionStyle: React.CSSProperties = {
    textAlign: align,
    padding: inlinePadding?.map(String).map(unitConversion).join(' ')
  };

  return (
    <div className={styles.slotInlineWrapper}>
      {children}
      {data.actions.visible && (
        <Col className={isEmpty ? styles.emptyHorActions : undefined} flex={1} style={actionStyle}>
          <Form.Item style={{ marginRight: 0 }}>{actions}</Form.Item>
        </Col>
      )}
    </div>
  );
};

export default InlineLayout;
