import React, { useCallback, useMemo } from 'react';
import { Form, Button, Row, Col, Space, FormListOperation, FormListFieldData } from 'antd';
import { Action, Data } from '../types';
import { unitConversion } from '../../../utils';
import { changeValue } from '../utils';
import { InputIds } from '../../../form-coms/types';

export interface FormListActionsProps {
  operation?: FormListOperation;
  field: FormListFieldData;
  fieldIndex: number;
  hiddenRemoveButton?: boolean;
  childrenStore?: any;
}

export const addField = ({ data, isInit }: { data: Data; isInit?: boolean }) => {
  const { fields } = data;
  data.MaxKey = data.MaxKey + 1;
  fields.push({
    name: fields.length,
    key: data.MaxKey
  });
  if (isInit) data.currentAction = 'add';
};

const removeField = (props: RuntimeParams<Data> & FormListActionsProps) => {
  const { data, id, outputs, parentSlot, field, childrenStore } = props;
  const { fields } = data;

  fields.splice(field.name, 1);
  data.value?.splice(field.name, 1);
  // 更新name
  fields.forEach((field, index) => {
    if (field.name !== index) {
      data.fields[index] = {
        ...field,
        name: index
      };
    }
  });
  childrenStore[field.key] = undefined;
  data.currentAction = InputIds.SetInitialValue;
  data.startIndex = field.name;

  changeValue({ data, id, outputs, parentSlot, name: props.name });
};

const Actions = (props: RuntimeParams<Data> & FormListActionsProps) => {
  const { data, env, field, outputs, fieldIndex, hiddenRemoveButton } = props;

  const onClick = (item: Action) => {
    if (env.edit) return;
    if (item.key === 'add') {
      addField({ data, isInit: true });
      outputs[item.key] &&
        outputs[item.key]({
          nextIndex: data.fields.length - 1,
          nextKey: data.MaxKey
        });
      return;
    }
    outputs[item.key] &&
      outputs[item.key]({
        index: fieldIndex,
        key: field.key,
        value: data.value?.[fieldIndex]
      });
    if (item.key === 'remove' && field) {
      removeField(props);
    }
  };

  const notLastField = typeof fieldIndex === 'number' && !(fieldIndex === data.fields.length - 1);

  return (
    <Space wrap>
      {data.actions.items.map((item) => {
        if (!env.edit) {
          if (item.visible === false) {
            return null;
          }
          if (item.key === 'add' && notLastField && data.fields.length !== 0) {
            return null;
          }
          if (item.key === 'remove' && hiddenRemoveButton) {
            return null;
          }
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
  const { data } = props;
  const { align, widthOption, width, span, inlinePadding = [] } = data.actions;
  const padding = [...inlinePadding];

  // const isLastField = fieldIndex === data.fields.length - 1;
  // if (isLastField) padding[2] = 0;

  const actionStyle: React.CSSProperties = {
    textAlign: align,
    padding: padding.map(String).map(unitConversion).join(' ')
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

  if (data.actions.visible) {
    return (
      <Col data-form-actions flex={getFlexValue()} style={actionStyle}>
        <Form.Item {...formItemProps} style={{ margin: 0 }}>
          <Actions {...props} />
        </Form.Item>
      </Col>
    );
  }
  return null;
};
export { Actions, ActionsWrapper };
