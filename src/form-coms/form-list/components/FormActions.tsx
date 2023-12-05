import React, { useCallback, useMemo } from 'react';
import { Form, Button, Image, Col, Space, FormListOperation, FormListFieldData } from 'antd';
import * as Icons from '@ant-design/icons';
import { ExpressionSandbox } from '../../../../package/com-utils';
import { Action, Data, LocationEnum } from '../types';
import { deepCopy, unitConversion } from '../../../utils';
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
export const addField = ({ data }: { data: Data }, options?) => {
  const { index = -1, value } = options || {};
  const { fields } = data;
  data.MaxKey = data.MaxKey + 1;
  const fieldName = index >= 0 ? index : fields.length;
  const newField = {
    name: fieldName,
    key: data.MaxKey
  };

  data.userAction.type = 'add';
  data.userAction.value = deepCopy(value);
  data.userAction.index = fieldName;
  data.userAction.key = data.MaxKey;

  if (index < 0) {
    data.fields.push(newField);
  } else {
    const newFields: FormListFieldData[] = [];
    new Array(fields.length + 1).fill(null).forEach((_, inx) => {
      let newF = fields[inx > fieldName && inx > 0 ? inx - 1 : inx];
      if (inx === fieldName) {
        newF = newField;
      }
      if (inx > fieldName) {
        newF.name = newF.name + 1;
      }
      newFields.push(newF);
    });
    data.fields = newFields;
  }
};

/** 删除一行 */
export const removeField = (props: RuntimeParams<Data> & FormListActionsProps) => {
  const { data, id, outputs, parentSlot, field, childrenStore } = props;
  data.value?.splice(field.name, 1);
  // 删除当前field，更新name
  data.fields = data.fields
    .filter((i) => i.key !== field.key)
    .map((i, index) => {
      return {
        ...i,
        name: index
      };
    });
  childrenStore[field.key] = undefined;
  // data.userAction.type = InputIds.SetInitialValue;
  // data.userAction.startIndex = field.name;

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

/**
 * 计算操作权限
 * @param btn 按钮
 */
const getBtnPermission = (env, key?: string): 'none' | 'hide' | 'disable' => {
  const hasPermission = !(env.runtime && key && !env?.hasPermission(key));
  if (hasPermission) return 'none';

  // TODO: 等后续「无权限时」字段开放后，将返回值按类型返回
  return 'hide';
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
        const permission = getBtnPermission(env, item.permission?.id);

        if (item.visible === false) {
          return null;
        }
        if (!env.edit) {
          if (permission === 'hide') {
            return null;
          }
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
          <Button
            data-form-actions-item={item.key}
            {...res}
            disabled={data.disabled}
            onClick={() => onClick(item)}
          >
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
