import React, { useState, useCallback, useMemo } from 'react';
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
  parentSlot,
  id,
  name,
  onError
}: RuntimeParams<Data>) {
  const { placeholder, disabled, format, customFormat, outFormat, splitChar } = data;
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
  const { edit, runtime } = env;
  const debug = !!(runtime && runtime.debug);

  const setTimestampRange = (val) => {
    if (Array.isArray(val) && !val.length) {
      setValue([] as unknown as [Moment, Moment]);
      return;
    }
    if (typeof val === 'string') {
      if (val.includes(splitChar)) {
        const [start, end] = val.split(splitChar);
        setValue([moment(Number(start)), moment(Number(end))]);
      } else {
        onError('时间数据格式错误');
      }
      return;
    }
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
    },
    [outFormat, splitChar]
  );

  const _format = useMemo(() => {
    if (format === 'custom') return customFormat;
    if (format === 'timeStamp') return 'HH:mm:ss';
    return format;
  }, [format, customFormat]);

  return (
    <div className={styles.wrap}>
      <TimePicker.RangePicker
        placeholder={placeholder}
        value={value}
        format={_format}
        allowClear
        disabled={disabled}
        onChange={onChange}
        getPopupContainer={(triggerNode: HTMLElement) =>
          edit || debug ? triggerNode : document.body
        }
        dropdownClassName={id}
      />
    </div>
  );
}
