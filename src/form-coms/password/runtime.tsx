import React, { useCallback, useState } from 'react';
import { Data } from './types';
import { Input } from 'antd';
import { validateFormItem } from '../utils/validator';
import css from './style.less';

export default function ({ data, inputs, outputs, env }: RuntimeParams<Data>) {
  const { placeholder, disabled } = data;
  const [value, setValue] = useState<string>();
  const validate = useCallback(
    (val, outputRels) => {
      validateFormItem({
        value,
        env,
        rules: data.rules
      })
        .then((r) => {
          outputRels['returnValidate'](r);
        })
        .catch((e) => {
          outputRels['returnValidate'](e);
        });
    },
    [value]
  );

  inputs['setValue']((val: string) => {
    setValue(val);
  });

  inputs['getValue']((_, outputRels) => {
    outputRels['returnValue'](getValue());
  });

  inputs['resetValue'](() => {
    setValue(void 0);
  });

  inputs['setDisabled'](() => {
    data.disabled = true;
  });

  inputs['setEnabled'](() => {
    data.disabled = false;
  });

  inputs['validate'](validate);

  const getValue = useCallback(() => value, [value]);

  const onChange = (e) => {
    const _value = e.target.value;
    setValue(_value);
    outputs['onChange'](_value);
  };

  return (
    <div>
      <Input.Password
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={onChange}
      />
    </div>
  );
}
