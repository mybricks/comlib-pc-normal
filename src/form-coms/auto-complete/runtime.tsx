import React, { useCallback } from 'react';
import { AutoComplete } from 'antd';
import { validateFormItem } from '../utils/validator';
import css from './runtime.less';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';

export interface Option {
  value: string;
  label: string;
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
  const { data, inputs, outputs, env, parentSlot, logger } = props;

  useFormItemInputs({
    id: props.id,
    name: props.name,
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
    if (Array.isArray(value) && value.every((item) => 'value' in item)) {
      if (value.every((item) => 'value' in item)) {
        data.options = value;
      } else {
        console.error('数据源缺少value字段');
        logger.error('数据源缺少value字段');
      }
    } else {
      console.error('数据源数据结构不正确');
      logger.error('数据源数据结构不正确');
    }
  });

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id: props.id, name: props.name });
  };

  const onChange = (value) => {
    data.value = value;
    onChangeForFc(parentSlot, { id: props.id, name: props.name, value });
    outputs['onChange'](value);
  };

  const onBlur = useCallback((e) => {
    const value = e.target.value;
    onValidateTrigger();
    outputs['onBlur'](value);
  }, []);

  const onSelect = (e) => {
    outputs['onSelect'](e);
  };

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
        onSelect={onSelect}
        onSearch={data.isOnSearch ? onSearch : void 0}
        options={env.edit ? data.staticOptions : data.options}
      />
    </div>
  );
}
