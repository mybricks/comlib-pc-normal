import React, { useLayoutEffect, useState } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import { validateFormItem } from '../utils/validator';

interface Data {
  options: any[];
  rules: any[];
  visible: boolean;
  showTime: Record<string, unknown> | boolean;
  config: {
    disabled: boolean;
    placeholder: string;
    picker: 'date' | 'week' | 'month' | 'quarter' | 'year' | undefined;
  };
}

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, inputs, outputs, env } = props;
  const [value, setValue] = useState();

  useLayoutEffect(() => {
    inputs['setValue']((val) => {
      //时间戳转换
      const num = Number(val);
      const result: any = isNaN(num) ? moment(val) : moment(num);
      val = !result?._isValid ? undefined : result;

      setValue(val);
    });

    inputs['validate']((val, outputRels) => {
      validateFormItem({
        value: value,
        env,
        rules: data.rules
      })
        .then((r) => {
          outputRels['returnValidate'](r);
        })
        .catch((e) => {
          outputRels['returnValidate'](e);
        });
    });

    inputs['getValue']((val, outputRels) => {
      outputRels['returnValue'](value);
    });
  }, [value]);

  //重置，
  inputs['resetValue'](() => {
    setValue(void 0);
  });
  //显隐，这里不起作用
  inputs['setVisible']((val: boolean) => {
    data.visible = val;
  });
  //设置禁用
  inputs['setDisabled']((val: boolean) => {
    data.config.disabled = val;
  });

  const onChange = (value) => {
    //时间戳转换
    const num = Number(value);
    const result: any = isNaN(num) ? moment(value) : moment(num);
    value = !result?._isValid ? undefined : result;

    setValue(value);
    outputs['onChange'](value);
  };

  const getShowTime = () => {
    if (!data.showTime || typeof data.showTime === 'boolean') {
      return data.showTime;
    }
    return {
      defaultValue:
        typeof data.showTime?.defaultValue === 'string'
          ? moment(data.showTime.defaultValue, 'HH:mm:ss')
          : undefined
    };
  };

  return (
    <div>
      <DatePicker value={value} {...data.config} showTime={getShowTime()} onChange={onChange} />
    </div>
  );
}
