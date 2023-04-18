import React, { useCallback, useMemo } from 'react';
import { Form, Button, Row, Col, Space, FormListOperation, FormListFieldData } from 'antd';
import { Action, Data } from '../types';
import { unitConversion } from '../../../utils';

export interface FormListActionsProps {
  data: Data;
  operation?: FormListOperation;
  field?: FormListFieldData;
  fieldIndex?: number;
  hiddenRemoveButton?: boolean;
}

export interface FormActionsWrapperProps {
  actionProps: FormListActionsProps;
  isHorizontalModel?: boolean;
  isInlineModel?: boolean;
}

const Actions = (props: FormListActionsProps) => {
  const { data, operation, field, fieldIndex, hiddenRemoveButton } = props;
  const { actions } = data;

  const onClick = (item: Action) => {
    if (item.key === 'add') {
      operation?.add();
    }
    if (item.key === 'remove') {
      field && operation?.remove(field.name);
    }
  };

  const hiddenAddButton =
    typeof fieldIndex === 'number' &&
    typeof data.fieldsLength === 'number' &&
    !(fieldIndex === data.fieldsLength - 1);

  return (
    <Space wrap>
      {actions.items.map((item) => {
        if (item.visible === false) {
          return null;
        }
        if (item.key === 'add' && hiddenAddButton) {
          return null;
        }
        if (item.key === 'remove' && hiddenRemoveButton) {
          return null;
        }
        return (
          <Button
            data-form-actions-item={item.key}
            type={item.type}
            loading={item.loading}
            key={item.key}
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

const ActionsWrapper = (props: FormActionsWrapperProps) => {
  const { isHorizontalModel, isInlineModel, actionProps } = props;
  const { data } = actionProps;
  const actions = data.actions;

  const { align, widthOption, width, span, inlinePadding } = actions;
  const actionStyle: React.CSSProperties = {
    textAlign: align,
    padding: isHorizontalModel ? void 0 : inlinePadding?.map(String).map(unitConversion).join(' ')
  };
  const getFlexValue = useCallback(() => {
    if (isInlineModel) return 1;
    if (widthOption === 'px') {
      return `0 0 ${width || 0}px`;
    } else if (widthOption === 'flexFull') {
      return 1;
    }

    return `0 0 ${(span * 100) / 24}%`;
  }, [widthOption, width, span]);

  const formItemProps = isInlineModel
    ? {
        style: { marginRight: 0 }
      }
    : {
        label: '',
        colon: false
      };

  if (actions.visible) {
    return (
      <Col data-form-actions flex={getFlexValue()} style={actionStyle}>
        <Form.Item {...formItemProps}>
          <Actions {...actionProps} />
        </Form.Item>
      </Col>
    );
  }
  return null;
};
export { Actions, ActionsWrapper };
