import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { InputNumber, InputNumberProps, InputRef, Popover } from 'antd';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import css from './runtime.less';
import useFormItemInputs from '../form-container/models/FormItem';
import { debounceValidateTrigger } from '../form-container/models/validate';
import { ValidateTriggerType } from '../types';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { inputIds, outputIds } from '../form-container/constants';
import { formatNumberWithChineseUnits } from '../../utils/formatNumber';
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
  setAutoFocus: boolean;
  isPrecisionReadonlyMode: boolean;
  useGroupingReadonlyMode: boolean;
  precisionReadonlyMode: number;
}

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, inputs, outputs, env, parentSlot } = props;
  const [value, setValue] = useState<string | number>();
  const validateRelOutputRef = useRef<any>(null);
  const inputRef = useRef<InputRef>(null);
  const valueRef = useRef<any>();
  const [autoFocus, setAutoFocus] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const [placeholder, setPlaceholder] = useState(data.config.placeholder);

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
    if (data.setAutoFocus) {
      inputRef.current?.focus();
    }

    inputs['setPlaceholder'] && inputs['setPlaceholder']((val, relOutputs) => {
      setPlaceholder(val);
      relOutputs['setPlaceholderDone'](val);
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
            let reStr = '\\d'.repeat(data.config.precision || 0);
            let reg = value;
            if (data.isPrecision) {
              if (data.config.precision === 0) {
                reg = `${value}`.replace(/^(\-)*(\d+)\.().*$/, '$1$2');
              } else {
                reg = `${value}`.replace(eval('/^(\\-)*(\\d+)\\.(' + reStr + ').*$/'), '$1$2.$3');
                // reg = `${value ? Number(value).toFixed(data.config.precision) : value}`.replace(eval('/^(\\-)*(\\d+)\\.(' + reStr + ').*$/'), '$1$2.$3');
              }
            }
            if (reg !== '') {
              if (data.useGrouping) {
                const [integer, decimal] = reg.split('.');
                reg = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (decimal ? `.${decimal}` : '');
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

  const getReadonlyValue = useCallback(() => {
    if (value === undefined || value === null || value === '' || Number.isNaN(value)) return value;
    let reStr = '\\d'.repeat(data.precisionReadonlyMode ?? 0);
    let reg = value || '0';
    if (data.isPrecisionReadonlyMode) {
      // 这里与NumberProps中的处理方式存在差异，这里会先进行保留计算（NumberProps中只需限制位数，所以不需要考虑四舍五入）
      if (data.precisionReadonlyMode === 0 || !data.precisionReadonlyMode) {
        reg = `${Number(value).toFixed(data.precisionReadonlyMode)}`.replace(/^(\-)*(\d+)\.().*$/, '$1$2');
      } else {
        reg = `${Number(value).toFixed(data.precisionReadonlyMode)}`.replace(eval('/^(\\-)*(\\d+)\\.(' + reStr + ').*$/'), '$1$2.$3');
      }
    }
    if (reg) {
      if (data.useGroupingReadonlyMode) {
        const [integer, decimal] = reg.toString().split('.');
        reg = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (decimal ? `.${decimal}` : '');
      }
    }
    return reg;
  }, [value, data.useGroupingReadonlyMode]);

  //转换回数字的方式
  const ParserProps = useMemo(() => {
    return data.isParser
      ? {
          parser: (value: any) => {
            if (data.isFormatter) {
              let parser = value.replace(`${data.character}`, '');
              if (data.useGrouping) {
                parser = parser!.replace(/\$\s?|(,*)/g, '')
              }
              return parser;
            } else {
              if (data.useGrouping) {
                return value!.replace(/\$\s?|(,*)/g, '')
              }
              return value;
            }
          }
        }
      : {};
  }, [value, data.character, data.isFormatter, data.useGrouping, data.isParser]);

  const formatterNumber = useMemo(() => {
    if (!value || Number(value) < 10000) return '';
    const parser = (v) => {
      if (!data.isParser) return v;
      let reStr = '\\d'.repeat(data.config.precision || 0);
      let reg = v;
      if (data.isPrecision) {
        if (data.config.precision === 0) {
          reg = `${v}`.replace(/^(\-)*(\d+)\.().*$/, '$1$2');
        } else {
          reg = `${v}`.replace(eval('/^(\\-)*(\\d+)\\.(' + reStr + ').*$/'), '$1$2.$3');
          // reg = `${v ? Number(v).toFixed(data.config.precision) : v}`.replace(eval('/^(\\-)*(\\d+)\\.(' + reStr + ').*$/'), '$1$2.$3');
        }
      }
      return reg;
    }
    return formatNumberWithChineseUnits(parser(value));
  }, [value]);

  const onMouseOver = useCallback(() => {
    setOpenPopover(true);
  }, []);

  const onMouseOut = useCallback(() => {
    setOpenPopover(false);
  }, []);

  return data.isEditable ? (
    <Popover
      content={formatterNumber}
      open={formatterNumber !== '' && openPopover}
      placement="bottom"
      trigger="hover"
    >
      <div className={css.inputNumber} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
        <InputNumber<string | number>
          ref={inputRef}
          value={value}
          {...data.config}
          {...NumberProps}
          {...ParserProps}
          precision={data.isPrecision ? data.config.precision : void 0}
          placeholder={env.i18n(placeholder)}
          addonBefore={env.i18n(data.config.addonBefore)}
          addonAfter={env.i18n(data.config.addonAfter)}
          autoFocus={autoFocus}
          onChange={onChange}
          onBlur={onBlur}
          onPressEnter={onPressEnter}
          min={data.isMin ? data.min : void 0}
          max={data.isMax ? data.max : void 0}
          controls={data.isControl}
        />
      </div>
    </Popover>
  ) : (
    <div className="input-number-readonly-content">{env.i18n(data.config.addonBefore)}{getReadonlyValue()}{env.i18n(data.config.addonAfter)}</div>
  );
}
