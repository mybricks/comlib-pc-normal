import React, { useState, useCallback } from 'react';
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
  const [value, setValue] = useState<string | number>();
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

  const onBlur = useCallback(
    (e) => {
      onValidateTrigger();
      outputs['onBlur'](value);
    },
    [value]
  );

  const onPressEnter = useCallback(
    (e) => {
      onValidateTrigger();
      outputs['onPressEnter'](value);
    },
    [value]
  );

  //数字输入框实时校验位数, 多的小数位禁止输入
  const NumberProps = {
    formatter: (value: any) => {
      let reg;
      switch (data.config.precision) {
        case 0:
          reg = `${value}`.replace(/^(\-)*(\d+)\.().*$/, '$1$2');
          return reg;
        case 1:
          reg = `${value}`.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3');
          return reg;
        case 2:
          reg = `${value}`.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
          return reg;
        case 3:
          reg = `${value}`.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3');
          return reg;
        case 4:
          reg = `${value}`.replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3');
          return reg;
        case 5:
          reg = `${value}`.replace(/^(\-)*(\d+)\.(\d\d\d\d\d).*$/, '$1$2.$3');
          return reg;
        case 6:
          reg = `${value}`.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d).*$/, '$1$2.$3');
          return reg;
        case 7:
          reg = `${value}`.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d).*$/, '$1$2.$3');
          return reg;
        case 8:
          reg = `${value}`.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d).*$/, '$1$2.$3');
          return reg;
        case 9:
          reg = `${value}`.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d\d).*$/, '$1$2.$3');
          return reg;
        case 10:
          reg = `${value}`.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d\d\d).*$/, '$1$2.$3');
          return reg;
      }
    }
  };

  return (
    <div className={css.inputNumber}>
      <InputNumber<string | number>
        value={value}
        {...data.config}
        {...NumberProps}
        onChange={onChange}
        onBlur={onBlur}
        onPressEnter={onPressEnter}
      />
    </div>
  );
}
