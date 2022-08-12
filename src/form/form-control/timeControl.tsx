import React, { useRef } from 'react';
import moment from 'moment';
import { TimePicker } from 'antd';
import { FormItemProps } from '../runtime';

const FormItemSize: Record<string, string> = {
  large: '100%',
  middle: '70%',
  small: '50%'
};

interface TimePickerControlProps {
  formItem: FormItemProps;
  value?: any | null | undefined;
  onChange?: (value: any | null | undefined) => void;
}

export default function TimePickerControl({
  formItem,
  value,
  onChange
}: TimePickerControlProps) {
  const {
    size,
    disabled,
    placeholder,
    defaultValue,
    width = '100%',
  } = formItem;
  const itemWidth = FormItemSize[size] || width;
  const tempVal = useRef<any>();

  const getDefaultTime = () => {
    const result = moment(defaultValue, 'h:m:s');
    if (result.isValid()) {
      if (!value) onChange(result.format('LTS'));
      return result;
    }
    return undefined;
  };

  const getValue = () => {
    if (value) {
      return moment(value, 'hh:mm:ss');
    }
    return undefined;
  };

  // 弹出和关闭时间选择的回调
  const onOpenChange = (open: boolean) => {
    if (open) {
      tempVal.current = value;
    } else {
      onChange && onChange(tempVal.current);
    }
  };
  const isUseCustomDisabledTime =
    formItem.disabledTime && typeof formItem.disabledTime === 'function';
  return (
    <TimePicker
      value={getValue()}
      defaultValue={getDefaultTime()}
      style={{ width: itemWidth }}
      disabled={disabled}
      showNow
      placeholder={placeholder}
      onChange={(e, timeString) => {
        if (isUseCustomDisabledTime) {
          tempVal.current = timeString;
        } else {
          onChange && onChange(timeString);
        }
      }}
      onOpenChange={
        (isUseCustomDisabledTime) && onOpenChange
      }
    />
  );
}