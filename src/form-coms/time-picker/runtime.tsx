import React, { useState, useCallback } from 'react';
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
  style,
  id,
  parentSlot,
  name
}: RuntimeParams<Data>) {
  const { placeholder, disabled } = data;
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
          output(getValue());
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

  const getValue = useCallback(() => value?.valueOf(), [value]);

  const onChange = (time, timeString: string) => {
    setValue(time);
    onChangeForFc(parentSlot, { id, name, value: time.valueOf() });
    outputs['onChange'](time.valueOf());
  };
  return (
    <div className={styles.wrap} style={style}>
      <TimePicker
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        allowClear
        onChange={onChange}
      />
    </div>
  );
}
