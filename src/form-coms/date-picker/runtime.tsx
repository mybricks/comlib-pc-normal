import React, { useLayoutEffect, useState } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import { validateFormItem } from '../utils/validator';
import css from './runtime.less';

export interface Data {
  options: any[];
  rules: any[];
  showTime: Record<string, unknown> | boolean;
  contentType: string;
  formatter: string;
  config: {
    disabled: boolean;
    placeholder: string;
    picker: 'date' | 'week' | 'month' | 'quarter' | 'year' | undefined;
  };
}

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, inputs, outputs, env } = props;
  const [value, setValue] = useState();

  //输出数据变形函数
  const transCalculation = (val, type, props) => {
    let transValue;
    switch (type) {
      //1. 年-月-日 时:分:秒
      case 'Y-MM-DD HH:mm:ss':
        transValue = moment(val).format('YYYY-MM-DD HH:mm:ss');
        break;
      //2. 年-月-日 时:分
      case 'Y-MM-DD HH:mm':
        transValue = moment(val).format('Y-MM-DD HH:mm');
        break;
      //3. 年-月-日
      case 'Y-MM-DD':
        transValue = moment(val).format('Y-MM-DD');
        break;
      //4. 年-月
      case 'Y-MM':
        transValue = moment(val).format('Y-MM');
        break;
      //5. 年
      case 'Y':
        transValue = moment(val).format('Y');
        break;
      //6. 时间戳
      case 'timeStamp':
        transValue = Number(val);
        break;
      //7. 自定义
      case 'custom':
        let customDate = moment(val).format(props.data.formatter);
        if (customDate.indexOf('Su')) {
          customDate = customDate.replace('Su', '天');
        }
        if (customDate.indexOf('Mo')) {
          customDate = customDate.replace('Mo', '一');
        }
        if (customDate.indexOf('Tu')) {
          customDate = customDate.replace('Tu', '二');
        }
        if (customDate.indexOf('We')) {
          customDate = customDate.replace('We', '三');
        }
        if (customDate.indexOf('Th')) {
          customDate = customDate.replace('Th', '四');
        }
        if (customDate.indexOf('Fr')) {
          customDate = customDate.replace('Fr', '五');
        }
        if (customDate.indexOf('Sa')) {
          customDate = customDate.replace('Sa', '六');
        }
        transValue = customDate;
        break;
    }
    return transValue;
  };

  useLayoutEffect(() => {
    inputs['setValue']((val) => {
      //时间戳转换
      const num = Number(val);
      const result: any = isNaN(num) ? moment(val) : moment(num);
      val = !result?._isValid ? undefined : result;
      setValue(val);
      onChange(val);
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
      let transValue;
      //1.null是从日期选择框不选日期的情况；
      //2.undefined是手动设置值为空或者不正确的情况
      if (value === null || value === undefined) {
        transValue = undefined;
      } else {
        transValue = transCalculation(value, data.contentType, props);
      }
      outputRels['returnValue'](transValue);
    });
  }, [value]);

  //重置，
  inputs['resetValue'](() => {
    setValue(void 0);
  });
  //设置禁用
  inputs['setDisabled'](() => {
    data.config.disabled = true;
  });
  //设置启用
  inputs['setEnabled'](() => {
    data.config.disabled = false;
  });

  const onChange = (value) => {
    //自定义转换
    let transValue;
    if (value === null || value === undefined) {
      transValue = undefined;
    } else {
      transValue = transCalculation(value, data.contentType, props);
    }
    setValue(value);
    outputs['onChange'](transValue);
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
    <div className={css.datePicker}>
      <DatePicker value={value} {...data.config} showTime={getShowTime()} onChange={onChange} />
    </div>
  );
}
