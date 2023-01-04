import React, { useState, useCallback, useEffect } from 'react';
import { Input } from 'antd';
import { validateFormItem } from '../utils/validator';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateTrigger } from '../form-container/models/validate';
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
}
const { Search } = Input;

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, inputs, outputs, env, parentSlot } = props;
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

  const changeValue = useCallback((e) => {
    const value = e.target.value;
    setValue(value);
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

  return (
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
  );
}
