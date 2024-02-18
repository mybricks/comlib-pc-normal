import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import classnames from 'classnames';
import { Badge, Calendar } from 'antd';
import { CalendarMode } from 'antd/lib/calendar/generateCalendar';
import { Data, OutputIds, SlotIds, InputIds, ModeEnum } from './constants';
import css from './style.less';
import { checkIfMobile } from '../utils';

// 格式化日期
const formatDate = (date?: moment.Moment, format?: string) => {
  format = format || 'YYYY-MM-DD';
  date = moment(date);
  return date.isValid() ? date.format(format) : moment().format(format);
};
// 日期化数据
const getMoment = (oriValue: any) => {
  const isValid = moment(oriValue).isValid();
  const num = Number(oriValue);
  const result: any = isValid ? moment(oriValue) : isNaN(num) ? undefined : moment(num);
  return result;
};

export default (props: RuntimeParams<Data>) => {
  const { env, data, slots, inputs, outputs, logger, title } = props;
  const { useCustomHeader, useCustomDateCell, useModeSwitch, useMonthSelect, useYearSelect } =
    data || {};
  // 数据源
  const [dataSource, setDataSource] = useState<object>({});
  // 当前日期
  const [currDate, setCurrDate] = useState<moment.Moment>();
  // 编辑态是否渲染作用域
  let showOneSlot = env.edit && true;
  const HeadSlotRef = useRef<any>({});
  const isMobile = checkIfMobile(env);
  useEffect(() => {
    if (env.edit) {
      const nowDate = formatDate();
      const nowMonth = formatDate(moment(), 'YYYY-MM');
      setDataSource({
        [nowMonth]: ['字符串数据', { color: 'red', content: '带颜色标签的数据' }],
        [nowDate]: ['字符串数据', { color: 'red', content: '带颜色标签的数据' }]
      });
    }
    if (env.runtime && inputs[InputIds.DataSource]) {
      inputs[InputIds.DataSource]((ds, relOutputs) => {
        if (ds && typeof ds === 'object') {
          setDataSource(ds);
          relOutputs['setDataSourceDone'](ds);
        }
      });
    }
    if (env.runtime && inputs[InputIds.CurrentDate]) {
      inputs[InputIds.CurrentDate]((value, relOutputs) => {
        const date = getMoment(value);
        date ? onChange(date) : logger.warn(`${title}: 设置当前日期输入不合法`);
        setCurrDate(date || currDate);
        relOutputs['setCurrentDateDone'](value);
      });
    }
  }, []);

  const getOutputProps = (date: moment.Moment, type?: ModeEnum) => {
    type = type || ModeEnum.Date;
    if (type === ModeEnum.Date) {
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
      firstDate: formatDate(date.startOf(ModeEnum.Month)),
      lastDate: formatDate(date.endOf(ModeEnum.Month))
    };
  };
  // 点击日期回调
  const onClickDate = (date: moment.Moment) => {
    if (outputs[OutputIds.ClickDate]) {
      outputs[OutputIds.ClickDate](getOutputProps(date));
    }
  };
  // 点击月份回调
  const onClickMonth = (date: moment.Moment) => {
    if (outputs[OutputIds.ClickMonth]) {
      outputs[OutputIds.ClickMonth](getOutputProps(date, ModeEnum.Month));
    }
  };
  // 日期/月份变化回调
  const onChange = (date: moment.Moment) => {
    const preMonth = formatDate(currDate, 'YYYY-MM');
    const newMonth = formatDate(date, 'YYYY-MM');
    setCurrDate(moment(date));
    setCustomHeaderData(date, data.mode);
    if (outputs[OutputIds.DateChange]) {
      outputs[OutputIds.DateChange](getOutputProps(date));
    }
    if (preMonth !== newMonth && outputs[OutputIds.MonthChange]) {
      outputs[OutputIds.MonthChange](getOutputProps(date, ModeEnum.Month));
    }
  };
  // 年/月面板变化回调
  const onPanelChange = (date: moment.Moment, mode: CalendarMode) => {
    if (outputs[OutputIds.ModeChange] && mode !== data.mode) {
      outputs[OutputIds.ModeChange]({
        ...getOutputProps(date, mode === ModeEnum.Year ? ModeEnum.Month : ModeEnum.Date),
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
    const ds = dataSource[formatDate(date, isMonth ? 'YYYY-MM' : 'YYYY-MM-DD')] || [];
    // 日期单元格插槽渲染
    if (!isMonth && useCustomDateCell && slots[SlotIds.DateCell]) {
      if (env.edit) {
        if (showOneSlot === true) {
          showOneSlot = false;
          return slots[SlotIds.DateCell].render({
            inputValues: {
              [InputIds.CurrentDate]: formatDate(date),
              [InputIds.CurrentDs]: Array.isArray(ds) ? ds : [ds]
            },
            key: formatDate(date)
          });
        } else {
          return <div style={{ color: '#ddd' }}>自定义内容</div>;
        }
      }
      return slots[SlotIds.DateCell].render({
        inputValues: {
          [InputIds.CurrentDate]: formatDate(date),
          [InputIds.CurrentDs]: Array.isArray(ds) ? ds : [ds]
        },
        key: formatDate(date)
      });
    }
    return (Array.isArray(ds) ? ds : [ds]).map(CellRender);
  };
  // 日期单元格渲染
  const DateFullCellRender = (date: moment.Moment) => {
    return (
      <div className="ant-picker-calendar-date" onClick={() => onClickDate(date)}>
        <div className="ant-picker-calendar-date-value">{formatDate(date, 'DD')}</div>
        <div className="ant-picker-calendar-date-content">{CustomCellRender(date)}</div>
      </div>
    );
  };
  // 月份单元格渲染
  const MonthFullCellRender = (date: moment.Moment) => {
    const isToday = formatDate(date, 'YYYY-MM') === formatDate(moment(), 'YYYY-MM');
    return (
      <div
        onClick={() => onClickMonth(date)}
        className={classnames(
          'ant-picker-cell-inner',
          'ant-picker-calendar-date',
          isToday && 'ant-picker-calendar-date-today'
        )}
      >
        <div className="ant-picker-calendar-date-value">{formatDate(date, 'M月')}</div>
        <div className="ant-picker-calendar-date-content">{CustomCellRender(date, true)}</div>
      </div>
    );
  };

  return (
    <Calendar
      mode={data.mode}
      fullscreen={!isMobile}
      className={classnames(
        css.calendar,
        !useModeSwitch && css.hideModeSwitch,
        !useMonthSelect && css.hideMonthSwitch,
        !useYearSelect && css.hideYearSwitch
      )}
      onPanelChange={onPanelChange}
      dateFullCellRender={DateFullCellRender}
      monthFullCellRender={MonthFullCellRender}
      onChange={onChange}
      value={currDate}
    />
  );
};
