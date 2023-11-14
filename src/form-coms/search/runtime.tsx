import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Input, Select } from 'antd';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { inputIds, outputIds } from '../form-container/constants';
export interface Data {
  options: any[];
  rules: any[];
  isenterButton: boolean;
  enterButton: string;
  config: {
    allowClear: boolean;
    disabled: boolean;
    placeholder: string;
    addonBefore: string;
  };
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
  const validateRelOuputRef = useRef<any>(null);

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
        setIsEnabled(val) {
          if (val === true) {
            data.config.disabled = false;
          } else if (val === false) {
            data.config.disabled = true;
          }
        },
        validate(model, outputRels) {
          validateFormItem({
            value,
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
                outputs[outputIds.ON_VALIDATE](value);
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
    inputs[inputIds.SET_VALIDATE_INFO]((info: object) => {
      if (validateRelOuputRef.current) {
        validateRelOuputRef.current(info);
      }
    });
  }, []);

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id: props.id, name: name });
  };

  //值更新
  const changeValue = useCallback((e) => {
    const value = e.target.value;
    setValue(value);
    if (data.isSelect) {
      onChangeForFc(parentSlot, { id: id, name: name, value: [data.initValue, value] });
      outputs['onChange']([data.initValue, value]);
    } else {
      onChangeForFc(parentSlot, { id: id, name: name, value });
      outputs['onChange'](value);
    }
  }, []);

  const onChange = (val) => {
    changeSelectValue(val);
  };

  const changeSelectValue = (val) => {
    if (val === undefined) {
      data.initValue = '';
    }
    data.initValue = val;
    onChangeForFc(parentSlot, { id: id, value: [val, value], name });
    outputs['onChange']([val, value]);
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
            options={data.staticOptions}
            onChange={onChange}
          ></Select>
          <Search
            style={{
              width: `calc(100% - ${data.selectWidth})`
            }}
            onChange={changeValue}
            onSearch={onSearch}
            onBlur={onBlur}
            value={value}
            enterButton={data.isenterButton ? context : void 0}
            {...data.config}
          ></Search>
        </Input.Group>
      </div>
    );
  };

  return !data.isSelect ? (
    <div>
      <Search
        onChange={changeValue}
        onSearch={onSearch}
        onBlur={onBlur}
        value={value}
        enterButton={data.isenterButton ? context : void 0}
        {...data.config}
      ></Search>
    </div>
  ) : (
    renderSelectSearch()
  );
}
