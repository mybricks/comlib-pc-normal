import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Input, InputProps, Select } from 'antd';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { inputIds, outputIds } from '../form-container/constants';
import { i18nFn } from '../../utils';
export interface Data {
  options: any[];
  rules: any[];
  isenterButton: boolean;
  enterButton: string;
  config: InputProps;
  isSelect: boolean;
  selectWidth: string;
  staticOptions: Options[];
  initValue: string;
}

export interface Options {
  label: string;
  value: string;
  checked: boolean;
  disabled: boolean;
}
const { Search } = Input;

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, inputs, outputs, env, parentSlot, id, name } = props;
  const [value, setValue] = useState<any>();
  const [context, setContext] = useState<any>();
  const validateRelOutputRef = useRef<any>(null);
  const valueRef = useRef<any>();

  useEffect(() => {
    if (data.isenterButton && data.enterButton !== '') {
      setContext(data.enterButton);
    } else if (data.isenterButton && data.enterButton === '') {
      setContext(true);
    }
  }, [data.enterButton, data.isenterButton]);

  useFormItemInputs(
    {
      inputs,
      outputs,
      name,
      configs: {
        setValue(val) {
          changeValue(val);
        },
        setInitialValue(val) {
          changeValue(val);
        },
        returnValue(output) {
          output(valueRef.current);
        },
        resetValue() {
          changeValue(void 0);
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
            value: valueRef.current,
            env,
            model,
            rules: data.rules
          })
            .then((r) => {
              const customRule = (data.rules || defaultRules).find(
                (i) => i.key === RuleKeys.CUSTOM_EVENT
              );
              if (customRule?.status) {
                validateRelOutputRef.current = outputRels;
                outputs[outputIds.ON_VALIDATE](valueRef.current);
              } else {
                outputRels(r);
              }
            })
            .catch((e) => {
              outputRels(e);
            });
        }
      }
    },
    [value]
  );

  useEffect(() => {
    inputs[inputIds.SET_VALIDATE_INFO]((info: object, relOutputs) => {
      if (validateRelOutputRef.current) {
        validateRelOutputRef.current(info);
        relOutputs['setValidateInfoDone'](info);
      }
    });
  }, []);

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id: props.id, name: name });
  };

  const changeValue = useCallback((value) => {
    setValue(value);
    valueRef.current = value;
    if (data.isSelect) {
      onChangeForFc(parentSlot, { id: id, name: name, value: [data.initValue, value] });
    } else {
      onChangeForFc(parentSlot, { id: id, name: name, value });
    }
  }, []);

  //值更新
  const onChange = useCallback((e) => {
    const value = e.target.value;
    changeValue(value);
    if (data.isSelect) {
      outputs['onChange']([data.initValue, value]);
    } else {
      outputs['onChange'](value);
    }
  }, []);

  const changeSelectValue = (val) => {
    if (val === undefined) {
      data.initValue = '';
    }
    data.initValue = val;
    onChangeForFc(parentSlot, { id: id, value: [val, valueRef.current], name });
    outputs['onChange']([val, valueRef.current]);
  };

  //搜索
  const onSearch = useCallback((value) => {
    onValidateTrigger();
    if (data.isSelect) {
      outputs['onSearch']([data.initValue, value]);
    } else {
      outputs['onSearch'](value);
    }
  }, []);

  //失去焦点
  const onBlur = useCallback((e) => {
    const value = e.target.value;
    onValidateTrigger();
    if (data.isSelect) {
      outputs['onBlur']([data.initValue, value]);
    } else {
      outputs['onBlur'](value);
    }
  }, []);

  const renderSelectSearch = () => {
    return (
      <div>
        <Input.Group compact>
          <Select
            style={{ width: data.selectWidth }}
            value={data.initValue}
            options={i18nFn(data.staticOptions, env)}
            onChange={changeSelectValue}
          ></Select>
          <Search
            style={{
              width: `calc(100% - ${data.selectWidth})`
            }}
            onChange={onChange}
            onSearch={onSearch}
            onBlur={onBlur}
            value={value}
            enterButton={data.isenterButton ? env.i18n(context) : void 0}
            {...data.config}
            placeholder={env.i18n(data.config.placeholder)}
            addonBefore={env.i18n(data.config.addonBefore)}
          ></Search>
        </Input.Group>
      </div>
    );
  };

  return !data.isSelect ? (
    <div>
      <Search
        onChange={onChange}
        onSearch={onSearch}
        onBlur={onBlur}
        value={value}
        enterButton={data.isenterButton ? env.i18n(context) : void 0}
        {...data.config}
        placeholder={env.i18n(data.config.placeholder)}
        addonBefore={env.i18n(data.config.addonBefore)}
      ></Search>
    </div>
  ) : (
    renderSelectSearch()
  );
}
