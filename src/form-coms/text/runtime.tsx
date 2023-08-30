import { Form, Input, InputRef } from 'antd';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { validateFormItem } from '../utils/validator';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';

import css from './runtime.less';

export interface Data {
  value: string | undefined;
  rules: any[];
  config: {
    allowClear: boolean;
    disabled: boolean;
    addonBefore: string;
    addonAfter: string;
    showCount: boolean;
    maxLength?: number;
    size?: 'large' | 'middle' | 'small';
  };
}

const InputIds = {
  SET_COLOR: 'setColor'
};

export default function (props: RuntimeParams<Data>) {
  const { env, data, _inputs, inputs, _outputs, outputs, parentSlot, style } = props;
  const { edit } = env;

  const inputRef = useRef<InputRef>(null);

  useFormItemInputs({
    id: props.id,
    name: props.name,
    parentSlot,
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
        data.value = void 0;
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

  useLayoutEffect(() => {
    inputs[InputIds.SET_COLOR]((color: string) => {
      if (inputRef.current?.input) {
        inputRef.current.input.style.color = color || 'rgba(0, 0, 0, 0.85)';
      }
    });
  }, []);

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id: props.id, name: props.name });
  };

  const changeValue = useCallback((e) => {
    const value = e.target.value;
    data.value = value;
    onChangeForFc(parentSlot, { id: props.id, name: props.name, value });
    outputs['onChange'](value);
  }, []);

  const onBlur = useCallback((e) => {
    const value = e.target.value;
    onValidateTrigger();
    outputs['onBlur'](value);
  }, []);

  const onPressEnter = useCallback((e) => {
    const value = e.target.value;
    onValidateTrigger();
    outputs['onPressEnter'](value);
  }, []);

  let jsx = (
    <Input
      ref={inputRef}
      type="text"
      {...data.config}
      value={data.value}
      readOnly={!!edit}
      onChange={changeValue}
      onBlur={onBlur}
      onPressEnter={onPressEnter}
      //size={'large'}
    />
  );

  return <div className={css.fiText}>{jsx}</div>;
}
