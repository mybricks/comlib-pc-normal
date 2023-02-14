import React, { useLayoutEffect, useState } from 'react';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { validateFormItem } from '../utils/validator';
import css from './runtime.less';
import { DateType, OutputIds, TimeDateLimitItem } from '../types';
import { validateTrigger } from '../form-container/models/validate';

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
  config: {
    disabled: boolean;
    placeholder: undefined | [string, string];
    picker: 'date' | 'week' | 'month' | 'quarter' | 'year' | undefined;
  };
}

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, inputs, outputs, env, parentSlot } = props;
  const [value, setValue] = useState<any>();
  const [dates, setDates] = useState<[Moment | null, Moment | null] | null>(null);

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
            transValue = value.map((item) => {
              return transCalculation(item, data.contentType, props);
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
        transValue = value.map((item) => {
          return transCalculation(item, data.contentType, props);
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
      transValue = value.map((item) => {
        return transCalculation(item, data.contentType, props);
      });
    }
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

  const { useDisabledDate, useDisabledTime, staticDisabledDate, staticDisabledTime } = data;
  const getLimitByDateType = ({
    limitItem,
    baseDate,
    defaultType
  }: {
    limitItem: TimeDateLimitItem;
    baseDate?: Moment | null;
    defaultType: 'days' | 'seconds';
  }) => {
    const { type, offset, direction } = limitItem;
    if (type !== 'custom') {
      return direction === 'before'
        ? moment().add(offset, type).startOf(type)
        : moment().add(offset, type).endOf(type);
    } else if (!!baseDate) {
      return direction === 'before'
        ? moment(baseDate).add(offset, defaultType).startOf(defaultType)
        : moment(baseDate).add(offset, defaultType).endOf(defaultType);
    }
    return [];
  };
  // 日期禁用数据
  const startDateLimit = staticDisabledDate[0];
  const endDateLimit = staticDisabledDate[1];
  const startDate = getLimitByDateType({ limitItem: startDateLimit, defaultType: 'days' });
  const endDate = getLimitByDateType({
    limitItem: endDateLimit,
    defaultType: 'days',
    baseDate: dates?.[0]
  });
  const useStartDateLimit = useDisabledDate === 'static' && startDateLimit.checked;
  const useEndDateLimit = useDisabledDate === 'static' && startDateLimit.checked;
  // 时间禁用数据
  const startTimeLimit = staticDisabledTime[0];
  const endTimeLimit = staticDisabledTime[1];
  const startTime = getLimitByDateType({ limitItem: startTimeLimit, defaultType: 'seconds' });
  const endTime = getLimitByDateType({
    limitItem: endTimeLimit,
    defaultType: 'seconds',
    baseDate: dates?.[0]
  });
  const useStartTimeLimit = data.showTime && useDisabledTime === 'static' && startTimeLimit.checked;
  const useEndTimeLimit = data.showTime && useDisabledTime === 'static' && endTimeLimit.checked;

  /** 日期禁用函数 */
  const disabledDate = (current) => {
    // current: 所有日期
    let startBool = false,
      endBool = false;

    if (useStartDateLimit) {
      if (startDateLimit.direction === 'before') {
        if (current && current < startDate) {
          startBool = true;
        }
      }
      if (startDateLimit.direction === 'after') {
        if (current && current > startDate) {
          startBool = true;
        }
      }
    }
    if (useEndDateLimit) {
      if (endDateLimit.direction === 'before') {
        if (current && current < endDate) {
          endBool = true;
        }
      }
      if (endDateLimit.direction === 'after') {
        if (current && current > endDate) {
          endBool = true;
        }
      }
    }
    return startBool || endBool;
  };

  const range = (start: number, end: number): number[] => {
    const result: number[] = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };
  const formatter = (m, template?) => moment(m).format(template || 'Y-MM-DD');
  /** 时间禁用函数 */
  const disabledTime =
    useDisabledTime === 'static' && data.showTime
      ? (current) => {
          let hours = moment().hours(),
            minutes = moment().minutes(),
            seconds = moment().seconds();
          const limitDate = useStartDateLimit ? startDate : false;
          if (useEndTimeLimit && endTimeLimit.type === 'custom' && dates?.[0]) {
            hours = moment(dates[0]).hours();
            minutes = moment(dates[0]).minutes();
            seconds = moment(dates[0]).seconds();
          }
          if (!limitDate || (current && formatter(startDate) == formatter(current))) {
            return {
              disabledHours: () => range(0, hours),
              disabledMinutes: (selectedHour) => (selectedHour <= hours ? range(0, minutes) : []),
              disabledSeconds: (selectedHour, selectedMinute) =>
                selectedHour <= hours && selectedMinute <= minutes ? range(0, seconds) : []
            };
          }
          return {
            disabledHours: () => [],
            disabledMinutes: () => [],
            disabledSeconds: () => []
          };
        }
      : void 0;

  return (
    <div className={css.rangePicker}>
      <RangePicker
        value={value}
        {...data.config}
        showTime={getShowTime()}
        onChange={onChange}
        onCalendarChange={(dates) => setDates(dates)}
        disabledDate={disabledDate}
        disabledTime={disabledTime}
      />
    </div>
  );
}
