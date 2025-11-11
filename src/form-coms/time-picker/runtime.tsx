import React, { useState, useCallback, useMemo, useRef, useEffect, useLayoutEffect } from 'react';
import { Data } from './types';
import { TimePicker } from 'antd';
import moment, { Moment } from 'moment';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import useFormItemInputs from '../form-container/models/FormItem';
import { debounceValidateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { validateTrigger } from '../form-container/models/validate';
import ConfigProvider from '../../components/ConfigProvider';

import styles from './style.less';
import { InputIds, OutputIds } from '../types';
import { runJs } from '../../../package/com-utils';

const getValidTimeValue = (time: number, step: number | undefined, maxValue: number) => {
  if (!step || step === 1) return time;
  if (step === maxValue) return 0; // 如果步长为最大值，返回0
  const mod = time % step;
  if (mod === 0) return time;
  else return time + (step - mod);
};

export default function ({
  data,
  inputs,
  outputs,
  env,
  id,
  parentSlot,
  name,
  onError
}: RuntimeParams<Data>) {
  const { placeholder, disabled, format, customFormat } = data;
  const [value, setValue] = useState<Moment | null>();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const validateRelOutputRef = useRef<any>(null);
  const valueRef = useRef<any>();

  // 以下字段均为了该需求：第一次focus时将时间改为当前时间，并在blur时重置回原来的值
  const [isFocused, setIsFocused] = useState(false);
  const [isFirstChange, setIsFirstChange] = useState(false);
  const [focusedValue, setFocusedValue] = useState<Moment | null>();

  const validate = useCallback(
    (model, outputRels) => {
      validateFormItem({
        value: valueRef.current?.valueOf(),
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
            outputs[OutputIds.OnValidate](getValue(valueRef.current));
          } else {
            outputRels(r);
            debounceValidateTrigger(parentSlot, { id, name, validateInfo: r });
          }
        })
        .catch((e) => {
          outputRels(e);
          debounceValidateTrigger(parentSlot, { id, name, validateInfo: e });
        });
    },
    [value]
  );

  const { edit, runtime } = env;
  const debug = !!(runtime && runtime.debug);

  const _format = useMemo(() => {
    if (format === 'custom') return customFormat;
    if (format === 'timeStamp') return 'HH:mm:ss';
    return format;
  }, [format, customFormat]);

  const setTimestamp = useCallback(
    (val) => {
      try {
        if (!val) {
          changeValue(val);
          return;
        }
        let formatVal: Moment;
        if (isNaN(Number(val))) {
          formatVal = moment(val, _format);
        } else {
          formatVal = moment(Number(val));
        }
        if (!formatVal.isValid()) throw Error('params error');
        changeValue(formatVal);
      } catch (error) {
        onError('时间数据格式错误');
      }
    },
    [_format]
  );

  const transCalculation = (val) => {
    if (!val) return val;
    if (format === 'timeStamp') return val.format('HH:mm:ss');
    if (format === 'custom') return val.format(customFormat);
    return val.format(format);
  };

  useFormItemInputs(
    {
      id,
      name,
      inputs,
      outputs,
      configs: {
        setValue: setTimestamp,
        setInitialValue: setTimestamp,
        returnValue(output) {
          output(getValue(valueRef.current));
        },
        resetValue() {
          changeValue(void 0);
        },
        setDisabled() {
          data.disabled = true;
        },
        setEnabled() {
          data.disabled = false;
        },
        setIsEnabled(val) {
          if (val === true) {
            data.disabled = false;
          } else if (val === false) {
            data.disabled = true;
          }
        },
        setIsEditable(val) {
          data.isEditable = val;
        },
        validate
      }
    },
    [value]
  );
  useEffect(() => {
    // 设置校验状态
    inputs[InputIds.SetValidateInfo]((info: object, relOutputs) => {
      if (validateRelOutputRef.current) {
        validateRelOutputRef.current(info);
        relOutputs['setValidateInfoDone'](info);
        debounceValidateTrigger(parentSlot, { id, name, validateInfo: info });
      }
    });
  });

  useLayoutEffect(() => {
    inputs[InputIds.SetColor]((color: string, relOutputs) => {
      const target = wrapperRef.current?.querySelector?.('input');
      if (target) {
        target.style.color = typeof color === 'string' ? color : '';
      }
      relOutputs['setColorDone'](color);
    });
  }, []);

  const getValue = useCallback(
    (value) => {
      if (!value) return value;
      if (format === 'timeStamp') return value.endOf('second').valueOf();
      if (format === 'custom') return value.format(customFormat);
      return value.format(format);
    },
    [format, customFormat]
  );

  const changeValue = (time: Moment | null | undefined) => {
    setValue(time);
    valueRef.current = time;
    const value = getValue(time);
    onChangeForFc(parentSlot, { id, name, value });
    return value;
  };
  const onChange = (time: Moment | null, timeString: string) => {
    if (!isFirstChange) setIsFirstChange(true);
    const value = changeValue(time);
    outputs['onChange'](value);
    validateTrigger(parentSlot, { id, name });
  };

  const getDefaultValue = useCallback(() => {
    // 注意不能直接设置默认值，要根据设置的步长来进行设置，保证默认值都处于可选中状态
    const { hourStep, minuteStep, secondStep } = data.config;
    const now = moment();
    const hour = getValidTimeValue(now.hour(), hourStep, 24);
    const minute = getValidTimeValue(now.minute(), minuteStep, 60);
    const second = getValidTimeValue(now.second(), secondStep, 60);
    const time = moment(`${hour}:${minute}:${second}`, data.format);
    return time;
  }, [data.config, data.format]);

  const onFocus = useCallback(() => {
    if (!isFocused) {
      changeValue(getDefaultValue());
      setFocusedValue(value);
    }
    setIsFocused(true);
  }, [isFocused, getDefaultValue, value]);

  const onBlur = useCallback(() => {
    if (!isFirstChange) {
      changeValue(focusedValue);
    }
  }, [isFirstChange, focusedValue]);

  return (
    <ConfigProvider locale={env.vars?.locale}>
      {data.isEditable ? (
        <div ref={wrapperRef} className={styles.timePicker}>
          <TimePicker
            {...data.config}
            placeholder={env.i18n(placeholder)}
            value={value}
            format={_format}
            disabled={disabled}
            inputReadOnly={data.inputReadOnly}
            allowClear
            showNow={data.showNow}
            // defaultValue={getDefaultValue()}
            getPopupContainer={(triggerNode: HTMLElement) => env?.canvasElement || document.body}
            open={env.design ? true : void 0}
            popupClassName={id + ' ' + styles.timePickerPopup}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            disabledTime={() => {
              const res: any = {
                disabledHours: undefined,
                disabledMinutes: undefined,
                disabledSeconds: undefined
              };

              if (data.disabledTimeRules?.[0]?.status) {
                res.disabledHours = runJs(data.disabledTimeRules[0].validateCode);
              }
              if (data.disabledTimeRules?.[1]?.status) {
                res.disabledMinutes = runJs(data.disabledTimeRules[1].validateCode);
              }
              if (data.disabledTimeRules?.[2]?.status) {
                res.disabledSeconds = runJs(data.disabledTimeRules[2].validateCode);
              }

              return res;
            }}
          />
        </div>
      ) : (
        transCalculation(value)
      )}
    </ConfigProvider>
  );
}
