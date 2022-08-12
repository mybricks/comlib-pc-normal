import React, { useCallback, useMemo } from 'react';
import moment from 'moment';
import { TimePicker } from 'antd';
import { FormItemProps } from '../runtime';

const { RangePicker } = TimePicker;
const FormItemSize: Record<string, string> = {
  large: '100%',
  middle: '70%',
  small: '50%'
};

interface TimeRangePickerControlProps {
  formItem: FormItemProps;
  value?: [any, any] | null | undefined;
  onChange?: (value: [any, any] | null | undefined) => void;
}


export default function TimeRangePickerControl({
  formItem,
  value,
  onChange
}: TimeRangePickerControlProps) {
  const {
    size,
    placeholder,
    width = '100%',
    defaultValue
  } = formItem;
  const itemWidth = FormItemSize[size] || width;
  let resPlaceholder: string | [string, string] = placeholder;

  if (typeof resPlaceholder === 'string') {
    const [start, end] = resPlaceholder.split(',');
    resPlaceholder = [start, end];
  }

  const isTimeValid = useCallback((time: any): boolean => {
    if (!time || !Array.isArray(time)) return false;
    return time.every(t => t === void 0 || moment(t, 'hh:mm:ss').isValid())
  }, [])

  const newValue = useMemo((): [any, any] => {
    const time: any = isTimeValid(value) && value || isTimeValid(defaultValue) && defaultValue
    if (time) {
      return time.map(t => t ? moment(t, 'hh:mm:ss') : undefined)
    }
    return [undefined, undefined];
  }, [value, defaultValue]);

  return (
    <RangePicker
      value={newValue}
      showNow
      onChange={onChange}
      onCalendarChange={onChange}
      style={{ width: itemWidth }}
      placeholder={resPlaceholder}
    />
  );
}
