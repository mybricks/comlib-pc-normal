import React, { useCallback, useMemo } from 'react';
import { Form, Button, Image, Col, Space, FormListOperation, FormListFieldData } from 'antd';
import * as Icons from '@ant-design/icons';
import { ExpressionSandbox } from '../../../../package/com-utils';
import { Action, Data, LocationEnum } from '../types';
import { unitConversion } from '../../../utils';
import { changeValue } from '../utils';
import { InputIds } from '../../../form-coms/types';
import css from '../styles.less';

export interface FormListActionsProps {
  operation?: FormListOperation;
  field: FormListFieldData;
  fieldIndex: number;
  hiddenRemoveButton?: boolean;
  childrenStore?: any;
}

/** 添加一行 */
export const addField = ({ data }: { data: Data }) => {
  const { fields } = data;
  data.MaxKey = data.MaxKey + 1;
  fields.push({
    name: fields.length,
    key: data.MaxKey
  });
};

/** 删除一行 */
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

/**
 * 计算操作动态显示表达式
 * @param btn 按钮
 * @param field 当前项数据
 * @param onError 错误回调函数
 */
const getDynamicDisplay = (btn: Action, field, extralParams, onError?): boolean => {
  let dynamicDisplay = true;

  if (btn.displayExpression) {
    const context = {
      ...field,
      ...extralParams
    };
    const sandbox: ExpressionSandbox = new ExpressionSandbox({ context, prefix: 'item' });
    try {
      dynamicDisplay = sandbox.executeWithTemplate(btn.displayExpression);
    } catch (error: any) {
      onError?.(`动态表单项[${btn.title}]: ${error}`);
    }
  }
  return dynamicDisplay;
};

const Actions = (props: RuntimeParams<Data> & FormListActionsProps) => {
  const { data, env, field, outputs, fieldIndex } = props;

  const currentField = {
    index: fieldIndex,
    key: field.key,
    value: data.value?.[fieldIndex]
  };

  const onClick = (item: Action) => {
    if (env.edit) return;
    if (item.key === 'add') {
      addField({ data });
      data.currentAction = 'add';
      outputs[item.key] &&
        outputs[item.key]({
          nextIndex: data.fields.length - 1,
          nextKey: data.MaxKey
        });
      return;
    }
    outputs[item.key] && outputs[item.key](currentField);
    if (item.key === 'remove' && field) {
      removeField(props);
    }
  };

  const isLast =
    data.fields?.length === 0 ||
    (typeof fieldIndex === 'number' && fieldIndex === data.fields.length - 1);
  const listLength = data.fields.length;

  return (
    <Space wrap>
      {data.actions.items.map((item) => {
        const { iconConfig, ...res } = item;
        const icon = getBtnIcon(item);
        if (item.visible === false) {
          return null;
        }
        if (!env.edit) {
          const dynamicDisplay = getDynamicDisplay(
            item,
            currentField,
            { isLast, listLength },
            props.onError
          );
          if (dynamicDisplay === false) {
            return null;
          }
        }
        return (
          <Button data-form-actions-item={item.key} {...res} onClick={() => onClick(item)}>
            <Space size={iconConfig?.gutter || 8}>
              {iconConfig?.location === LocationEnum.FRONT ? icon : void 0}
              {env.i18n(item.title)}
              {iconConfig?.location === LocationEnum.BACK ? icon : void 0}
            </Space>
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

/**
 * 操作项图标渲染
 * @param btn 按钮数据
 * @param data 组件数据
 * @returns JSX
 */
const getBtnIcon = (btn: Action) => {
  const { src, size, gutter, innerIcon, customIcon } = btn.iconConfig || {};
  if (src === 'custom' && customIcon)
    return (
      <Image
        className={css.image}
        //width={size[1] || 14} height={size[0] || 14}
        src={customIcon}
        preview={false}
      />
    );
  if (src === 'inner') {
    return (
      Icons && (
        <span
        //style={{ fontSize: Math.max(...size) }}
        >
          {Icons[innerIcon || ('EditOutlined' as string)]?.render()}
        </span>
      )
    );
  }

  return void 0;
};
