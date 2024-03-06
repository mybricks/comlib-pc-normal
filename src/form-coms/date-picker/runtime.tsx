import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, DatePickerProps, message } from 'antd';
import moment, { Moment } from 'moment';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import css from './runtime.less';
import { OutputIds, InputIds as CommonInputIds } from '../types';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import ConfigProvider from '../../components/ConfigProvider';
import { SlotIds, InputIds } from './constant';
import { defaultDisabledDateRule } from './editors';

type DisabledDateRule = {
  title: string;
  checked: boolean;
  offset: Array<number>;
  direction: 'before' | 'after';
};
export interface Data {
  options: any[];
  rules: any[];
  showTime: Record<string, unknown> | boolean;
  contentType: string;
  formatter: string;
  useCustomDateCell: boolean;
  useCustomPanelHeader: boolean;
  useCustomPanelFooter: boolean;
  controlled: boolean;
  closeWhenClickOutOfPanel: boolean;
  /** @description 1.1.17 默认面板日期 */
  defaultPickerValue: string;
  customExtraText: boolean;
  config: DatePickerProps;
  useDisabledDate: 'default' | 'static';
  hideDatePanel: boolean;
  staticDisabledDate: [DisabledDateRule, DisabledDateRule];
  formatMap: {
    日期: string;
    '日期+时间': string;
    周: string;
    月份: string;
    季度: string;
    年份: string;
  };
  isWeekNumber: boolean;
  isEditable: boolean;
  disabledDate: DatePickerProps['disabledDate'];
}

const typeMap = {
  date: '日期',
  dateTime: '日期+时间',
  week: '周',
  month: '月份',
  quarter: '季度',
  year: '年份'
};

/** 提供给高阶函数的各种参数 */
export interface IHyperExtends {
  hyperExtends?: {
    wrapperHeight?: number;
    wrapperRef?: React.RefObject<HTMLDivElement>;
    dropdownClassName?: string;
    fullOpen?: true;
  };
}

export default function Runtime(props: RuntimeParams<Data> & IHyperExtends) {
  const { data, inputs, outputs, env, parentSlot, name, id, slots, hyperExtends = {} } = props;
  const { wrapperHeight, wrapperRef: hyperWrapperRef, dropdownClassName, fullOpen } = hyperExtends;
  const [value, setValue] = useState();
  const [_, forchUpdate] = useState(0);
  const { edit, runtime } = env;
  const debug = !!(runtime && runtime.debug);
  const wrapperRef = hyperWrapperRef || useRef<HTMLDivElement>(null);
  const dropdownWrapperRef = useRef<HTMLDivElement>(null);
  const validateRelOutputRef = useRef<any>(null);
  const valueRef = useRef<any>();
  const customExtraTextRef = useRef<any>(() => {});

  const [open, setOpen] = useState<boolean | undefined>(void 0);
  const [type, setType] = useState<string>('date');

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
      val = val === null ? null : !result?._isValid || val === undefined ? undefined : result;
      const transValue = changeValue(val);
      if (relOutputs['setValueDone']) {
        relOutputs['setValueDone'](val);
      }
      outputs['onChange'](transValue);
    });

    inputs['setInitialValue'] &&
      inputs['setInitialValue']((val, relOutputs) => {
        //时间戳转换
        const num = Number(val);
        const result: any = isNaN(num) ? moment(val) : moment(num);
        // 为null设置为null
        val = val === null ? null : !result?._isValid || val === undefined ? undefined : result;
        const transValue = changeValue(val);
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
          }
        })
        .catch((e) => {
          outputRels['returnValidate'](e);
        });
    });

    inputs['disabledDate']((val, outputRels) => {
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
      }
    });
  }, [value]);

  //值展示类型
  useEffect(() => {
    if (data.config.picker === 'date' && data.showTime) {
      setType('dateTime');
    } else {
      setType(data.config.picker || 'date');
    }
  }, [data.config.picker, data.showTime]);

  //设置日期选择类型
  inputs['setDateType']((val, outputRels) => {
    const dateType = ['date', 'week', 'month', 'quarter', 'year'];
    if (dateType.includes(val)) {
      data.config.picker = val;
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
      inputs[InputIds.ConfigExtraText]((val) => {
        if (typeof val !== 'function') {
          throw new Error(`请输入有效的函数！`);
        }
        customExtraTextRef.current = val;
      });
    }
  });

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id: props.id, name: name });
  };

  const changeValue = (val) => {
    setValue(val);
    valueRef.current = val;
    //自定义转换
    let transValue;
    if (val === null || val === undefined) {
      transValue = val;
    } else {
      transValue = transCalculation(val, data.contentType, props);
    }
    onChangeForFc(parentSlot, { id: props.id, name: name, value: transValue });
    return transValue;
  };

  const onChange = (value) => {
    const transValue = changeValue(value);
    outputs['onChange'](transValue);
    onValidateTrigger();
  };
  const onPanelChange: DatePickerProps['onPanelChange'] = (value, mode) => {
    outputs['onPanelChange']({ value, mode });
  };

  const getShowTime = () => {
    if (!data.showTime || typeof data.showTime === 'boolean') {
      return data.showTime;
    }
    return {
      defaultValue:
        typeof data.showTime?.defaultValue === 'string'
          ? moment(data.showTime.defaultValue, 'HH:mm:ss')
          : undefined
    };
  };

  const customDateRender = useCallback(
    (currentDate, today) => {
      if (data.customExtraText && typeof customExtraTextRef.current === 'function') {
        const {
          color = 'black',
          content = '',
          visible = true,
          style = {}
        } = customExtraTextRef.current(currentDate, today);
        return (
          <div className="ant-picker-cell-inner">
            {currentDate.date()}
            <div
              style={{
                color,
                visibility: visible ? 'visible' : 'hidden',
                ...style
              }}
            >
              {content}
            </div>
          </div>
        );
      } else if (data.useCustomDateCell) {
        return (
          <div className="ant-picker-cell-inner">
            {currentDate.date()}
            {runtime || currentDate.isSame(today, 'day')
              ? slots[SlotIds.DateCell].render({
                  inputValues: {
                    [InputIds.CurrentDate]: currentDate,
                    [InputIds.Today]: today
                  },
                  key: currentDate.valueOf()
                })
              : null}
          </div>
        );
      }

      return <div className="ant-picker-cell-inner">{currentDate.date()}</div>;
    },
    [data.useCustomDateCell, data.customExtraText]
  );

  const disabledDateConfig = useCallback(
    (current: Moment | undefined) => {
      if (!data.useDisabledDate || data.useDisabledDate === 'default' || !current) return false;
      const disabledRules = (data.staticDisabledDate ?? defaultDisabledDateRule)
        .filter((rule) => rule.checked)
        .map((rule) => {
          const date =
            rule.direction === 'before'
              ? moment().subtract(rule.offset[0], 'day').endOf('day')
              : moment().add(rule.offset[0], 'day').endOf('day');
          return {
            ...rule,
            date
          };
        });
      const currentValue = moment(current).endOf('day').valueOf();
      if (disabledRules.every((rule) => rule.direction === 'before')) {
        return currentValue < Math.max(...disabledRules.map((rule) => rule.date.valueOf()));
      }
      if (disabledRules.every((rule) => rule.direction === 'after')) {
        return currentValue > Math.min(...disabledRules.map((rule) => rule.date.valueOf()));
      }
      const beforeDisabledValue =
        disabledRules.find((rule) => rule.direction === 'before')?.date.valueOf() ?? -1;
      const afterDisabledValue =
        disabledRules.find((rule) => rule.direction === 'after')?.date.valueOf() ?? Infinity;
      return currentValue < beforeDisabledValue || currentValue > afterDisabledValue;
    },
    [data.useDisabledDate, JSON.stringify(data.staticDisabledDate)]
  );

  const finalOpen = (() => {
    if (fullOpen) return true;
    if (runtime && data.controlled) {
      return open;
    }
    return (
      (edit &&
        (data.useCustomDateCell || data.useCustomPanelHeader || data.useCustomPanelFooter) &&
        !data.hideDatePanel) ||
      env.design
    );
  })();

  useEffect(() => {
    if (runtime && data.controlled && data.closeWhenClickOutOfPanel && finalOpen) {
      const callback = function (e: MouseEvent) {
        // 如果点击到了隐藏面板的外部
        if (
          e.target !== dropdownWrapperRef.current &&
          !dropdownWrapperRef.current?.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      };

      const popupContainer = edit || debug ? env?.canvasElement : document.body;

      // 用 setTimeout 进入异步队列，错开触发 finalOpen 改变的 click 事件
      setTimeout(() => {
        popupContainer.addEventListener('click', callback);
      }, 0);

      return () => {
        popupContainer.removeEventListener('click', callback);
      };
    }
  }, [finalOpen]);

  const defaultPickerValue = useMemo(() => {
    const defaultPickerValue = moment(data.defaultPickerValue);
    if (defaultPickerValue.isValid()) {
      return defaultPickerValue;
    } else {
      return void 0;
    }
  }, [data.defaultPickerValue]);

  return (
    <ConfigProvider locale={env.vars?.locale}>
      {data.isEditable ? (
        <div className={css.datePicker} ref={wrapperRef} style={{ height: wrapperHeight }}>
          <DatePicker
            panelRender={(originPanel) => {
              return (
                <div ref={dropdownWrapperRef}>
                  {data.useCustomPanelHeader &&
                    slots[SlotIds.DatePanelHeader].render({ title: '顶部插槽' })}
                  {originPanel}
                  {data.useCustomPanelFooter &&
                    slots[SlotIds.DatePanelFooter].render({ title: '底部插槽' })}
                </div>
              );
            }}
            value={value}
            {...data.config}
            defaultPickerValue={defaultPickerValue}
            placeholder={env.i18n(data.config.placeholder)}
            dateRender={
              data.useCustomDateCell ||
              (data.customExtraText && typeof customExtraTextRef.current === 'function')
                ? customDateRender
                : undefined
            }
            showTime={getShowTime()}
            onChange={onChange}
            onPanelChange={onPanelChange}
            disabledDate={data.disabledDate || disabledDateConfig}
            getPopupContainer={(triggerNode: HTMLElement) => {
              if (fullOpen) return wrapperRef.current;
              return env?.canvasElement || document.body;
            }}
            dropdownClassName={`
              ${dropdownClassName}
              ${id} 
              ${css.datePicker} 
              ${data.useCustomDateCell ? css.slotContainer : ''}
              ${data.isWeekNumber && data.config.picker === 'week' ? css.displayWeek : ''}`}
            open={finalOpen}
            format={
              data.config.picker && data.formatMap
                ? decodeURIComponent(data.formatMap[typeMap[type]])
                : void 0
            }
            onClick={() => {
              if (runtime && data.controlled && !open) setOpen(true);
            }}
          />
        </div>
      ) : (
        transCalculation(value, decodeURIComponent(data.formatMap[typeMap[type]]), props)
      )}
    </ConfigProvider>
  );
}
