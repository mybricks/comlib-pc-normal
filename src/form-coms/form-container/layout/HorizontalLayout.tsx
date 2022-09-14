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
  console.log('HorizontalLayout 渲染', props.data.labelWidth, getLabelCol(data));
  const marginLeft = props.data.labelWidth;

  return (
    <>
      {children}
      <div data-form-actions>
        <Form.Item
          style={{
            marginLeft: marginLeft
          }}
          wrapperCol={getLabelCol(data)}
        >
          {actions}
        </Form.Item>
      </div>
      {/* <Col flex={getLabelCol(data)?.flex} span={getLabelCol(data)?.span} >
        {actions}
      </Col> */}
    </>
  );
};

export default HorizontalLayout;
