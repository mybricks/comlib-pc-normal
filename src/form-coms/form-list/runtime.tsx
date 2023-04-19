import React, { useMemo, useCallback, useLayoutEffect } from 'react';
import { Button, Col, Form, Row } from 'antd';
import { Data, FormControlInputId } from './types';
import SlotContent from './SlotContent';
import { isObject } from './utils';
import { validateTrigger } from '../form-container/models/validate';
import { OutputIds, ValidateInfo } from '../types';
import { typeCheck } from '../../utils';
import { validateFormItem } from '../utils/validator';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { ActionsWrapper, FormListActionsProps } from './components/FormActions';

type FormControlInputRels = {
  validate: (val?: any) => {
    returnValidate: (cb: (val: ValidateInfo) => void) => void;
  };
  getValue: (val?: any) => {
    returnValue: (val) => {};
  };
  [key: string]: (val?: any) => void;
};

type FormControlInputType = {
  [key in FormControlInputId]: FormControlInputRels[key];
};

export default function Runtime(props: RuntimeParams<Data>) {
  const { env, data, inputs, outputs, slots, logger, title, parentSlot, id } = props;
  const { edit } = env;

  const childrenInputs = useMemo<{
    [id: string]: FormControlInputType;
  }>(() => {
    return {};
  }, [env.edit]);

  useLayoutEffect(() => {
    inputs['setValue']((value) => {
      if (typeCheck(value, ['Array', 'Undefined'])) {
        data.value = value;
        onChangeForFc(parentSlot, { id, value });
        outputs[OutputIds.OnChange](value);
        onValidateTrigger();
      } else {
        logger.error(title + '的值是列表类型');
      }
    });

    inputs['setInitialValue']((value) => {
      if (typeCheck(value, ['Array', 'Undefined'])) {
        data.value = value;
        onChangeForFc(parentSlot, { id, value });
        outputs[OutputIds.OnInitial](value);
        onValidateTrigger();
      } else {
        logger.error(title + '的值是列表类型');
      }
    });

    inputs['validate']((val, outputRels) => {
      validateFormItem({
        value: data.value,
        env,
        rules: data.rules
      })
        .then((r) => {
          outputRels['returnValidate'](r);
        })
        .catch((e) => {
          outputRels['returnValidate'](e);
        });
    });
    inputs['getValue']((val, outputRels) => {
      outputRels['returnValue'](data.value);
    });

    inputs['resetValue'](() => {
      data.value = void 0;
      slots[SlotIds.FormItems].inputs['curValue'](data.value);
    });
  }, []);

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id });
  };

  const validate = useCallback(() => {
    return new Promise((resolve, reject) => {
      Promise.all(
        data.items.map((item) => {
          if (!data.submitHiddenFields) {
            // 隐藏的表单项，不再校验
            if (!item.visible) return { validateStatus: 'success' };
          }

          const id = item.id;
          const input = childrenInputs[id];

          return new Promise((resolve, reject) => {
            validateForInput({ item, input }, resolve);
          });
        })
      )
        .then((values) => {
          let rtn = false;
          values.forEach((item) => {
            if (item.validateStatus !== 'success') {
              reject(item);
            }
          });

          resolve(rtn);
        })
        .catch((e) => reject(e));
    });
  }, []);

  const getValue = useCallback(() => {
    return new Promise((resolve, reject) => {
      /** 隐藏的表单项，不收集数据 **/
      const formItems = data.submitHiddenFields
        ? data.items
        : data.items.filter((item) => item.visible);

      Promise.all(
        formItems.map((item) => {
          const id = item.id;
          const input = childrenInputs[id];

          return new Promise((resolve, reject) => {
            let count = 0;
            let value = {};
            input?.getValue().returnValue((val, key) => {
              //调用所有表单项的 getValue/returnValue
              if (typeof data.fieldsLength !== 'undefined') {
                value[key] = {
                  name: item.name,
                  value: val
                };

                count++;

                if (count == data.fieldsLength) {
                  resolve(value);
                }
              } else {
                value = {
                  name: item.name || item.label,
                  value: val
                };

                resolve(value);
              }
            });
          });
        })
      )
        .then((values) => {
          const arr = [];
          values.forEach((valItem) => {
            Object.keys(valItem).map((key) => {
              if (!arr[key]) {
                arr[key] = {};
              }
              arr[key][valItem[key].name] = valItem[key].value;
            });
          });
          resolve(arr);
        })
        .catch((e) => reject(e));
    });
  }, []);

  if (env.edit) {
    const actionProps: FormListActionsProps = {
      data
    };
    return (
      <>
        <SlotContent
          env={env}
          slots={slots}
          data={data}
          childrenInputs={childrenInputs}
          outputs={outputs}
          actions={<ActionsWrapper actionProps={actionProps} />}
        />
      </>
    );
  }

  const FormList = (fields, operation) => {
    data.fieldsLength = fields.length;
    const defaultActionProps = {
      data,
      operation,
      hiddenRemoveButton: true
    };
    return (
      <>
        {fields.map((field, index) => {
          const actionProps: FormListActionsProps = {
            data,
            operation,
            fieldIndex: index,
            field
          };
          return (
            <div key={field.key}>
              <SlotContent
                env={env}
                slots={slots}
                data={data}
                childrenInputs={childrenInputs}
                outputs={outputs}
                actions={<ActionsWrapper actionProps={actionProps} />}
              />
            </div>
          );
        })}
        {fields.length === 0 && <ActionsWrapper actionProps={defaultActionProps} />}
      </>
    );
  };
  const { isFormItem } = data;
  if (isFormItem) {
    return FormList;
  }
  return (
    <Form>
      <Form.List name="">{FormList}</Form.List>
    </Form>
  );
}

/**
 * @description 触发表单项校验，并更新校验结果
 */
const validateForInput = (
  { input, item }: { input: FormControlInputType; item: any },
  cb?: (val: any) => void
): void => {
  input?.validate({ ...item }).returnValidate((validateInfo) => {
    item.validateStatus = validateInfo?.validateStatus;
    item.help = validateInfo?.help;
    if (cb) {
      cb(validateInfo);
    }
  });
};

const setValuesForInput = ({ childrenInputs, formItems, name }, inputId, values) => {
  const item = formItems.find((item) => (item.name || item.label) === name);
  if (item) {
    const input = childrenInputs[item.id];
    if (isObject(values[name])) {
      input[inputId] && input[inputId]({ ...values[name] });
    } else {
      input[inputId] && input[inputId](values[name]);
    }
  }
};
