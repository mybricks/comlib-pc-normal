import React from 'react';
import { Form, Col } from 'antd';
import { unitConversion } from '../../../utils';
import { Data } from '../types';

interface VerticalLayoutProps {
  data: Data;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

const VerticalLayout = (props: VerticalLayoutProps) => {
  const { children, actions, data } = props;
  const { align, widthOption, width, span, inlinePadding } = data.actions;

  const actionStyle: React.CSSProperties = {
    textAlign: align,
    padding: inlinePadding?.map(String).map(unitConversion).join(' ')
  };
  const actionFlexBasis = widthOption === 'px' ? `${width}px` : `${(span * 100) / 24}%`;

  return (
    <>
      {children}
      {data.actions.visible && (
        <Col data-form-actions flex={`0 0 ${actionFlexBasis}`} style={actionStyle}>
          <Form.Item label=" " colon={false}>
            {actions}
          </Form.Item>
        </Col>
      )}
    </>
  );
};

export default VerticalLayout;
