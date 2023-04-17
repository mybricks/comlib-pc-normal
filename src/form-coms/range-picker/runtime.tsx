import React, { useLayoutEffect, useState } from 'react';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { validateFormItem } from '../utils/validator';
import css from './runtime.less';
import { OutputIds, TimeDateLimitItem } from '../types';
import { validateTrigger } from '../form-container/models/validate';
import { getDisabledDateTime } from './getDisabledDateTime';
import { onChange as onChangeForFc } from '../form-container/models/onChange';

const { RangePicker } = DatePicker;

export interface Data {
  rules: any[];
  showTime: Record<string, unknown> | boolean;
  contentType: string;
  formatter: string;
  useDisabledDate: 'dafault' | 'static';
  useDisabledTime: 'dafault' | 'static';
  staticDisabledDate: TimeDateLimitItem[];
  staticDisabledTime: TimeDateLimitItem[];
  timeTemplate?: string[];
  useRanges: boolean;
  ranges: any[];
  config: {
    disabled: boolean;
    placeholder: undefined | [string, string];
    picker: 'date' | 'week' | 'month' | 'quarter' | 'year' | undefined;
  };
}

export const DateType = {
  Second: 'second',
  Minute: 'minute',
  Hour: 'hour',
  Day: 'day',
  Week: 'week',
  Month: 'month',
  Year: 'year'
};

export const formatRangeOptions = (list, env: Env) => {
  let res = {};
  if (Array.isArray(list)) {
    list.forEach((item) => {
      const { title, type, numList, value, label } = item || {};
      if (numList) {
        const [num1, num2] = numList;
        const startDate = moment().add(-num1, type).startOf(type);
        const endDate = moment().add(num2, type).endOf(type);
        res[title] = [startDate, endDate];
      }
      if (value && Array.isArray(value)) {
        res[label] = value.map((item) => moment(item));
      }
    });
  }
  return res;
};

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, inputs, outputs, env, parentSlot, id } = props;
  const [value, setValue] = useState<any>();
  const [dates, setDates] = useState<[Moment | null, Moment | null] | null>(null);
  const rangeOptions = formatRangeOptions(data.ranges || [], env);

  //输出数据变形函数
  const transCalculation = (val, type, props, index) => {
    let transValue;

    // 时间格式化条件：日期选择类型=date + 未开启时间选择
    if (data.config.picker === 'date' && !data.showTime) {
      switch (data.timeTemplate?.[index]) {
        case 'start':
          val = moment(val).startOf(data.config.picker || 'date');
          break;
        case 'end':
          val = moment(val).endOf(data.config.picker || 'date');
          break;
        default:
      }
    }

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
    //设置值
    inputs['setValue']((val) => {
      //时间戳转换
      if (val && Array.isArray(val)) {
        //如果是输入的值不合规范，即会输出[null, null]
        val = val.map((item) => {
          const num = Number(item);
          const result: any = isNaN(num) ? moment(val) : moment(num);
          let data = !result?._isValid ? undefined : result;
          return data;
        });
        setValue(val);
        onChange(val);
      }
    });

    inputs['setInitialValue'] &&
      inputs['setInitialValue']((val) => {
        //时间戳转换
        if (val && Array.isArray(val)) {
          //如果是输入的值不合规范，即会输出[null, null]
          val = val.map((item) => {
            const num = Number(item);
            const result: any = isNaN(num) ? moment(val) : moment(num);
            let data = !result?._isValid ? undefined : result;
            return data;
          });
          setValue(val);
          let transValue;
          if (!Array.isArray(value)) {
            transValue = null;
          } else {
            transValue = value.map((item, index) => {
              return transCalculation(item, data.contentType, props, index);
            });
          }
          outputs[OutputIds.OnInitial](transValue);
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
      let transValue;
      if (!Array.isArray(value)) {
        transValue = null;
      } else {
        transValue = value.map((item, index) => {
          return transCalculation(item, data.contentType, props, index);
        });
      }
      outputRels['returnValue'](transValue);
    });
  }, [value]);

  //重置
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

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id: props.id });
  };

  const onChange = (value) => {
    setValue(value);
    let transValue;
    if (!Array.isArray(value)) {
      transValue = null;
    } else {
      transValue = value.map((item, index) => {
        return transCalculation(item, data.contentType, props, index);
      });
    }
    onChangeForFc(parentSlot, { id: id, value: transValue });
    outputs['onChange'](transValue);
    onValidateTrigger();
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

  // 获得禁用日期时间
  const disabledDateTime = getDisabledDateTime({ data, dates });

  const onOpenChange = (open: boolean) => {
    if (open) {
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };

  return (
    <div className={css.rangePicker}>
      <RangePicker
        value={value}
        {...data.config}
        ranges={data.useRanges ? rangeOptions : []}
        showTime={getShowTime()}
        onChange={onChange}
        onCalendarChange={(dates) => setDates(dates)}
        onOpenChange={onOpenChange}
        {...disabledDateTime}
      />
    </div>
  );
}
