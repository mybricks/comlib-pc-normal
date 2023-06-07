import React, { useState, useCallback, useMemo } from 'react';
import { Data } from './types';
import { message, TimePicker } from 'antd';
import moment, { Moment, isMoment } from 'moment';
import { validateFormItem } from '../utils/validator';
import useFormItemInputs from '../form-container/models/FormItem';
import { onChange as onChangeForFc } from '../form-container/models/onChange';

import styles from './style.less';

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
  name
}: RuntimeParams<Data>) {
  const { placeholder, disabled, format, customFormat } = data;
  const [value, setValue] = useState<Moment | undefined>();
  const validate = useCallback(
    (output) => {
      validateFormItem({
        value: value?.valueOf(),
        env,
        rules: data.rules
      })
        .then((r) => {
          output(r);
        })
        .catch((e) => {
          output(e);
        });
    },
    [value]
  );

  const setTimestamp = (val) => {
    if (!val) {
      setValue(void 0);
      return;
    }
    if (isNumber(val)) {
      setValue(moment(val));
      return;
    }
    //兼容moment
    if (isMoment(val)) {
      setValue(val);
      return;
    }
    message.error('输入数据是时间戳或者moment对象');
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
      if (format === 'timeStamp') return value.endOf('second').valueOf();
      if (format === 'custom') return value.format(customFormat);
      return value.format(format);
    },
    [format, customFormat]
  );

  const onChange = (time, timeString: string) => {
    setValue(time);
    const value = getValue(time);
    onChangeForFc(parentSlot, { id, name, value });
    outputs['onChange'](value);
  };

  const _format = useMemo(() => {
    if (format === 'custom') return customFormat;
    if (format === 'timeStamp') return 'HH:mm:ss';
    return format;
  }, [format, customFormat]);

  return (
    <div className={styles.wrap}>
      <TimePicker
        placeholder={placeholder}
        value={value}
        format={_format}
        disabled={disabled}
        allowClear
        onChange={onChange}
      />
    </div>
  );
}
