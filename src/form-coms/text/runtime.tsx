import { Form, Input, InputRef, Image } from 'antd';
import React, { useCallback, useLayoutEffect, useRef, useState, ReactNode, useEffect } from 'react';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import { inputIds, outputIds } from '../form-container/constants';
import useFormItemInputs from '../form-container/models/FormItem';
import { debounceValidateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import * as Icons from '@ant-design/icons';
import { difference } from 'lodash';
import css from './runtime.less';
import { InputIds, ValidateTriggerType } from '../types';

export interface Data {
  value: string | undefined;
  rules: any[];
  validateTrigger: string[];
  isTrim: boolean;
  config: {
    allowClear: boolean;
    disabled: boolean;
    addonBefore: string;
    addonAfter: string;
    showCount: boolean;
    maxLength?: number;
    size?: 'large' | 'middle' | 'small';
    placeholder?: string;
  };
  src: false | 'inner' | 'custom';
  innerIcon: string;
  customIcon: string;

  isEditable: boolean;
}

export default function (props: RuntimeParams<Data>) {
  const { env, data, _inputs, inputs, _outputs, outputs, parentSlot, style } = props;
  const { edit } = env;

  const inputRef = useRef<InputRef>(null);
  const validateRelOutputRef = useRef<any>(null);
  const [value, setValue] = useState();
  const [autoFocus, setAutoFocus] = useState(false);
  const valueRef = useRef<any>();

  useFormItemInputs(
    {
      id: props.id,
      name: props.name,
      parentSlot,
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
          output(value);
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
        setIsEditable(val) {
          data.isEditable = val;
        },
        validate(model, relOutput) {
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
                validateRelOutputRef.current = relOutput;
                outputs[outputIds.ON_VALIDATE](valueRef.current);
              } else {
                relOutput(r);
              }
            })
            .catch((e) => {
              relOutput(e);
            });
        }
      }
    },
    [value]
  );

  useLayoutEffect(() => {
    inputs[InputIds.SetColor]?.((color: string, relOutputs) => {
      if (inputRef.current?.input) {
        let outputColor = typeof color === 'string' ? color : '';
        inputRef.current.input.style.color = outputColor;
        relOutputs['setColorDone'](outputColor);
      }
    });
    inputs['setAutoFocus']?.((flag: boolean, relOutputs) => {
      setAutoFocus(!!flag);
      !!flag ? inputRef.current?.focus() : null;
      relOutputs['setAutoFocusDone'](flag);
    });
    inputs[inputIds.SET_VALIDATE_INFO]?.((info: object, relOutputs) => {
      if (validateRelOutputRef.current) {
        validateRelOutputRef.current(info);
        relOutputs['setValidateInfoDone'](info);
      }
    });
  }, []);

  const onValidateTrigger = (type: string) => {
    data.validateTrigger?.includes(type) &&
      debounceValidateTrigger(parentSlot, { id: props.id, name: props.name });
  };

  const formatter = useCallback((oriVal) => {
    return data.isTrim ? oriVal?.trim() : oriVal;
  }, []);

  const changeValue = useCallback((oriVal) => {
    const val = formatter(oriVal);
    setValue(val);
    valueRef.current = val;
    onChangeForFc(parentSlot, { id: props.id, name: props.name, value: val });
  }, []);

  const onChange = useCallback((e) => {
    const value = formatter(e.target.value);
    changeValue(value);
    outputs['onChange'](value);
    onValidateTrigger(ValidateTriggerType.OnChange);
  }, []);

  const onBlur = useCallback((e) => {
    const value = e.target.value;
    onValidateTrigger(ValidateTriggerType.OnBlur);
    outputs['onBlur'](value);
  }, []);

  const onPressEnter = useCallback((e) => {
    const value = e.target.value;
    onValidateTrigger(ValidateTriggerType.OnPressEnter);
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

  let jsx = data.isEditable ? (
    <Input
      className={css.input}
      ref={inputRef}
      type="text"
      {...data.config}
      placeholder={env.i18n(data.config.placeholder)}
      addonBefore={env.i18n(data.config.addonBefore)}
      addonAfter={env.i18n(data.config.addonAfter)}
      autoFocus={autoFocus}
      value={value}
      readOnly={!!edit}
      onChange={onChange}
      onBlur={onBlur}
      onPressEnter={onPressEnter}
      //size={'large'}
      suffix={data.src !== false ? renderSuffix() : void 0}
    />
  ) : (
    <div>{value}</div>
  );

  return <div className={css.fiText}>{jsx}</div>;
}
