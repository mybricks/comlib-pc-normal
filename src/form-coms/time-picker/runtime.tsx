import React, { useState, useCallback } from 'react';
import { Data } from './types';
import { message, TimePicker } from 'antd';
import moment, { Moment, isMoment } from 'moment';
import { validateFormItem } from '../utils/validator';
import styles from './style.less';

function isNumber(input) {
  return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
}

export default function ({ data, inputs, outputs, env }: RuntimeParams<Data>) {
  const { placeholder, disabled } = data;
  const [value, setValue] = useState<Moment>();
  const validate = useCallback(
    (val, outputRels) => {
      validateFormItem({
        value: value?.valueOf(),
        env,
        rules: data.rules
      })
        .then((r) => {
          outputRels['returnValidate'](r);
        })
        .catch((e) => {
          outputRels['returnValidate'](e);
        });
    },
    [value]
  );

  inputs['setValue']((val: number) => {
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
  });

  inputs['getValue']((_, outputRels) => {
    outputRels['returnValue'](getValue());
  });

  inputs['resetValue'](() => {
    setValue(void 0);
  });

  inputs['setDisabled'](() => {
    data.disabled = true;
  });

  inputs['setEnabled'](() => {
    data.disabled = false;
  });

  inputs['validate'](validate);

  const getValue = useCallback(() => value?.valueOf(), [value]);

  const onChange = (time, timeString: string) => {
    setValue(time);
    outputs['onChange'](time.valueOf());
  };
  return (
    <div className={styles.wrap}>
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
