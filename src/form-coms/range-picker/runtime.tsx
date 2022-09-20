import React, { useLayoutEffect, useState } from 'react';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { validateFormItem } from '../utils/validator';
import css from './runtime.less';

const { RangePicker } = DatePicker;

interface Data {
  rules: any[];
  visible: boolean;
  showTime: Record<string, unknown> | boolean;
  config: {
    disabled: boolean;
    placeholder: undefined | [string, string];
    picker: 'date' | 'week' | 'month' | 'quarter' | 'year' | undefined;
  };
}

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, inputs, outputs, env } = props;
  const [value, setValue] = useState();

  useLayoutEffect(() => {
    //设置值
    inputs['setValue']((val) => {
      //时间戳转换
      if (val && Array.isArray(val)) {
        val = val.map((item) => moment(item));
        setValue(val);
        outputs['onChange'](value);
      }
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

  //重置
  inputs['resetValue'](() => {
    setValue(void 0);
  });
  //显隐
  inputs['setVisible']((val: boolean) => {
    data.visible = val;
  });
  // //设置禁用
  inputs['setDisabled']((val: boolean) => {
    data.config.disabled = val;
  });

  const onChange = (value) => {
    setValue(value);
    outputs['onChange'](value);
  };

  const getShowTime = () => {
    if (!data.showTime || typeof data.showTime === 'boolean') {
      return data.showTime;
    }
    return {
      defaultValue: Array.isArray(data.showTime?.defaultValue)
        ? data.showTime?.defaultValue.map((item) => moment(item, 'HH:mm:ss'))
        : undefined
    };
  };

  return (
    data.visible && (
      <div className={css.rangePicker}>
        <RangePicker value={value} {...data.config} showTime={getShowTime()} onChange={onChange} />
      </div>
    )
  );
}
