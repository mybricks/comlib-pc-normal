import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Data } from './types';
import { TimePicker } from 'antd';
import moment, { Moment } from 'moment';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import { isValidInput, isValidRange, isDefaultInput } from './util';
import useFormItemInputs from '../form-container/models/FormItem';
import styles from './style.less';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { validateTrigger } from '../form-container/models/validate';
import ConfigProvider from '../../components/ConfigProvider';
import { InputIds, OutputIds } from '../types';

export default function ({
  data,
  inputs,
  outputs,
  env,
  parentSlot,
  id,
  name,
  onError
}: RuntimeParams<Data>) {
  const { placeholder, disabled, format, customFormat, outFormat, splitChar } = data;
  const [value, setValue] = useState<[Moment, Moment]>();
  const validateRelOuputRef = useRef<any>(null);

  const _format = useMemo(() => {
    if (format === 'custom') return customFormat;
    if (format === 'timeStamp') return 'HH:mm:ss';
    return format;
  }, [format, customFormat]);

  const validate = useCallback(
    (model, outputRels) => {
      validateFormItem({
        value: value ? [value[0].valueOf(), value[1].valueOf()] : [],
        env,
        model,
        rules: data.rules
      })
        .then((r) => {
          const cutomRule = (data.rules || defaultRules).find(
            (i) => i.key === RuleKeys.CUSTOM_EVENT
          );
          if (cutomRule?.status) {
            validateRelOuputRef.current = outputRels;
            outputs[OutputIds.OnValidate](getValue(value));
          } else {
            outputRels(r);
          }
        })
        .catch((e) => {
          outputRels(e);
        });
    },
    [value]
  );
  const { edit, runtime } = env;
  const debug = !!(runtime && runtime.debug);

  const formatValue = useCallback(
    (val) => {
      let start, end;
      if (typeof val === 'string' && val.includes(splitChar)) {
        [start, end] = val.split(splitChar);
      }
      if (Array.isArray(val)) {
        if (!val.length) return [];
        if (!isValidInput(val)) {
          onError('时间范围值是一个长度为2的数组');
          return [];
        }
        [start, end] = val;
      }
      const startM =
        start === null || start === undefined
          ? start
          : isNaN(Number(start))
          ? moment(start, _format)
          : moment(Number(start));
      const endM =
        end === null || end === undefined
          ? end
          : isNaN(Number(end))
          ? moment(end, _format)
          : moment(Number(end));
      return [startM, endM];
    },
    [splitChar, _format]
  );

  const setTimestampRange = (val) => {
    try {
      const initValue = formatValue(val) as [Moment, Moment];
      if (val === null || val === undefined) {
        setValue(val);
        return;
      }
      if (isDefaultInput(initValue)) {
        setValue(initValue);
      }
      if (!isValidInput(initValue)) {
        setValue(initValue);
        return;
      }
      if (isValidRange(initValue, 'moment')) {
        setValue(initValue);
      } else {
        onError('开始时间必须小于结束时间');
      }
    } catch (error) {
      onError('时间范围数据格式错误');
    }
  };

  useFormItemInputs(
    {
      id,
      name,
      inputs,
      outputs,
      configs: {
        setValue: setTimestampRange,
        setInitialValue: setTimestampRange,
        returnValue(output) {
          output(getValue(value));
        },
        resetValue() {
          setValue(void 0);
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
        validate
      }
    },
    [value]
  );
  useEffect(() => {
    // 设置校验状态
    inputs[InputIds.SetValidateInfo]((info: object, relOutputs) => {
      if (validateRelOuputRef.current) {
        validateRelOuputRef.current(info);
        relOutputs['setValidateInfoDone'](info);
      }
    });
  }, []);

  const getValue = useCallback(
    (value) => {
      if (value === undefined || value === null) {
        return value;
      } else if (isDefaultInput(value)) {
        return value;
      } else {
        const _value = (value || []).map((val) => {
          if (format === 'timeStamp') return val.endOf('second').valueOf();
          if (format === 'custom') return val.format(customFormat);
          return val.format(format);
        });
        const formatValue = outFormat === 'array' ? _value : _value.join(splitChar);
        return formatValue;
      }
    },
    [outFormat, splitChar, format, customFormat]
  );

  const onChange = useCallback(
    (values, formatString: [string, string]) => {
      setValue(values);
      const formatValue = getValue(values);
      onChangeForFc(parentSlot, { id, name, value: formatValue });
      outputs['onChange'](formatValue);
      validateTrigger(parentSlot, { id, name });
    },
    [outFormat, splitChar]
  );

  return (
    <ConfigProvider locale={env.vars?.locale}>
      <div className={styles.wrap}>
        <TimePicker.RangePicker
          placeholder={[env.i18n(placeholder[0]), env.i18n(placeholder[1])]}
          value={value}
          format={_format}
          allowClear
          disabled={disabled}
          onChange={onChange}
          getPopupContainer={(triggerNode: HTMLElement) => env?.canvasElement || document.body}
          open={env.design ? true : void 0}
          popupClassName={id}
        />
      </div>
    </ConfigProvider>
  );
}
