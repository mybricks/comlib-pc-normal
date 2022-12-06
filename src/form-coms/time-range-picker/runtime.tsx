import React, { useState, useCallback } from 'react';
import { Data } from './types';
import { message, TimePicker } from 'antd';
import moment, { Moment, isMoment } from 'moment';
import { validateFormItem } from '../utils/validator';
import { isValidInput, isNumber, isValidRange } from './util';
import styles from './style.less';

export default function ({ data, inputs, outputs, env, style }: RuntimeParams<Data>) {
  const { placeholder, disabled } = data;
  const [value, setValue] = useState<[Moment, Moment]>();
  const validate = useCallback(
    (val, outputRels) => {
      validateFormItem({
        value: value ? [value[0].valueOf(), value[1].valueOf()] : [],
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

  inputs['setValue']((val: [number, number]) => {
    if (Array.isArray(val) && !val.length) return;
    if (isValidInput(val)) {
      if (val.every((item) => isNumber(item))) {
        if (isValidRange(val, 'number')) {
          setValue([moment(val[0]), moment(val[1])]);
        } else {
          message.error('开始时间必须小于结束时间');
        }
        return;
      }
      //兼容moment
      if (val.every((item) => isMoment(item))) {
        console.log('isMoment array');
        if (isValidRange(val, 'moment')) {
          setValue(val as unknown as [Moment, Moment]);
        } else {
          message.error('开始时间必须小于结束时间');
        }
        return;
      }
    }
    message.error('输入数据是时间戳数组或者moment对象数组，长度为0或2');
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

  const getValue = useCallback(
    () => (value ? [value[0].valueOf(), value[1].valueOf()] : []),
    [value]
  );

  const onChange = (values, formatString: [string, string]) => {
    setValue(values);
    outputs['onChange']([values[0].valueOf(), values[1].valueOf()]);
  };
  return (
    <div className={styles.wrap} style={style}>
      <TimePicker.RangePicker
        placeholder={placeholder}
        value={value}
        allowClear
        disabled={disabled}
        onChange={onChange}
      />
    </div>
  );
}
