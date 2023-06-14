import React, { useState, useCallback, useEffect } from 'react';
import { Input, Select } from 'antd';
import { validateFormItem } from '../utils/validator';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
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
    validateTrigger(parentSlot, { id: props.id, name: name });
  };

  const changeValue = useCallback((e) => {
    const value = e.target.value;
    setValue(value);
    onChangeForFc(parentSlot, { id: id, name: name, value });
    outputs['onChange'](value);
  }, []);

  const onSearch = useCallback((value) => {
    onValidateTrigger();
    outputs['onSearch'](value);
  }, []);

  const onBlur = useCallback((e) => {
    const value = e.target.value;
    onValidateTrigger();
    outputs['onBlur'](value);
  }, []);

  const renderSelectSearch = () => {
    return (
      <div>
        <Input.Group compact>
          <Select
            style={{ width: data.selectWidth }}
            value={data.initValue}
            options={data.staticOptions}
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
