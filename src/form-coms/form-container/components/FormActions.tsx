import React, { useMemo } from 'react';
import { Form, Button, Row, Col, Space } from 'antd';
import { Data } from '../types';
import { outputIds } from '../constants';

interface Props {
  data: Data;
  submit: (outputId: string, outputRels?: any) => void;
  outputs: any;
}

const FormActions = (props: Props) => {
  const { actions, layout } = props.data;

  const onClick = (item) => {
    if (item.outputId === outputIds.ON_CLICK_SUBMIT) {
      props.submit(item.outputId);
    } else {
      props.outputs[item.outputId]();
    }
  };
  // const actionsLayout = useMemo(() => {
  //   const isVertical = layout === 'vertical'
  //   const isInline = layout === 'inline'

  //   return {
  //     offset: isVertical ? 0 : 8,
  //     wrapperStyle: isInline ? {
  //       flex: '1 1 100%'
  //     } : undefined
  //   }
  // }, [layout])

  if (!actions.visible) {
    return null;
  }

  return (
    // <Form.Item data-form-actions>
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
    // </Form.Item>
    // <Row style={{  flex: '1 1 100%' }} data-form-actions>
    //   <Col offset={actionsLayout.offset}>
    //     <Form.Item>
    //       <Space>
    //         {actions.items.map((item) => {
    //           if (typeof item.visible !== 'undefined' && !item.visible) {
    //             return null;
    //           }

    //           return (
    //             <Button
    //               type={item.type}
    //               loading={item.loading}
    //               key={item.key}
    //               onClick={() => onClick(item)}
    //               data-form-actions-item={item.key}
    //             >
    //               {item.title}
    //             </Button>
    //           );
    //         })}
    //       </Space>
    //     </Form.Item>
    //   </Col>
    // </Row>
  );
};

export default FormActions;
