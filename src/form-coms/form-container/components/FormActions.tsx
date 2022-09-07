import React from 'react';
import { Form, Button, Row, Col, Space } from 'antd';
import { Data } from '../types';

interface Props {
  data: Data;
  submit: (outputId: string, outputRels?: any) => void;
  outputs: any;
}

const FormActions = (props: Props) => {
  const { actions } = props.data;

  const onClick = (item) => {
    if (item.outputId === 'onClickSubmit') {
      props.submit(item.outputId);
    } else {
      props.outputs[item.outputId]();
    }
  };

  return (
    <Row style={{ flex: '1 1 100%' }} data-form-actions>
      <Col offset={8}>
        <Form.Item>
          <Space>
            {actions.items.map((item) => {
              if (typeof item.visible !== 'undefined' && !item.visible) {
                return null;
              }

              return (
                <Button
                  type={item.type}
                  loading={item.loading}
                  key={item.key}
                  onClick={() => onClick(item)}
                  data-form-actions-item={item.key}
                >
                  {item.title}
                </Button>
              );
            })}
          </Space>
        </Form.Item>
      </Col>
    </Row>
  );
};

export default FormActions;
