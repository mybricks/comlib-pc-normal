import React, { useMemo } from 'react';
import { Form, Button, Row, Col, Space } from 'antd';
import { Data } from '../types';
import { outputIds } from '../constants';
import style from './formActions.less';

interface Props {
  data: Data;
  env: any;
  submit: (outputId: string, outputRels?: any) => void;
  outputs: any;
  isMobile: boolean;
}

const FormActions = (props: Props) => {
  const { env } = props;
  const { actions, layout, formItemColumn, config } = props.data;

  const onClick = (item) => {
    if (props.env?.edit) return;
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
    <Space wrap data-form-actions className={props.isMobile ? style.wrapper : ''}>
      {actions.items.map((item) => {
        if (props.env?.runtime && item.permission?.id) {
          if (!props.env.hasPermission(item.permission?.id)) {
            return null;
          }
        }

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
            disabled={item.disabled || config.disabled}
          >
            {env.i18n(item.title)}
          </Button>
        );
      })}
    </Space>
  );
};

export default FormActions;
