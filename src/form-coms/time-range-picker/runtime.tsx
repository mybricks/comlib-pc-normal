import React, { useState, useCallback } from 'react';
import { Data } from './types';
import { message, TimePicker } from 'antd';
import moment, { Moment, isMoment } from 'moment';
import { validateFormItem } from '../utils/validator';
import { isValidInput, isNumber, isValidRange } from './util';
import useFormItemInputs from '../form-container/models/FormItem';
import styles from './style.less';
import { onChange as onChangeForFc } from '../form-container/models/onChange';

export default function ({
  data,
  inputs,
  outputs,
  env,
  style,
  parentSlot,
  id,
  name
}: RuntimeParams<Data>) {
  const { placeholder, disabled } = data;
  const [value, setValue] = useState<[Moment, Moment]>();
  const validate = useCallback(
    (output) => {
      validateFormItem({
        value: value ? [value[0].valueOf(), value[1].valueOf()] : [],
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

  const setTimestampRange = (val) => {
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
        if (isValidRange(val, 'moment')) {
          setValue(val as unknown as [Moment, Moment]);
        } else {
          message.error('开始时间必须小于结束时间');
        }
        return;
      }
    }
    message.error('输入数据是时间戳数组或者moment对象数组，长度为0或2');
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

  const getValue = useCallback(
    () => (value ? [value[0].valueOf(), value[1].valueOf()] : []),
    [value]
  );

  const onChange = (values, formatString: [string, string]) => {
    setValue(values);
    onChangeForFc(parentSlot, { id, name, value: [values[0].valueOf(), values[1].valueOf()] });
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
