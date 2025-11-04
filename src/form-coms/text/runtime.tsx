import { Form, Input, InputRef, Image } from 'antd';
import React, { useCallback, useLayoutEffect, useRef, useState, ReactNode, useEffect } from 'react';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import { inputIds, outputIds } from '../form-container/constants';
import useFormItemInputs from '../form-container/models/FormItem';
import { debounceValidateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import * as Icons from '@ant-design/icons';
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

  preSrc: false | 'inner' | 'custom';
  preInnerIcon: string;
  preCustomIcon: string;

  isEditable: boolean;
  contentSize: number[];
  iconGap: number[];

  setAutoFocus?: boolean;
}

export default function (props: RuntimeParams<Data>) {
  const { env, data, _inputs, inputs, _outputs, outputs, parentSlot, style } = props;
  const { edit } = env;

  const inputRef = useRef<InputRef>(null);
  const validateRelOutputRef = useRef<any>(null);
  const [value, setValue] = useState<string | null>(null);
  const [autoFocus, setAutoFocus] = useState(false);
  const valueRef = useRef<any>();
  const [placeholder, setPlaceholder] = useState(data.config.placeholder);

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
                debounceValidateTrigger(parentSlot, {
                  id: props.id,
                  name: props.name,
                  validateInfo: r
                });
              }
            })
            .catch((e) => {
              relOutput(e);
              debounceValidateTrigger(parentSlot, {
                id: props.id,
                name: props.name,
                validateInfo: e
              });
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
    inputs['setPlaceholder']((val, relOutputs) => {
      setPlaceholder(val);
      relOutputs['setPlaceholderDone'](val);
    });
    inputs['setAutoFocus']?.((flag: boolean, relOutputs) => {
      !!flag ? inputRef.current?.focus() : null;
      relOutputs['setAutoFocusDone'](flag);
    });
    if (data.setAutoFocus) {
      inputRef.current?.focus();
    }
    inputs[inputIds.SET_VALIDATE_INFO]?.((info: object, relOutputs) => {
      if (validateRelOutputRef.current) {
        validateRelOutputRef.current(info);
        debounceValidateTrigger(parentSlot, { id: props.id, name: props.name, validateInfo: info });
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
    let Icon = Icons && Icons[icon as string]?.render();
    Icon =
      typeof Icon === 'undefined' ? (
        <div
          style={{ display: 'flex', alignItems: 'center' }}
          dangerouslySetInnerHTML={{ __html: icon }}
        />
      ) : (
        Icons && Icons[icon as string]?.render()
      );

    return (
      <div style={{ fontSize: data.contentSize?.[0] || 14, marginRight: data.iconGap?.[0] || 0 }}>
        {Icon}
      </div>
    );
  };

  const customRender = (src) => {
    return (
      <div style={{ marginRight: data.iconGap?.[0] || 0 }}>
        <Image
          width={data.contentSize?.[1] || 14}
          height={data.contentSize?.[0] || 14}
          src={src}
          preview={false}
          alt={' '}
        />
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

  const renderPrefix = useCallback(() => {
    if (data.preSrc === 'inner') {
      return innerRender({ icon: data.preInnerIcon });
    } else if (data.preSrc === 'custom' && data.preCustomIcon) {
      return customRender(data.preCustomIcon);
    }
  }, [data.preInnerIcon, data.preCustomIcon, data.preSrc]);

  let jsx = data.isEditable ? (
    <Input
      className={css.input}
      ref={inputRef}
      type="text"
      {...data.config}
      maxLength={data.config.maxLength > 0 ? data.config.maxLength : void 0} // 兼容 antd5 中 maxLength 为 -1 时 outofrange 的问题
      placeholder={env.i18n(placeholder)}
      addonBefore={env.i18n(data.config.addonBefore)}
      addonAfter={env.i18n(data.config.addonAfter)}
      autoFocus={autoFocus}
      value={value}
      readOnly={!!edit}
      onChange={onChange}
      onBlur={onBlur}
      onPressEnter={onPressEnter}
      //size={'large'}
      showCount={
        data.config.showCount
          ? {
              formatter: ({ count, maxLength }) => {
                const effectiveMaxLength = maxLength ?? -1;
                return effectiveMaxLength > 0
                  ? `${value?.length || 0} / ${maxLength}`
                  : `${value?.length || 0}`;
              }
            }
          : void 0
      }
      prefix={data.preSrc !== false ? renderPrefix() : void 0}
      suffix={data.src !== false ? renderSuffix() : void 0}
    />
  ) : (
    <div className="input-readonly-content">{value}</div>
  );

  return <div className={css.fiText}>{jsx}</div>;
}
