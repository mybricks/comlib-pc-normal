import React, { useCallback, useState } from 'react';
import { Data } from './types';
import { Input } from 'antd';
import { validateFormItem } from '../utils/validator';
import useFormItemInputs from '../form-container/models/FormItem';
import css from './style.less';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';

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

  useFormItemInputs(
    {
      id,
      name,
      inputs,
      outputs,
      configs: {
        setValue,
        setInitialValue: setValue,
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
        validate
      }
    },
    [value]
  );

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id, name });
  };

  const getValue = useCallback(() => value, [value]);

  const onChange = (e) => {
    const _value = e.target.value;
    setValue(_value);
    onChangeForFc(parentSlot, { id, name, value: _value });
    outputs['onChange'](_value);
  };

  const onPressEnter = useCallback((e) => {
    const value = e.target.value;
    onValidateTrigger();
    outputs['onPressEnter'](value);
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
