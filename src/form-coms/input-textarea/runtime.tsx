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
  const [value, setValue] = useState();
  useFormItemInputs({
    id: id,
    name: name,
    inputs,
    outputs,
    configs: {
      setValue(val) {
        // data.value = val;
        setValue(val);
      },
      setInitialValue(val) {
        // data.value = val;
        setValue(val);
      },
      returnValue(output) {
        output(data.value);
      },
      resetValue() {
        // data.value = void 0;
        setValue(void 0);
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
  useEffect(() => {
    data.value = value;
  }, [value]);

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id: id, name: name });
  };

  const changeValue = useCallback((e) => {
    const value = e.target.value;
    // data.value = value;
    setValue(value);
    onChangeForFc(parentSlot, { id: id, name: name, value });
    outputs['onChange'](value);
  }, []);

  const onBlur = useCallback((e) => {
    const value = e.target.value;
    onValidateTrigger();
    // data.value = value;
    setValue(value);
    outputs['onBlur'](value);
  }, []);

  const sizeConfig = useMemo(() => {
    if (env.edit) {
      return {
        rows: data.minRows
      };
    }

    return {
      autoSize: {
        minRows: data.minRows,
        maxRows: data.maxRows
      }
    };
  }, [env.edit, data.minRows, data.maxRows]);

  return (
    <div>
      <Input.TextArea
        {...data.config}
        // value={data.value}
        value={value}
        readOnly={!!edit}
        {...sizeConfig}
        onChange={changeValue}
        onBlur={onBlur}
      />
    </div>
  );
}
