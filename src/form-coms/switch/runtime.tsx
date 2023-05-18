import { Switch } from 'antd';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateFormItem } from '../utils/validator';
import { onChange as onChangeForFc } from '../form-container/models/onChange';

export interface Data {
  value: boolean | undefined;
  rules: any[];
  isFormItem?: boolean;
  config: {
    allowClear: boolean;
    disabled: boolean;
    addonBefore: string;
    addonAfter: string;
    showCount: boolean;
    maxLength?: number;
    checked: boolean;
  };
}

export default function ({
  env,
  data,
  _inputs,
  inputs,
  _outputs,
  outputs,
  parentSlot,
  id,
  name
}: RuntimeParams<Data>) {
  const { edit } = env;

  useFormItemInputs({
    inputs,
    outputs,
    name,
    configs: {
      setValue(val) {
        data.config.checked = val;
      },
      setInitialValue(val) {
        data.config.checked = val;
      },
      returnValue(output) {
        output(data.config.checked);
      },
      resetValue() {
        data.config.checked = false;
      },
      setDisabled() {
        data.config.disabled = true;
      },
      setEnabled() {
        data.config.disabled = false;
      },
      validate(output) {
        validateFormItem({
          value: data.config.checked,
          env,
          rules: data.rules
        })
          .then((r) => {
            output(r);
          })
          .catch((e) => {
            output(e);
          });
      }
    }
  });

  const changeValue = useCallback((checked) => {
    data.config.checked = checked;
    onChangeForFc(parentSlot, { id: id, value: checked, name: name });
    outputs['onChange'](checked);
  }, []);

  return (
    <Switch
      {...data.config}
      onChange={changeValue}
      // onBlur={onBlur}
    />
  );
}
