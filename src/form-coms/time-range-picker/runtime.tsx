import React, { useState, useCallback, useMemo } from 'react';
import { Data } from './types';
import { TimePicker } from 'antd';
import moment, { Moment } from 'moment';
import { validateFormItem } from '../utils/validator';
import { isValidInput, isValidRange } from './util';
import useFormItemInputs from '../form-container/models/FormItem';
import styles from './style.less';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { validateTrigger } from '../form-container/models/validate';
import ConfigProvider from '../../components/ConfigProvider';

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
          outputRels(r);
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

      const startM = isNaN(Number(start)) ? moment(start, _format) : moment(Number(start));
      const endM = isNaN(Number(end)) ? moment(end, _format) : moment(Number(end));
      return [startM, endM];
    },
    [splitChar, _format]
  );

  const setTimestampRange = (val) => {
    try {
      const initValue = formatValue(val) as [Moment, Moment];
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
        validate
      }
    },
    [value]
  );

  const getValue = useCallback(
    (value) => {
      const _value = (value || []).map((val) => {
        if (format === 'timeStamp') return val.endOf('second').valueOf();
        if (format === 'custom') return val.format(customFormat);
        return val.format(format);
      });
      const formatValue = outFormat === 'array' ? _value : _value.join(splitChar);
      return formatValue;
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
          placeholder={placeholder}
          value={value}
          format={_format}
          allowClear
          disabled={disabled}
          onChange={onChange}
          getPopupContainer={(triggerNode: HTMLElement) =>
            edit || debug ? env?.canvasElement : document.body
          }
          open={env.design ? true : void 0}
          popupClassName={id}
        />
      </div>
    </ConfigProvider>
  );
}
