import React, { useState, useCallback, useMemo } from 'react';
import { Data } from './types';
import { TimePicker } from 'antd';
import moment, { Moment } from 'moment';
import { validateFormItem } from '../utils/validator';
import useFormItemInputs from '../form-container/models/FormItem';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { validateTrigger } from '../form-container/models/validate';
import ConfigProvider from '../../components/ConfigProvider';

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
  name,
  onError
}: RuntimeParams<Data>) {
  const { placeholder, disabled, format, customFormat } = data;
  const [value, setValue] = useState<Moment | null>();
  const validate = useCallback(
    (model, outputRels) => {
      validateFormItem({
        value: value?.valueOf(),
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

  const _format = useMemo(() => {
    if (format === 'custom') return customFormat;
    if (format === 'timeStamp') return 'HH:mm:ss';
    return format;
  }, [format, customFormat]);

  const setTimestamp = useCallback(
    (val) => {
      try {
        if (!val) {
          setValue(void 0);
          return;
        }
        let formatVal: Moment;
        if (isNaN(Number(val))) {
          formatVal = moment(val, _format);
        } else {
          formatVal = moment(Number(val));
        }
        if (!formatVal.isValid()) throw Error('params error');
        setValue(formatVal);
      } catch (error) {
        onError('时间数据格式错误');
      }
    },
    [_format]
  );

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
      if (!value) return value;
      if (format === 'timeStamp') return value.endOf('second').valueOf();
      if (format === 'custom') return value.format(customFormat);
      return value.format(format);
    },
    [format, customFormat]
  );

  const onChange = (time: Moment | null, timeString: string) => {
    setValue(time);
    const value = getValue(time);
    onChangeForFc(parentSlot, { id, name, value });
    outputs['onChange'](value);
    validateTrigger(parentSlot, { id, name });
  };

  return (
    <ConfigProvider locale={env.vars?.locale}>
      <div className={styles.wrap}>
        <TimePicker
          placeholder={placeholder}
          value={value}
          format={_format}
          disabled={disabled}
          allowClear
          getPopupContainer={(triggerNode: HTMLElement) =>
            edit || debug ? env?.canvasElement : document.body
          }
          open={env.design ? true : void 0}
          popupClassName={id}
          onChange={onChange}
        />
      </div>
    </ConfigProvider>
  );
}
