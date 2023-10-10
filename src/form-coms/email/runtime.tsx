import { Form, Input } from 'antd';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateFormItem, RuleKeys } from '../utils/validator';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { ValidateTriggerType } from '../types';

export interface Data {
  value: string | undefined;
  rules: any[];
  validateTrigger: string[];
  config: {
    allowClear: boolean;
    disabled: boolean;
    addonBefore: string;
    addonAfter: string;
    showCount: boolean;
    maxLength?: number;
  };
}

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, inputs, outputs, env, parentSlot } = props;
  const { edit } = env;
  const validateRelOuputRef = useRef<any>(null);

  useFormItemInputs({
    id: props.id,
    name: props.name,
    inputs,
    outputs,
    configs: {
      setValue(val) {
        data.value = val;
      },
      setInitialValue(val) {
        data.value = val;
      },
      returnValue(output) {
        output(data.value);
      },
      resetValue() {
        data.value = void 0;
      },
      setDisabled() {
        data.config.disabled = true;
      },
      setEnabled() {
        data.config.disabled = false;
      },
      validate(model, outputRels) {
        validateFormItem({
          value: data.value,
          env,
          model,
          rules: data.rules
        })
          .then((r) => {
            const cutomRule = data.rules.find((i) => i.key === RuleKeys.CUSTOM_EVENT);
            if (cutomRule?.status) {
              validateRelOuputRef.current = outputRels;
              outputs['onValidate'](data.value);
            } else {
              outputRels(r);
            }
          })
          .catch((e) => {
            outputRels(e);
          });
      }
    }
  });

  const onValidateTrigger = (type: string) => {
    data.validateTrigger?.includes(type) &&
      validateTrigger(parentSlot, { id: props.id, name: props.name });
  };

  const changeValue = useCallback((e) => {
    const value = e.target.value;
    data.value = value;
    onChangeForFc(parentSlot, { id: props.id, name: props.name, value });
    outputs['onChange'](value);
  }, []);

  const onBlur = useCallback((e) => {
    const value = e.target.value;
    data.value = value;
    onValidateTrigger(ValidateTriggerType.OnBlur);
    outputs['onBlur'](value);
  }, []);

  useEffect(() => {
    inputs['setValidateInfo']((info: object) => {
      if (validateRelOuputRef.current) {
        validateRelOuputRef.current(info);
      }
    });
  }, []);

  let jsx = (
    <Input
      type="text"
      {...data.config}
      value={data.value}
      readOnly={!!edit}
      onChange={changeValue}
      onBlur={onBlur}
    />
  );

  return <div>{jsx}</div>;
}
