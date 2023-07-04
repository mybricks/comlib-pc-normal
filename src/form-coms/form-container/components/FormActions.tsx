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
  const { actions, layout, formItemColumn, config } = props.data;

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

  return (
    <Space wrap data-form-actions>
      {actions.items.map((item) => {
        if (typeof item.visible !== 'undefined' && !item.visible) {
          return null;
        }

        return (
          <Button
            data-form-actions-item={item.key}
            type={item.type}
            loading={item.loading}
            key={item.key}
            danger={item?.danger}
            onClick={() => onClick(item)}
            // disabled={config.disabled}
          >
            {item.title}
          </Button>
        );
      })}
    </Space>
  );
};

export default FormActions;
