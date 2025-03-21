import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { InputNumber, InputNumberProps, InputRef, Popover } from 'antd';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import css from './runtime.less';
import useFormItemInputs from '../form-container/models/FormItem';
import { debounceValidateTrigger } from '../form-container/models/validate';
import { ValidateTriggerType } from '../types';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { inputIds, outputIds } from '../form-container/constants';
export interface Data {
  options: any[];
  rules: any[];
  config: InputNumberProps;
  isFormatter: boolean;
  charPostion: 'prefix' | 'suffix';
  character: string;
  isMin: boolean;
  isMax: boolean;
  min: number;
  max: number;
  isEditable: boolean;
  isControl: boolean;
  useGrouping: boolean;
  isParser: boolean;
  isPrecision: boolean;
  validateTrigger: string[];
}

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, inputs, outputs, env, parentSlot } = props;
  const [value, setValue] = useState<string | number>();
  const validateRelOutputRef = useRef<any>(null);
  const inputRef = useRef<InputRef>(null);
  const valueRef = useRef<any>();
  const [autoFocus, setAutoFocus] = useState(false);

  useFormItemInputs(
    {
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
                debounceValidateTrigger(parentSlot, {
                  id: props.id,
                  name: props.name,
                  validateInfo: r
                });
              }
            })
            .catch((e) => {
              outputRels(e);
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

  useEffect(() => {
    // 设置校验状态
    inputs[inputIds.SET_VALIDATE_INFO]((info: object, relOutputs) => {
      if (validateRelOutputRef.current) {
        validateRelOutputRef.current(info);
        relOutputs['setValidateInfoDone'](info);
        debounceValidateTrigger(parentSlot, { id: props.id, name: props.name, validateInfo: info });
      }
    });

    // 设置自动聚集
    inputs['setAutoFocus']?.((flag: boolean, relOutputs) => {
      setAutoFocus(!!flag);
      !!flag ? inputRef.current?.focus() : null;
      relOutputs['setAutoFocusDone'](!!flag);
    });
  }, []);

  const onValidateTrigger = (type: string) => {
    data.validateTrigger?.includes(type) &&
      debounceValidateTrigger(parentSlot, { id: props.id, name: props.name });
  };

  const changeValue = (val) => {
    setValue(val);
    valueRef.current = val;
    onChangeForFc(parentSlot, { id: props.id, name: props.name, value: val });
  };

  const onChange = (val) => {
    changeValue(val);
    outputs['onChange'](val);
    onValidateTrigger(ValidateTriggerType.OnChange);
  };

  const onBlur = useCallback(
    (e) => {
      onValidateTrigger(ValidateTriggerType.OnBlur);
      outputs['onBlur'](valueRef.current);
    },
    [value]
  );

  const onPressEnter = useCallback(
    (e) => {
      onValidateTrigger(ValidateTriggerType.OnPressEnter);
      outputs['onPressEnter'](valueRef.current);
    },
    [value]
  );

  //数字输入框实时校验位数, 多的小数位禁止输入
  const NumberProps = useMemo(() => {
    return data.isParser
      ? {
          formatter: (value: any) => {
            let reStr = '\\d'.repeat(data.config.precision);
            let reg = value;
            if (data.isPrecision) {
              if (data.config.precision === 0) {
                reg = `${value}`.replace(/^(\-)*(\d+)\.().*$/, '$1$2');
              } else {
                reg = `${value}`.replace(eval('/^(\\-)*(\\d+)\\.(' + reStr + ').*$/'), '$1$2.$3');
              }
            }
            if (reg !== '') {
              if (data.useGrouping) {
                reg = reg.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              }
              if (data.isFormatter && data.charPostion === 'suffix') {
                reg = `${reg}${data.character}`;
              }
              if (data.isFormatter && data.charPostion === 'prefix') {
                reg = `${data.character}${reg}`;
              }
            }
            return reg;
          }
        }
      : {};
  }, [value, data.character, data.isFormatter, data.useGrouping, data.isParser]);

  //转换回数字的方式
  const ParserProps = useMemo(() => {
    return data.isParser
      ? {
          parser: (value: any) => {
            if (data.isFormatter) {
              let parser = value.replace(`${data.character}`, '');
              if (data.useGrouping) {
                parser = parser!.replace(/\$\s?|(,*)/g, '');
              }
              return parser;
            } else {
              if (data.useGrouping) {
                return value!.replace(/\$\s?|(,*)/g, '');
              }
              return value;
            }
          }
        }
      : {};
  }, [value, data.character, data.isFormatter, data.useGrouping, data.isParser]);

  return data.isEditable ? (
    <div className={css.inputNumber}>
      <InputNumber<string | number>
        ref={inputRef}
        value={value}
        {...data.config}
        {...NumberProps}
        {...ParserProps}
        precision={data.isPrecision ? data.config.precision : void 0}
        placeholder={env.i18n(data.config.placeholder)}
        addonBefore={env.i18n(data.config.addonBefore)}
        addonAfter={env.i18n(data.config.addonAfter)}
        autoFocus={autoFocus}
        onChange={onChange}
        onBlur={onBlur}
        onPressEnter={onPressEnter}
        min={data.isMin ? data.min : void 0}
        max={data.isMax ? data.max : void 0}
        controls={false}
      />
    </div>
  ) : (
    <div>{data.config.addonBefore}{value}{data.config.addonAfter}</div>
  );
}
