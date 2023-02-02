import React, { useCallback } from 'react';
import { AutoComplete } from 'antd';
import { validateFormItem } from '../utils/validator';
import css from './runtime.less';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateTrigger } from '../form-container/models/validate';

export interface Option {
  value: string;
}

export interface Data {
  options: Option[];
  value: string;
  rules: any[];
  staticOptions: Option[];
  isFilter: boolean;
  isOnSearch: boolean;
  config: {
    placeholder: string;
    allowClear: boolean;
    disabled: boolean;
  };
}

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, inputs, outputs, env, parentSlot } = props;

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
        data.value = '';
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
    data.options = value;
  });

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id: props.id });
  };

  const onChange = (value) => {
    data.value = value;
    outputs['onChange'](value);
  };

  const onBlur = useCallback((e) => {
    const value = e.target.value;
    onValidateTrigger();
    outputs['onBlur'](value);
  }, []);

  const onSearch = (e) => {
    //开启搜索功能，自定义下拉选项
    if (data.isOnSearch) {
      outputs['search'](e);
    }
  };

  return (
    <div className={css.autoComplete}>
      <AutoComplete
        {...data.config}
        value={data.value}
        onChange={onChange}
        filterOption={data.isFilter}
        onBlur={onBlur}
        onSearch={data.isOnSearch ? onSearch : void 0}
        options={env.edit ? data.staticOptions : data.options}
      />
    </div>
  );
}
