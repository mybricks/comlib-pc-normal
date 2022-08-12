import React, { useRef } from 'react';
import moment from 'moment';
import { DatePicker } from 'antd';
import { FormItemProps } from '../runtime';

const FormItemSize: Record<string, string> = {
  large: '100%',
  middle: '70%',
  small: '50%'
};

interface DatePickerControlProps {
  formItem: FormItemProps;
  value?: any | null | undefined;
  onChange?: (value: any | null | undefined) => void;
}

export default function DatePickerControl({
  formItem,
  value,
  onChange
}: DatePickerControlProps) {
  const {
    size,
    disabled,
    placeholder,
    showTime,
    picker,
    width = '100%',
    bannedBefore,
    bannedAfter,
    disableDate
  } = formItem;
  const itemWidth = FormItemSize[size] || width;
  const tempVal = useRef<any>();

  const getShowTime = () => {
    if (!showTime || typeof showTime === 'boolean') {
      return showTime;
    }
    return {
      defaultValue:
        typeof showTime?.defaultValue === 'string'
          ? moment(showTime.defaultValue, 'HH:mm:ss')
          : undefined
    };
  };

  // 弹出日历和关闭日历的回调
  const onOpenChange = (open) => {
    if (open) {
      tempVal.current = value;
    } else {
      onChange && onChange(tempVal.current);
    }
  };
  const isUseCustomDisabledDate =
    formItem.disabledDate && typeof formItem.disabledDate === 'function';
  const isUseCustomDisabledTime =
    formItem.disabledTime && typeof formItem.disabledTime === 'function';

  return (
    <DatePicker
      value={value}
      style={{ width: itemWidth }}
      picker={picker}
      showTime={getShowTime()}
      disabled={disabled}
      placeholder={placeholder}
      disabledDate={(current) => {
        let bool = false;
        const value = moment(current).valueOf();
        if (disableDate && disableDate.length) {
          const formatCurrent = moment(current).endOf('day').valueOf();
          const formatDisableDate = disableDate.map((i) =>
            moment(i).endOf('day').valueOf()
          );
          return formatDisableDate.includes(formatCurrent);
        }
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
        return bool;
      }}
      onChange={(e) => {
        if (isUseCustomDisabledDate || isUseCustomDisabledTime) {
          tempVal.current = e;
        } else {
          onChange && onChange(e);
        }
      }}
      onOpenChange={
        (isUseCustomDisabledDate || isUseCustomDisabledTime) && onOpenChange
      }
      disabledTime={isUseCustomDisabledTime ? formItem.disabledTime : undefined}
    />
  );
}
