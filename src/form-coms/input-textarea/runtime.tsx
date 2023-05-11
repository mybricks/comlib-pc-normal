import { Input } from 'antd';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateFormItem } from '../utils/validator';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';

export interface Data {
  value: string | undefined;
  rules: any[];
  config: {
    allowClear: boolean;
    disabled: boolean;
    placeholder: string;
    showCount: boolean;
    maxLength?: number;
  };
  minRows?: number;
  maxRows?: number;
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
    id: id,
    name: name,
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
      validate(output) {
        validateFormItem({
          value: data.value,
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

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id: id, name: name });
  };

  const changeValue = useCallback((e) => {
    const value = e.target.value;
    data.value = value;
    onChangeForFc(parentSlot, { id: id, name: name, value });
    outputs['onChange'](value);
  }, []);

  const onBlur = useCallback((e) => {
    const value = e.target.value;
    onValidateTrigger();
    data.value = value;
    outputs['onBlur'](value);
  }, []);

  return (
    <div>
      <Input.TextArea
        {...data.config}
        value={data.value}
        readOnly={!!edit}
        onChange={changeValue}
        onBlur={onBlur}
        autoSize={{ minRows: data.minRows, maxRows: data.maxRows }}
      />
    </div>
  );
}
