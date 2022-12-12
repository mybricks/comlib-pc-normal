import React, { useLayoutEffect, useState } from 'react';
import { Cascader } from 'antd';
import { validateFormItem } from '../utils/validator';
import css from './runtime.less';
import useFormItemInputs from '../form-container/models/FormItem';

export interface Data {
  options: any[];
  placeholder: string;
  isMultiple: boolean;
  maxTagCountType?: string;
  value: number[] | string[];
  rules: any[];
  config: {
    placeholder: string;
    allowClear: boolean;
    disabled: boolean;
    maxTagCount?: 'responsive' | number;
    changeOnSelect: boolean;
    showSearch: boolean;
  };
}

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, inputs, outputs, env } = props;
  const [options, setOptions] = useState();

  useFormItemInputs({
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
        data.value = [];
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
  //输入数据源
  inputs['setOptions']((value) => {
    setOptions(value);
  });

  const onChange = (value) => {
    data.value = value;
    outputs['onChange'](value);
  };

  return (
    <div className={css.cascader}>
      <Cascader
        value={data.value}
        options={options}
        {...data.config}
        multiple={data.isMultiple}
        onChange={onChange}
      />
    </div>
  );
}
