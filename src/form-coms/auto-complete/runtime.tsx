import React, { useCallback, useRef, useLayoutEffect, useEffect } from 'react';
import { AutoComplete, Input, InputRef } from 'antd';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import css from './runtime.less';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { inputIds, outputIds } from '../form-container/constants';
import { InputIds } from '../types';
import { i18nFn } from '../../utils';

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

  const inputRef = useRef<InputRef>(null);
  const validateRelOuputRef = useRef<any>(null);

  useLayoutEffect(() => {
    inputs[InputIds.SetColor]((color: string) => {
      // 设置输入框字体颜色
      if (inputRef.current?.input) {
        inputRef.current.input.style.color = typeof color === 'string' ? color : '';
      }
    });
  }, []);

  useFormItemInputs({
    id: props.id,
    name: props.name,
    inputs,
    outputs,
    configs: {
      setValue(val) {
        changeValue(val);
      },
      setInitialValue(val) {
        changeValue(val);
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
      setIsEnabled(val) {
        if (val === true) {
          data.config.disabled = false;
        } else if (val === false) {
          data.config.disabled = true;
        }
      },
      validate(model, outputRels) {
        validateFormItem({
          value: data.value,
          env,
          model,
          rules: data.rules
        })
          .then((r) => {
            const cutomRule = (data.rules || defaultRules).find(
              (i) => i.key === RuleKeys.CUSTOM_EVENT
            );
            if (cutomRule?.status) {
              validateRelOuputRef.current = outputRels;
              outputs[outputIds.ON_VALIDATE](data.value);
            } else {
              outputRels(r);
            }
          })
          .catch((e) => {
            outputRels(e);
          });
      }
    }
  });
  useEffect(() => {
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
    // 设置校验状态
    inputs[inputIds.SET_VALIDATE_INFO]((info: object) => {
      if (validateRelOuputRef.current) {
        validateRelOuputRef.current(info);
      }
    });
  }, []);

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id: props.id, name: props.name });
  };

  const changeValue = (value) => {
    data.value = value;
    onChangeForFc(parentSlot, { id: props.id, name: props.name, value });
  };

  const onChange = (value) => {
    changeValue(value);
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
        placeholder={env.i18n(data.config.placeholder)}
        value={data.value}
        onChange={onChange}
        filterOption={data.isFilter}
        children={<Input ref={inputRef} />}
        onBlur={onBlur}
        onSelect={onSelect}
        onSearch={data.isOnSearch ? onSearch : void 0}
        options={env.edit ? i18nFn(data.staticOptions, env) : i18nFn(data.options, env)}
      />
    </div>
  );
}
