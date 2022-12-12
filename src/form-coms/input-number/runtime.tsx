import React, { useLayoutEffect, useState } from 'react';
import { InputNumber } from 'antd';
import { validateFormItem } from '../utils/validator';
import css from './runtime.less';
import useFormItemInputs from '../form-container/models/FormItem';
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
  const { data, inputs, outputs, env } = props;
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

  const onChange = (value) => {
    setValue(value);
    outputs['onChange'](value);
  };

  return (
    <div className={css.inputNumber}>
      <InputNumber value={value} {...data.config} onChange={onChange} />
    </div>
  );
}
