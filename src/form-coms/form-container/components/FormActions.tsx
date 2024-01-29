import React, { useCallback, useMemo } from 'react';
import { Form, Button, Row, Col, Space } from 'antd';
import { Data, Action, LocationEnum } from '../types';
import * as Icons from '@ant-design/icons';
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

  const renderTextAndIcon = useCallback(
    (item: Action) => {
      const { useIcon, icon, iconLocation, iconDistance, title } = item;

      const btnItemR = ({ icon }: { icon: any }) => {
        const Icon = Icons && Icons[icon as string]?.render();
        if (typeof Icon === 'undefined') {
          return <div dangerouslySetInnerHTML={{ __html: icon }} />;
        } else {
          return <>{Icon}</>;
        }
      };

      return (
        <Space size={iconDistance}>
          {useIcon && btnItemR({ icon: icon }) && iconLocation === LocationEnum.FRONT ? (
            <span className={`icon ${style.icon}`}>{btnItemR({ icon: icon })}</span>
          ) : null}
          <span>{title}</span>
          {useIcon && btnItemR({ icon: icon }) && iconLocation === LocationEnum.BACK ? (
            <span className={`icon ${style.icon}`}>{btnItemR({ icon: icon })}</span>
          ) : null}
        </Space>
      );
    },
    [actions]
  );

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
            {renderTextAndIcon({ ...item, title: env.i18n(item.title) })}
          </Button>
        );
      })}
    </Space>
  );
};

export default FormActions;
