import React, { useRef } from 'react';
import moment from 'moment';
import { DatePicker } from 'antd';
import { FormItemProps } from '../runtime';

const { RangePicker } = DatePicker;
const FormItemSize: Record<string, string> = {
  large: '100%',
  middle: '70%',
  small: '50%'
};

interface RangePickerControlProps {
  formItem: FormItemProps;
  value?: [any, any] | null | undefined;
  onChange?: (value: [any, any] | null | undefined) => void;
}

const zhMap = {
  minute: '分钟',
  hour: '小时',
  day: '天'
};

const timeLineMap = {
  last: '最近',
  past1: '昨'
};

const formatRangeOptions = (list) => {
  const resultObject = {};
  let key = '';
  let value: any = [];
  list &&
    list.length &&
    list.forEach((item) => {
      key =
        item.timeLine === 'last'
          ? `${timeLineMap[item.timeLine]}${item.value}${zhMap[item.type]}`
          : `${timeLineMap[item.timeLine + item.value]}${zhMap[item.type]}`;
      value =
        item.timeLine === 'last'
          ? [moment().subtract(item.value, `${item.type}s`), moment()]
          : [
              moment().subtract(item.value, `${item.type}s`).startOf('day'),
              moment().subtract(item.value, `${item.type}s`).endOf('day')
            ];
      resultObject[key] = value;
    });
  return resultObject;
};

export default function RangePickerControl({
  formItem,
  value,
  onChange
}: RangePickerControlProps) {
  const {
    size,
    disabled,
    placeholder,
    showTime,
    picker,
    width = '100%',
    bannedBefore,
    bannedAfter
  } = formItem;
  const itemWidth = FormItemSize[size] || width;
  let resPlaceholder: string | [string, string] = placeholder;
  const itemOptions = formItem.options.length > 0 ? formItem.options : [];
  const rangeOptions = formatRangeOptions(itemOptions);
  const tempVal = useRef<[any, any]>();

  if (typeof resPlaceholder === 'string') {
    const [start, end] = resPlaceholder.split(',');
    resPlaceholder = [start, end];
  }
  const getShowTime = () => {
    if (!showTime || typeof showTime === 'boolean') {
      return showTime;
    }
    return {
      defaultValue: Array.isArray(showTime?.defaultValue)
        ? showTime?.defaultValue.map((item) => moment(item, 'HH:mm:ss'))
        : undefined
    };
  };

  const onOpenChange = (open) => {
    if (open) {
      tempVal.current = value;
      onChange && onChange(undefined);
    } else {
      onChange && onChange(tempVal.current);
    }
  };
  const isUseCustomDisabledDate =
    formItem.disabledDate && typeof formItem.disabledDate === 'function';
  const isUseCustomDisabledTime =
    formItem.disabledTime && typeof formItem.disabledTime === 'function';

  return (
    <RangePicker
      value={value}
      ranges={rangeOptions}
      disabledDate={(current) => {
        let bool = false;
        const value = moment(current).valueOf();
        if (bannedBefore) {
          if (value < bannedBefore) {
            bool = true;
          }
        }
        if (bannedAfter) {
          if (value > bannedAfter) {
            bool = true;
          }
        }
        if (!bool && isUseCustomDisabledDate) {
          try {
            bool = formItem.disabledDate(current);
          } catch (e) {
            console.error(e);
          }
        }
        return !!bool;
      }}
      onChange={(e) => {
        if (isUseCustomDisabledDate || isUseCustomDisabledTime) {
          tempVal.current = e;
        } else {
          onChange && onChange(e);
        }
      }}
      onCalendarChange={(e) => {
        if (
          (isUseCustomDisabledDate ||
            isUseCustomDisabledTime ||
            !!getShowTime()) &&
          onChange
        ) {
          onChange(e);
        }
      }}
      onOpenChange={
        (isUseCustomDisabledDate || isUseCustomDisabledTime) && onOpenChange
      }
      disabled={disabled}
      style={{ width: itemWidth }}
      picker={picker}
      showTime={getShowTime()}
      placeholder={resPlaceholder}
      disabledTime={isUseCustomDisabledTime ? formItem.disabledTime : undefined}
    />
  );
}
