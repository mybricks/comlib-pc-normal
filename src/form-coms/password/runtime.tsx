import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Data } from './types';
import { Input } from 'antd';
import { validateFormItem, RuleKeys } from '../utils/validator';
import useFormItemInputs from '../form-container/models/FormItem';
import css from './style.less';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { ValidateTriggerType } from '../types';

export default function ({
  data,
  inputs,
  outputs,
  env,
  style,
  parentSlot,
  id,
  name
}: RuntimeParams<Data>) {
  const { placeholder, disabled } = data;
  const [value, setValue] = useState<string>();
  const validate = useCallback(
    (model, outputRels) => {
      validateFormItem({
        value,
        env,
        model,
        rules: data.rules
      })
        .then((r) => {
          outputRels(r);
        })
        .catch((e) => {
          outputRels(e);
        });
    },
    [value]
  );
  const validateRelOuputRef = useRef<any>(null);

  useFormItemInputs(
    {
      id,
      name,
      inputs,
      outputs,
      configs: {
        setValue(val) {
          setValue(val);
          onValidateTrigger(ValidateTriggerType.OnChange);
        },
        setInitialValue(val) {
          setValue(val);
          onValidateTrigger(ValidateTriggerType.OnInit);
        },
        returnValue(output) {
          output(getValue());
        },
        resetValue() {
          setValue(void 0);
        },
        setDisabled() {
          data.disabled = true;
        },
        setEnabled() {
          data.disabled = false;
        },
        validate(model, outputRels) {
          validateFormItem({
            value: value,
            env,
            model,
            rules: data.rules
          })
            .then((r) => {
              const cutomRule = data.rules.find((i) => i.key === RuleKeys.CUSTOM_EVENT);
              if (cutomRule?.status) {
                validateRelOuputRef.current = outputRels;
                outputs['onValidate'](value);
              } else {
                outputRels(r);
              }
            })
            .catch((e) => {
              outputRels(e);
            });
        }
      }
    },
    [value]
  );

  const onValidateTrigger = (type: string) => {
    data.validateTrigger?.includes(type) && validateTrigger(parentSlot, { id, name });
  };

  const getValue = useCallback(() => value, [value]);

  const onChange = (e) => {
    const _value = e.target.value;
    setValue(_value);
    onChangeForFc(parentSlot, { id, name, value: _value });
    onValidateTrigger(ValidateTriggerType.OnChange);
    outputs['onChange'](_value);
  };

  const onPressEnter = useCallback((e) => {
    const value = e.target.value;
    onValidateTrigger(ValidateTriggerType.OnPressEnter);
    outputs['onPressEnter'](value);
  }, []);

  useEffect(() => {
    inputs['setValidateInfo']((info: object) => {
      if (validateRelOuputRef.current) {
        validateRelOuputRef.current(info);
      }
    });
  }, []);

  return (
    <Input.Password
      allowClear
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      onChange={onChange}
      onPressEnter={onPressEnter}
      className={css.password}
    />
  );
}
