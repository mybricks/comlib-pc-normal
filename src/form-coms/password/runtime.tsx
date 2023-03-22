import React, { useCallback, useState } from 'react';
import { Data } from './types';
import { Input } from 'antd';
import { validateFormItem } from '../utils/validator';
import useFormItemInputs from '../form-container/models/FormItem';
import css from './style.less';
import { validateTrigger } from '../form-container/models/validate';

export default function ({
  data,
  inputs,
  outputs,
  env,
  style,
  parentSlot,
  id
}: RuntimeParams<Data>) {
  const { placeholder, disabled } = data;
  const [value, setValue] = useState<string>();
  const validate = useCallback(
    (output) => {
      validateFormItem({
        value,
        env,
        rules: data.rules
      })
        .then((r) => {
          output(r);
        })
        .catch((e) => {
          output(e);
        });
    },
    [value]
  );

  useFormItemInputs(
    {
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

  // inputs['setValue']((val: string) => {
  //   setValue(val);
  // });

  // inputs['getValue']((_, outputRels) => {
  //   outputRels['returnValue'](getValue());
  // });

  // inputs['resetValue'](() => {
  //   setValue(void 0);
  // });

  // inputs['setDisabled'](() => {
  //   data.disabled = true;
  // });

  // inputs['setEnabled'](() => {
  //   data.disabled = false;
  // });

  // inputs['validate'](validate);
  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id: id });
  };

  const getValue = useCallback(() => value, [value]);

  const onChange = (e) => {
    const _value = e.target.value;
    setValue(_value);
    outputs['onChange'](_value);
  };

  const onPressEnter = useCallback((e) => {
    const value = e.target.value;
    onValidateTrigger();
    outputs['onPressEnter'](value);
  }, []);

  return (
    <div style={style}>
      <Input.Password
        allowClear
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onPressEnter={onPressEnter}
      />
    </div>
  );
}
