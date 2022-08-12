import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import classnames from 'classnames';
import { Badge, Calendar } from 'antd';
import { CalendarMode, HeaderRender } from 'antd/lib/calendar/generateCalendar';
import { Data, OUTPUTS, SLOTS, INPUTS } from './constants';
import css from './style.less';

// 格式化日期
const formatDate = (date?: moment.Moment, format?: string) => {
  format = format || 'YYYY-MM-DD';
  date = moment(date);
  return date.isValid() ? date.format(format) : moment().format(format);
};
const RuntimeRender = (props: RuntimeParams<Data>) => {
  const { env, data, slots, inputs, outputs } = props;
  const {
    useCustomHeader,
    useCustomDateCell,
    useModeSwitch,
    useMonthSelect,
    useYearSelect
  } = data || {};
  // 数据源
  const [dataSource, setDataSource] = useState<object>({});
  // 当前日期
  const [currDate, setCurrDate] = useState<moment.Moment>();
  const HeadSlotRef = useRef<any>({});

  useEffect(() => {
    if (env.edit) {
      const nowDate = formatDate();
      const nowMonth = formatDate(moment(), 'YYYY-MM');
      setDataSource({
        [nowMonth]: [
          '字符串数据',
          { color: 'red', content: '带颜色标签的数据' }
        ],
        [nowDate]: ['字符串数据', { color: 'red', content: '带颜色标签的数据' }]
      });
    }
    if (env.runtime && inputs[INPUTS.DataSource]) {
      inputs[INPUTS.DataSource]((ds) => {
        if (ds && typeof ds === 'object') {
          setDataSource(ds);
        }
      });
    }
  }, []);

  const getOutputProps = (date: moment.Moment, type?: 'date' | 'month') => {
    type = type || 'date';
    if (type === 'date') {
      return {
        mode: data.mode,
        dataSource: dataSource[formatDate(date)] || [],
        date: formatDate(date)
      };
    }
    return {
      mode: data.mode,
      date: formatDate(date),
      month: formatDate(date, 'YYYY-MM'),
      dataSource: dataSource[formatDate(date, 'YYYY-MM')] || [],
      firstDate: formatDate(date.startOf('month')),
      lastDate: formatDate(date.endOf('month'))
    };
  };
  // 点击日期回调
  const onClickDate = (date: moment.Moment) => {
    if (outputs[OUTPUTS.ClickDate]) {
      outputs[OUTPUTS.ClickDate](getOutputProps(date));
    }
  };
  // 点击月份回调
  const onClickMonth = (date: moment.Moment) => {
    if (outputs[OUTPUTS.ClickMonth]) {
      outputs[OUTPUTS.ClickMonth](getOutputProps(date, 'month'));
    }
  };
  // 日期/月份变化回调
  const onChange = (date: moment.Moment) => {
    const preMonth = formatDate(currDate, 'YYYY-MM');
    const newMonth = formatDate(date, 'YYYY-MM');
    setCurrDate(moment(date));
    setCustomHeaderData(date, data.mode);
    if (outputs[OUTPUTS.DateChange]) {
      outputs[OUTPUTS.DateChange](getOutputProps(date));
    }
    if (preMonth !== newMonth && outputs[OUTPUTS.MonthChange]) {
      outputs[OUTPUTS.MonthChange](getOutputProps(date, 'month'));
    }
  };
  // 年/月面板变化回调
  const onPanelChange = (date: moment.Moment, mode: CalendarMode) => {
    if (outputs[OUTPUTS.ModeChange] && mode !== data.mode) {
      outputs[OUTPUTS.ModeChange]({
        ...getOutputProps(date, mode === 'year' ? 'month' : 'date'),
        mode
      });
    }
    data.mode = mode;
    setCustomHeaderData(date, mode);
  };

  // 给 顶部插槽 传递数据
  const setCustomHeaderData = (date?: moment.Moment, mode?: CalendarMode) => {
    if (HeadSlotRef.current && HeadSlotRef.current.fn) {
      const temp: any = {};
      if (date) {
        temp.value = date;
      }
      if (mode) {
        temp.type = mode;
      }
      HeadSlotRef.current.fn({
        ...HeadSlotRef.current.props,
        ...temp
      });
    }
  };

  // 日期单元格渲染 - 默认
  const CellRender = (item: any, idx: number) => {
    const { color, content } = item || {};
    if (content && color) {
      return <Badge color={color} text={content} key={idx} />;
    }
    return <div key={idx}>{content || item}</div>;
  };
  // 日期/月份单元格渲染
  const CustomCellRender = (date: moment.Moment, isMonth?: boolean) => {
    const ds =
      dataSource[formatDate(date, isMonth ? 'YYYY-MM' : 'YYYY-MM-DD')] || [];
    // 日期单元格插槽渲染
    if (!isMonth && useCustomDateCell && slots[SLOTS.DateCell]) {
      return slots[SLOTS.DateCell].render({
        inputs: {
          slotProps: (fn) => {
            fn({ date: formatDate(date), dataSource: ds });
          }
        }
      });
    }
    return (Array.isArray(ds) ? ds : [ds]).map(CellRender);
  };
  // 日期单元格渲染
  const DateFullCellRender = (date: moment.Moment) => {
    return (
      <div
        className="ant-picker-calendar-date"
        onClick={() => onClickDate(date)}
      >
        <div className="ant-picker-calendar-date-value">
          {formatDate(date, 'DD')}
        </div>
        <div className="ant-picker-calendar-date-content">
          {CustomCellRender(date)}
        </div>
      </div>
    );
  };
  // 月份单元格渲染
  const MonthFullCellRender = (date: moment.Moment) => {
    const isToday =
      formatDate(date, 'YYYY-MM') === formatDate(moment(), 'YYYY-MM');
    return (
      <div
        onClick={() => onClickMonth(date)}
        className={classnames(
          'ant-picker-cell-inner',
          'ant-picker-calendar-date',
          isToday && 'ant-picker-calendar-date-today'
        )}
      >
        <div className="ant-picker-calendar-date-value">
          {formatDate(date, 'M月')}
        </div>
        <div className="ant-picker-calendar-date-content">
          {CustomCellRender(date, true)}
        </div>
      </div>
    );
  };

  // 顶部插槽渲染
  const CustomHeaderRender: HeaderRender<moment.Moment> = (props) => {
    if (slots[SLOTS.HeaderRender]) {
      return slots[SLOTS.HeaderRender].render({
        inputs: {
          slotProps: (fn) => {
            HeadSlotRef.current.fn = fn;
            HeadSlotRef.current.props = {
              ...props,
              onChange,
              onPanelChange
            };
            setCustomHeaderData();
          }
        }
      });
    }
  };

  return (
    <Calendar
      mode={data.mode}
      className={classnames(
        css.calendar,
        !useModeSwitch && css.hideModeSwitch,
        !useMonthSelect && css.hideMonthSwitch,
        !useYearSelect && css.hideYearSwitch
      )}
      onPanelChange={onPanelChange}
      dateFullCellRender={DateFullCellRender}
      headerRender={useCustomHeader ? CustomHeaderRender : undefined}
      monthFullCellRender={MonthFullCellRender}
      onChange={onChange}
      value={currDate}
    />
  );
};

export default function (props: RuntimeParams<Data>) {
  return <RuntimeRender {...props} />;
}
