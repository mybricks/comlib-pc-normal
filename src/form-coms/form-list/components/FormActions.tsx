import React, { useCallback, useMemo } from 'react';
import { Form, Button, Image, Col, Space, FormListOperation, FormListFieldData } from 'antd';
import * as Icons from '@ant-design/icons';
import isObject from 'lodash/isObject';
import { ExpressionSandbox } from '../../../../package/com-utils';
import { Action, Data, LocationEnum } from '../types';
import { deepCopy, unitConversion } from '../../../utils';
import { changeValue } from '../utils';
import { InputIds } from '../../../form-coms/types';
import css from '../styles.less';
import { getWhatToDoWithoutPermission } from '../../../utils/permission';

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
  data.userAction.startIndex = fieldName;
  data.userAction.key = data.MaxKey;

  if (index < 0) {
    data.fields.push(newField);
  } else {
    // 改变的fields字段名
    let changedFieldName: number[] = [];
    const newFields: FormListFieldData[] = [];
    new Array(fields.length + 1).fill(null).forEach((_, inx) => {
      let newF = fields[inx > fieldName && inx > 0 ? inx - 1 : inx];
      if (inx === fieldName) {
        newF = newField;
        changedFieldName.push(newF.name);
      }
      if (inx > fieldName) {
        changedFieldName.push(newF.name);
        newF.name = newF.name + 1;
      }
      // 往指定index位置插入
      newFields.splice(newF.name, 0, newF);
      // newFields.push(newF);
    });
    changeValidateStatusAfterAdd(data, changedFieldName);
    data.fields = newFields;
  }
};

function changeValidateStatusAfterAdd(data, changedFieldName) {
  if (changedFieldName.length) {
    data.items.forEach((item) => {
      if (isObject(item.validateStatus) && Object.keys(item.validateStatus)?.length > 0) {
        try {
          // 添加的是中间某项，从最后一项开始，将原来这一项的更新校验信息设置为下一项的；从后往前处理
          for (let i = changedFieldName.length - 1; i > 0; i--) {
            let originIndex = changedFieldName[i];
            if (item.validateStatus?.[originIndex]) {
              // 原来这一项有校验信息，将校验信息设置到新的位置（后一行）
              item.validateStatus[originIndex + 1] = item.validateStatus?.[originIndex];
            } else {
              // 没有校验信息，但是下一项有，删除原来位置的校验信息
              item.validateStatus[originIndex + 1] && delete item.validateStatus[originIndex + 1];
            }
            if (item.help[originIndex]) {
              item.help[originIndex + 1] = item.help?.[originIndex] as any;
            } else {
              item.help[originIndex + 1] && delete item.help[originIndex + 1];
            }
          }
          // 删除 「添加位置」这一行的校验信息
          item.validateStatus?.[changedFieldName[0]] &&
            delete item.validateStatus[changedFieldName[0]];
          item.help?.[changedFieldName[0]] && delete item.help[changedFieldName[0]];
        } catch (error) {}
      }
    });
  }
}

function changeValidateStatusAfterRemove(data, deleteIndex) {
  const index = deleteIndex;
  if (deleteIndex < 0) {
    return;
  }
  data.items.forEach((item) => {
    if (isObject(item.validateStatus) && Object.keys(item.validateStatus)?.length > 0) {
      try {
        // 删除的这项的索引位置 开始，更新校验信息为下一项的（从前往后处理）
        for (let i = index; i < data.fields.length; i++) {
          if (item.validateStatus?.[i + 1]) {
            item.validateStatus[i] = item.validateStatus?.[i + 1];
          } else {
            item.validateStatus[i] && delete item.validateStatus[i];
          }
          if (item.help[i + 1]) {
            item.help[i] = item.help?.[i + 1] as any;
          } else {
            item.help[i] && delete item.help[i];
          }
        }
        // 删除后，field最后一项没了，删除最后一项的校验信息
        item.validateStatus?.[data.fields.length] && delete item.validateStatus[data.fields.length];
        item.help?.[data.fields.length] && delete item.help[data.fields.length];
      } catch (error) {}
    }
  });
}
/** 删除一行 */
export const removeField = (props: RuntimeParams<Data> & FormListActionsProps) => {
  const { data, id, outputs, parentSlot, field, childrenStore } = props;
  data.value?.splice(field.name, 1);
  let index = data.fields.findIndex((i) => i.key === field.key);
  let fieldLength = data.fields?.length;
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
  data.userAction.type = InputIds.SetInitialValue;
  // 从这个索引位置之后，重新设置初始值
  data.userAction.startIndex = index;
  changeValidateStatusAfterRemove(data, index);
  // 如果索引是最后一项，将startIndex 设置为-1
  if (index === fieldLength - 1) {
    data.userAction.startIndex = -1;
  }

  changeValue({ data, id, outputs, parentSlot, name: props.name, prevAction: 'remove' });
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

  // 是否所有的按钮都隐藏，如果是，则操作区不应该占位
  let isEmpty = true;

  const Items = (
    <>
      {data.actions.items.map((item) => {
        const { iconConfig, ...res } = item;
        const icon = getBtnIcon(item);
        const permission = getWhatToDoWithoutPermission(item.permission, env);

        if (item.visible === false) {
          return null;
        }
        if (!env.edit) {
          if (permission.type !== 'none') {
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
        isEmpty = false;
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
    </>
  );
  return isEmpty || <Space wrap>{Items}</Space>;
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
  const FormActions = Actions(props);

  if (data.actions.visible && typeof FormActions !== 'boolean') {
    return (
      <Col data-form-actions flex={getFlexValue()} style={actionStyle}>
        <Form.Item {...formItemProps} style={{ margin: 0 }}>
          {FormActions}
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
