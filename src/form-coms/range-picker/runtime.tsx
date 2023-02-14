import React, { useLayoutEffect, useState } from 'react';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { validateFormItem } from '../utils/validator';
import css from './runtime.less';
import { OutputIds, TimeDateLimitItem } from '../types';
import { validateTrigger } from '../form-container/models/validate';
import { getDisabledDateTime } from './getDisabledDateTime';

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
        showTime={getShowTime()}
        onChange={onChange}
        onCalendarChange={(dates) => setDates(dates)}
        onOpenChange={onOpenChange}
        {...disabledDateTime}
      />
    </div>
  );
}
