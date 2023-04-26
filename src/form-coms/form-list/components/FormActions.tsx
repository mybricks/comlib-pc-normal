import React, { useCallback, useMemo } from 'react';
import { Form, Button, Row, Col, Space, FormListOperation, FormListFieldData } from 'antd';
import { Action, Data } from '../types';
import { unitConversion } from '../../../utils';
import { changeValue } from '../utils';

export interface FormListActionsProps {
  operation?: FormListOperation;
  field?: FormListFieldData;
  fieldIndex?: number;
  hiddenRemoveButton?: boolean;
  childrenStore?: any;
}

const Actions = (props: RuntimeParams<Data> & FormListActionsProps) => {
  const { data, id, outputs, parentSlot, field, fieldIndex, hiddenRemoveButton, childrenStore } =
    props;
  const { fields } = data;

  const onClick = (item: Action) => {
    if (item.key === 'add') {
      data.MaxKey = data.MaxKey + 1;
      fields.push({
        name: fields.length,
        key: data.MaxKey
      });
      if (Array.isArray(data.value)) {
        data.value.push(data.initialValues);
      } else {
        data.value = [data.initialValues];
      }
      changeValue({ data, id, outputs, parentSlot });
    }
    if (item.key === 'remove' && field) {
      fields.splice(field.name, 1);
      // 更新name
      fields.forEach((field, index) => {
        field && (field.name = index);
      });
      childrenStore[field.key] = undefined;

      data.value?.[field.name] && data.value.splice(field.name, 1);
      changeValue({ data, id, outputs, parentSlot });
    }
  };

  const hiddenAddButton =
    typeof fieldIndex === 'number' && !(fieldIndex === data.fields.length - 1);

  return (
    <Space wrap>
      {data.actions.items.map((item) => {
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
            disabled={data.disabled}
          >
            {item.title}
          </Button>
        );
      })}
    </Space>
  );
};

const ActionsWrapper = (props: RuntimeParams<Data> & FormListActionsProps) => {
  const { actions } = props.data;
  const { align, widthOption, width, span, inlinePadding } = actions;
  const actionStyle: React.CSSProperties = {
    textAlign: align,
    padding: inlinePadding?.map(String).map(unitConversion).join(' ')
  };
  const getFlexValue = useCallback(() => {
    if (widthOption === 'px') {
      return `0 0 ${width || 0}px`;
    } else if (widthOption === 'flexFull') {
      return 1;
    }

    return `0 0 ${(span * 100) / 24}%`;
  }, [widthOption, width, span]);

  const formItemProps = {
    label: '',
    colon: false
  };

  if (actions.visible) {
    return (
      <Col data-form-actions flex={getFlexValue()} style={actionStyle}>
        <Form.Item {...formItemProps}>
          <Actions {...props} />
        </Form.Item>
      </Col>
    );
  }
  return null;
};
export { Actions, ActionsWrapper };
