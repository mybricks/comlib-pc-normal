import React, { useLayoutEffect, useState, useCallback } from 'react';
import { InputNumber } from 'antd';
import { validateFormItem } from '../utils/validator';
import css from './runtime.less';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateTrigger } from '../form-container/models/validate';
export interface Data {
  options: any[];
  rules: any[];
  config: {
    disabled: boolean;
    placeholder: string;
    addonBefore: string;
    addonAfter: string;
    precision: number;
    step: number;
  };
}

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, inputs, outputs, env, parentSlot } = props;
  const [value, setValue] = useState();
  useFormItemInputs(
    {
      inputs,
      outputs,
      configs: {
        setValue(val) {
          setValue(val);
        },
        setInitialValue(val) {
          setValue(val);
        },
        returnValue(output) {
          output(value);
        },
        resetValue() {
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
        }
      }
    },
    [value]
  );

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id: props.id });
  };

  const onChange = (value) => {
    setValue(value);
    outputs['onChange'](value);
  };

  const onBlur = useCallback((e) => {
    const value = e.target.value;
    setValue(value);
    onValidateTrigger();
    outputs['onBlur'](value);
  }, []);

  const onPressEnter = useCallback((e) => {
    const value = e.target.value;
    setValue(value);
    onValidateTrigger();
    outputs['onPressEnter'](value);
  }, []);

  return (
    <div className={css.inputNumber}>
      <InputNumber
        value={value}
        {...data.config}
        onChange={onChange}
        onBlur={onBlur}
        onPressEnter={onPressEnter}
      />
    </div>
  );
}
