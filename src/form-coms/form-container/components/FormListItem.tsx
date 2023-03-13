import React, { useMemo } from 'react';
import { Form, Button, Row, Col } from 'antd';

const FormListItem = ({ content, slots, env, isFormItem, data }) => {
  if (env.edit) {
    return content();
  }

  return (
    <Form.List name="item4">
      {(fields, { add, remove }) => {
        data.fieldsLength = fields.length;

        return (
          <>
            {fields.map((field, index) => {
              return <div key={field.key}>{content({ field })}</div>;
            })}
            {isFormItem ? (
              <Button
                onClick={() => {
                  add();
                }}
              >
                添加
              </Button>
            ) : (
              <Row style={{ flex: '1 1 100%' }} data-form-actions>
                <Col offset={8}>
                  <Form.Item>
                    <Button
                      onClick={() => {
                        add();
                      }}
                    >
                      添加
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            )}
          </>
        );
      }}
    </Form.List>
  );
};

export default FormListItem;
