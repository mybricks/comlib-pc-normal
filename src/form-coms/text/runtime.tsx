import { Form, Input, InputRef, Image } from 'antd';
import React, { useCallback, useLayoutEffect, useRef, useState, ReactNode } from 'react';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import { inputIds, outputIds } from '../form-container/constants';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import * as Icons from '@ant-design/icons';

import css from './runtime.less';
import { InputIds } from '../types';

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
  src: false | 'inner' | 'custom';
  innerIcon: string;
  customIcon: string;
}

export default function (props: RuntimeParams<Data>) {
  const { env, data, _inputs, inputs, _outputs, outputs, parentSlot, style } = props;
  const { edit } = env;

  const inputRef = useRef<InputRef>(null);
  const validateRelOuputRef = useRef<any>(null);

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
      validate(model, relOutput) {
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
              validateRelOuputRef.current = relOutput;
              outputs[outputIds.ON_VALIDATE](data.value);
            } else {
              relOutput(r);
            }
          })
          .catch((e) => {
            relOutput(e);
          });
      }
    }
  });

  useLayoutEffect(() => {
    inputs[InputIds.SetColor]((color: string) => {
      if (inputRef.current?.input) {
        inputRef.current.input.style.color = typeof color === 'string' ? color : '';
      }
    });
    inputs[inputIds.SET_VALIDATE_INFO]((info: object) => {
      if (validateRelOuputRef.current) {
        validateRelOuputRef.current(info);
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

  const innerRender = ({ icon }: { icon: ReactNode }) => {
    const Icon = Icons && Icons[icon as string]?.render();
    return <>{Icon}</>;
  };

  const customRender = (src) => {
    return (
      <div className={css.customIcon}>
        <Image src={src} preview={false} alt={' '} />
      </div>
    );
  };

  const renderSuffix = useCallback(() => {
    if (data.src === 'inner') {
      return innerRender({ icon: data.innerIcon });
    } else if (data.src === 'custom' && data.customIcon) {
      return customRender(data.customIcon);
    }
  }, [data.innerIcon, data.customIcon]);

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
      suffix={data.src !== false ? renderSuffix() : void 0}
    />
  );

  return <div className={css.fiText}>{jsx}</div>;
}
