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

function isNumber(input) {
  return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
}

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
    const value = changeValue(time);
    outputs['onChange'](value);
    validateTrigger(parentSlot, { id, name });
  };

  const getDefaultValue = () => {
    const getValidTimeValue = (time: number, step: number) => {
      if (!step || step === 1) return time;
      const mod = time % step;
      if (mod === 0) return time;
      else return time + (step - mod);
    };
    // 注意不能直接设置默认值，要根据设置的步长来进行设置，保证默认值都处于可选中状态
    const { hourStep, minuteStep, secondStep } = data.config;
    const now = moment();
    const hour = getValidTimeValue(now.hour(), hourStep);
    const minute = getValidTimeValue(now.minute(), minuteStep);
    const second = getValidTimeValue(now.second(), secondStep);
    return moment(`${hour}:${minute}:${second}`, 'hh:mm:ss');
  };

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
            defaultValue={getDefaultValue()}
            getPopupContainer={(triggerNode: HTMLElement) => env?.canvasElement || document.body}
            // open={env.design ? true : void 0}
            open={true}
            popupClassName={id + ' ' + styles.timePickerPopup}
            onChange={onChange}
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
