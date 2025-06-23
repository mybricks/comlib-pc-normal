import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { DatePicker, DatePickerProps } from 'antd-mobile';
import moment, { Moment } from 'moment';
import cls from 'classnames';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import { debounceValidateTrigger } from '../form-container/models/validate';
import css from './runtime.less';
import { OutputIds, InputIds as CommonInputIds } from '../types';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import ConfigProvider from '../../components/ConfigProvider';
import { SlotIds, InputIds } from './constant';
import { formatRulesExpression, DisabledRulesValue } from './util';
import { runJs } from '../../../package/com-utils';
import { nextTick } from 'process';

export interface Data {
  isMulti: boolean;
  isEditable: boolean;
  options: any[];
  rules: any[];
  showNow?: boolean;
  config: DatePickerProps;
  placeholder?: string;
  disabled?: boolean;
  disabledTimeRules?: any[];
  formatter: string;
  showFormatter: string;
  contentType?: any;
  useCustomDateCell?: any;
}

const addZero = (v) => (v.toString().length < 2 ? '0' + v : v);
const weekFormatMapper = {
  '0': '天',
  '1': '一',
  '2': '二',
  '3': '三',
  '4': '四',
  '5': '五',
  '6': '六'
};
// 展示日期格式化
const formatDate = (date, format = 'YYYY-MM-DD hh:mm:ss') => {
  const d = date ? new Date(date) : new Date();
  if (isNaN(d.getFullYear())) return '';

  return format
    .replace('YYYY', d.getFullYear() + '')
    .replace('MM', addZero(d.getMonth() + 1))
    .replace('DD', addZero(d.getDate()))
    .replace('dd', addZero(weekFormatMapper[d.getDay()]))
    .replace('HH', addZero(d.getHours()))
    .replace('mm', addZero(d.getMinutes()))
    .replace('ss', addZero(d.getSeconds()));
};

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, inputs, outputs, env, parentSlot, name, id, slots } = props;
  const [value, setValue] = useState<Date | null>(
    data.config.defaultValue ? new Date(data.config.defaultValue) : null
  );
  // 多选value
  const [mvalue, setMValue] = useState<[Date, Date]>(
    (data.config.defaultValue as unknown as [Date, Date]) || []
  );
  // 多选时当前选中的日期的下标
  const [multiIndex, setMultiIndex] = useState(0);
  const [_, forchUpdate] = useState(0);
  const { edit, runtime } = env;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const validateRelOutputRef = useRef<any>(null);
  const valueRef = useRef<any>();
  const customExtraTextRef = useRef<any>(() => {});

  const [open, setOpen] = useState<boolean | undefined>(void 0);

  //输出数据变形函数
  const transCalculation = (val, type, props) => {
    let transValue;
    if (val) {
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
        default:
          transValue = moment(val).format(type);
      }
    }
    return transValue;
  };

  useLayoutEffect(() => {
    inputs['setValue']((val, relOutputs) => {
      //时间戳转换
      const num = Number(val);
      const result: any = isNaN(num) ? moment(val) : moment(num);
      val =
        val === null || num === 0
          ? null
          : !result?._isValid || val === undefined
          ? undefined
          : result;
      const transValue = changeValue(val);
      if (relOutputs['setValueDone']) {
        relOutputs['setValueDone'](val);
      }
      outputs['onChange'](transValue);
    });

    inputs['setInitialValue'] &&
      inputs['setInitialValue']((val, relOutputs) => {
        //时间戳转换
        const transValue = changeValue(new Date(val));
        if (relOutputs['setInitialValueDone']) {
          relOutputs['setInitialValueDone'](val);
        }
        outputs[OutputIds.OnInitial](transValue);
      });

    inputs['validate']((model, outputRels) => {
      validateFormItem({
        value: valueRef.current,
        env,
        model,
        rules: data.rules
      })
        .then((r) => {
          const customRule = (data.rules || defaultRules).find(
            (i) => i.key === RuleKeys.CUSTOM_EVENT
          );
          if (customRule?.status) {
            validateRelOutputRef.current = outputRels['returnValidate'];
            let transValue;
            //1.null是从日期选择框不选日期的情况；
            //2.undefined是手动设置值为空或者不正确的情况
            if (valueRef.current === null || valueRef.current === undefined) {
              transValue = undefined;
            } else {
              transValue = transCalculation(valueRef.current, data.contentType, props);
            }
            outputs[OutputIds.OnValidate](transValue);
          } else {
            outputRels['returnValidate'](r);
            debounceValidateTrigger(parentSlot, {
              id: props.id,
              name: props.name,
              validateInfo: r
            });
          }
        })
        .catch((e) => {
          outputRels['returnValidate'](e);
          debounceValidateTrigger(parentSlot, {
            id: props.id,
            name: props.name,
            validateInfo: e
          });
        });
    });

    inputs['disabledDate']?.((val, outputRels) => {
      if (typeof val === 'function') {
        data.disabledDate = val;
      } else {
        data.disabledDate = void 0;
      }
      forchUpdate((count) => count + 1);
      // forchUpdate(0);
      outputRels['disabledDateDone'](val);
    });

    inputs['getValue']((val, outputRels) => {
      let transValue;
      //1.null是从日期选择框不选日期的情况；
      //2.undefined是手动设置值为空或者不正确的情况
      if (valueRef.current === null || valueRef.current === undefined) {
        transValue = valueRef.current;
      } else {
        transValue = transCalculation(valueRef.current, data.contentType, props);
      }
      outputRels['returnValue'](transValue);
    });

    // 设置校验状态
    inputs[CommonInputIds.SetValidateInfo]((info: object, outputRels) => {
      if (validateRelOutputRef.current) {
        validateRelOutputRef.current(info);
        outputRels['setValidateInfoDone'](info);
        debounceValidateTrigger(parentSlot, {
          id: props.id,
          name: props.name,
          validateInfo: info as any
        });
      }
    });
  }, [value]);

  //设置日期选择类型
  inputs['setDateType']((val, outputRels) => {
    const dateType = ['date', 'week', 'month', 'quarter', 'year'];
    if (dateType.includes(val)) {
      outputRels['setDateTypeDone'](val);
    } else {
      message.error('日期类型不正确');
    }
  });

  useLayoutEffect(() => {
    inputs[CommonInputIds.SetColor]((color: string, outputRels) => {
      const target = wrapperRef.current?.querySelector?.('input');
      if (target) {
        target.style.color = typeof color === 'string' ? color : '';
        outputRels['setColorDone'](color);
      }
    });
    inputs[InputIds.SetOpen]?.((open: boolean) => {
      setOpen(open);
    });
  }, []);

  //重置，
  inputs['resetValue']((_, relOutputs) => {
    changeValue(void 0);
    if (relOutputs['resetValueDone']) {
      relOutputs['resetValueDone']();
    }
  });
  //设置禁用
  inputs['setDisabled']((_, relOutputs) => {
    data.config.disabled = true;
    if (relOutputs['setDisabledDone']) {
      relOutputs['setDisabledDone']();
    }
  });
  //设置启用
  inputs['setEnabled']((_, relOutputs) => {
    data.config.disabled = false;
    if (relOutputs['setEnabledDone']) {
      relOutputs['setEnabledDone']();
    }
  });

  //设置启用/禁用
  inputs['isEnable']((val, relOutputs) => {
    if (val === true) {
      data.config.disabled = false;
      if (relOutputs['setEnabledDone']) {
        relOutputs['isEnableDone'](val);
      }
    } else {
      data.config.disabled = true;
      if (relOutputs['setEnabledDone']) {
        relOutputs['isEnableDone'](val);
      }
    }
  });

  //设置编辑/只读
  inputs['isEditable']((val, relOutputs) => {
    data.isEditable = val;
    if (relOutputs['isEditableDone']) {
      relOutputs['isEditableDone'](val);
    }
  });

  useEffect(() => {
    if (data.customExtraText) {
      inputs[InputIds.ConfigExtraText]((val, relOutputs) => {
        if (typeof val !== 'function') {
          throw new Error(`请输入有效的函数！`);
        }
        customExtraTextRef.current = val;
        relOutputs[`${InputIds.ConfigExtraText}Done`](val);
      });
    }
  });

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id: props.id, name: name });
  };

  const changeValue = (value) => {
    if (data.isMulti) {
      const newMVal: [Date, Date] = [mvalue[0], mvalue[1]];
      newMVal[multiIndex] = value;
      return newMVal;
    } else {
      return value;
    }
  };

  const onChange = (value) => {
    const transValue = changeValue(value);
    outputs['onChange'](transValue);
  };

  const onConfirm = useCallback(
    (value) => {
      if (data.isMulti) {
        const newMValue = changeValue(value);
        setMValue(newMValue);
        valueRef.current = newMValue;
        onChangeForFc(parentSlot, { id: props.id, name: name, value: newMValue });
        onValidateTrigger();
        outputs['onConfirm']?.(newMValue);
      } else {
        setValue(value);
        valueRef.current = value;
        onChangeForFc(parentSlot, { id: props.id, name: name, value: value });
        onValidateTrigger();
        outputs['onConfirm']?.(value);
      }
    },
    [data.isMulti, changeValue]
  );

  const renderPicker = useMemo(() => {
    if (data.isMulti) {
      return (
        <div
          className={cls({
            [css.datePickerContent]: true,
            datePickerContent: true,
            [css.datePickerDisabled]: data.disabled
          })}
        >
          <span
            className={cls({
              [css.datePickerMultiRow]: true,
              [css.datePickerMultiRowChecked]: multiIndex === 0
            })}
            onClick={() => {
              if (runtime && !data.disabled) {
                setMultiIndex(0);
                setOpen(true);
                setValue(mvalue?.[0] || null);
              }
            }}
          >
            {mvalue?.[0] ? formatDate(mvalue[0], data.showFormatter) : data.placeholder}
          </span>
          <span className={css.datePickerMultiSplit}>-</span>
          <span
            className={cls({
              [css.datePickerMultiRow]: true,
              [css.datePickerMultiRowChecked]: multiIndex === 1
            })}
            onClick={() => {
              if (runtime && !data.disabled) {
                setMultiIndex(1);
                setOpen(true);
                setValue(mvalue?.[1] || null);
              }
            }}
          >
            {mvalue?.[1] ? formatDate(mvalue[1], data.showFormatter) : data.placeholder}
          </span>
          <CalendarOutlined className={css.datePickerArrow + ' datePickerArrow'} />
        </div>
      );
    } else {
      if (!!value) {
        return (
          <div
            className={cls({
              [css.datePickerContent]: true,
              datePickerContent: true,
              [css.datePickerDisabled]: data.disabled
            })}
            onClick={() => runtime && !data.disabled && setOpen(true)}
          >
            <span>{formatDate(value, data.showFormatter)}</span>
            <CalendarOutlined className={css.datePickerArrow + ' datePickerArrow'} />
          </div>
        );
      } else {
        return (
          <div
            className={cls({
              [css.datePickerContent]: true,
              datePickerContent: true,
              [css.datePickerPlaceholder]: true,
              [css.datePickerDisabled]: data.disabled
            })}
            onClick={() => runtime && !data.disabled && setOpen(true)}
          >
            <span>{data.placeholder}</span>
            <CalendarOutlined className={css.datePickerArrow + ' datePickerArrow'} />
          </div>
        );
      }
    }
  }, [data.isMulti, data.showFormatter, value, mvalue, multiIndex]);

  return (
    <ConfigProvider locale={env.vars?.locale}>
      {data.isEditable ? (
        <div className={css.datePicker + ' datePicker'} ref={wrapperRef}>
          {renderPicker}

          <DatePicker
            {...data.config}
            max={data.config.max ? new Date(data.config.max) : undefined}
            min={data.config.min ? new Date(data.config.min) : undefined}
            defaultValue={data.config.defaultValue ? new Date(data.config.defaultValue) : null}
            onClose={() => setOpen(false)}
            onSelect={onChange}
            onConfirm={onConfirm}
            visible={open}
            value={value}
            // title={slots[SlotIds.DateCell]?.render()}
            filter={data.disabledTimeRules
              ?.filter((i) => i.status)
              .reduce((prev, curr) => {
                return {
                  ...prev,
                  [curr.key]: runJs(curr.validateCode)
                };
              }, {})}
          />
        </div>
      ) : (
        formatDate(value, data.showFormatter)
        // transCalculation(value, decodeURIComponent(data.formatMap[typeMap[type]]), props)
      )}
    </ConfigProvider>
  );
}
