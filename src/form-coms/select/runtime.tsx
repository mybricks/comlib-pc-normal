import React, { useCallback, useRef, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Select, Spin } from 'antd';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import { Data } from './types';
import css from './runtime.less';
import { typeCheck, i18nFn } from '../../utils';
import { InputIds, OutputIds, ValidateTriggerType } from '../types';
import { debounceValidateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { useConnector } from "../../utils/connector";
import { ConnectorFiledName } from "./constants";

const DefaultOptionKey = '_id';

/**
 * 计算表单项的输出值
 * @params data 组件数据
 */
const getOutputValue = (data, env, value) => {
  const getOutputValuefromValue = (val, index?) => {
    if (val?.value) val = val.value;
    let result = val;
    if (val == null) return result;
    if (data.config.labelInValue) {
      const option = data.config.options?.find((i) => i.value === val) || {};
      const { value, label } = option;
      result = {
        value,
        label: env.i18n(label)
      };
    }
    if (data.outputValueType === 'option') {
      const { [DefaultOptionKey]: id, ...res } =
        data.config.options.find((i) => i.value === val) || {};
      result = {
        ...res,
        label: env.i18n(res.label)
      };
    }
    return result;
  };

  let outputValue: any = value;
  if (Array.isArray(outputValue)) {
    outputValue = outputValue.map(getOutputValuefromValue);
  } else {
    outputValue = getOutputValuefromValue(outputValue);
  }

  return outputValue;
};

const getFieldNames = (data: getRouterData) => {
  const fieldNames = {
    label: data.labelFieldName || 'label',
    value: data.valueFieldName || 'value',
    disabled: data.disabledFieldName || 'disabled',
    checked: data.checkedFieldName || 'checked'
  };

  return fieldNames;
};

export default function Runtime({
  env,
  data,
  inputs,
  outputs,
  slots,
  logger,
  parentSlot,
  id,
  name,
  title
}: RuntimeParams<Data>) {
  //fetching, 是否开启loading的开关
  const [fetching, setFetching] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const validateRelOutputRef = useRef<any>(null);
  const [value, setValue] = useState<any>(data.value);
  const valueRef = useRef<any>(data.value);
  const [color, setColor] = useState('');
  // 有连接器时默认空数组数，否则使用静态配置
  const [selectOptions, setSelectOptions] = useState(data[ConnectorFiledName] ? [] : data.staticOptions);

  const { edit, runtime } = env;
  const debug = !!(runtime && runtime.debug);
  /**
   * 类型校验方法
   */
  const valueTypeCheck = useMemo(() => {
    if (data.config.mode && ['multiple', 'tags'].includes(data.config.mode)) {
      return {
        type: ['ARRAY', 'UNDEFINED', 'NULL'],
        message: `${title}组件:【设置值】参数必须是数组！`
      };
    }
    return {
      type: ['NUMBER', 'BOOLEAN', 'STRING', 'UNDEFINED', 'NULL'],
      message: `${title}组件:【设置值】参数必须是基本类型！`
    };
  }, [data.config.mode, data.config.labelInValue]);

  const optionConnectorState = useConnector({ env, connector: data[ConnectorFiledName] }, (promise, state) => {
    if (!state.stop) {
      setFetching(true);
      promise.then((optoins) => {
        if (!state.stop) {
          inputsSetOptions(optoins, null);
        }
      }).finally(() => {
        if (!state.stop) {
          setFetching(false);
        }
      })
    }
  })

  const inputsSetOptions = useCallback((ds, relOutputs) => {
    if (Array.isArray(ds)) {
      const fieldNames = getFieldNames(data);
      const newOptions = data.customField
        ? ds.map((item) => {
            return {
              ...(fieldNames.value in item
                ? {
                    value: item[fieldNames.value]
                  }
                : {}),
              ...(fieldNames.label in item
                ? {
                    label: item[fieldNames.label]
                  }
                : {}),
              ...(fieldNames.disabled in item
                ? {
                    disabled: item[fieldNames.disabled]
                  }
                : {}),
              ...(fieldNames.checked in item
                ? {
                    checked: item[fieldNames.checked]
                  }
                : {})
            };
          })
        : ds;
      if (env.runtime) {
        data.config.options = [...newOptions];
      }
      setSelectOptions([...newOptions]);
      relOutputs?.['setOptionsDone'](ds);

      //计算值更新
      let newValArray: any[] = [],
        newVal;
      let updateValue = false;
      newOptions.map((item) => {
        const { checked, value } = item;
        if (checked && value != undefined) {
          updateValue = true;
          newVal = value;
          newValArray.push(value);
        }
      });
      if (updateValue) {
        if (data.config.mode && ['tags', 'multiple'].includes(data.config.mode)) {
          changeValue(newValArray);
        }
        if (!data.config.mode || data.config.mode === 'default') {
          changeValue(newVal);
        }
      }
    } else {
      logger.warn(`${title}组件:【设置数据源】参数必须是{label, value}数组！`);
    }
    setFetching(false);
  }, [])

  useLayoutEffect(() => {
    if (env.edit || data.value !== undefined) changeValue(data.value);
  }, [data.value]);

  useLayoutEffect(() => {
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
            const outputValue = getOutputValue(data, env, valueRef.current);
            outputs[OutputIds.OnValidate](outputValue);
          } else {
            outputRels['returnValidate'](r);
            debounceValidateTrigger(parentSlot, {
              id,
              name,
              validateInfo: r
            });
          }
        })
        .catch((e) => {
          outputRels['returnValidate'](e);
          debounceValidateTrigger(parentSlot, {
            id,
            name,
            validateInfo: e
          });
        });
    });

    inputs['getValue']((val, outputRels) => {
      const outputValue = getOutputValue(data, env, valueRef.current);
      outputRels['returnValue'](outputValue);
    });

    inputs['setValue']((val, relOutputs) => {
      if (!typeCheck(val, valueTypeCheck.type)) {
        logger.warn(valueTypeCheck.message);
      } else {
        const outputValue = changeValue(val);
        outputs[OutputIds.OnChange](outputValue);
      }
      if (relOutputs['setValueDone']) {
        relOutputs['setValueDone'](val);
      }
    });

    inputs['setInitialValue'] &&
      inputs['setInitialValue']((val, relOutputs) => {
        if (!typeCheck(val, valueTypeCheck.type)) {
          logger.warn(valueTypeCheck.message);
        } else {
          const outputValue = changeValue(val);
          outputs[OutputIds.OnInitial](outputValue);
        }
        if (relOutputs['setInitialValueDone']) {
          relOutputs['setInitialValueDone'](val);
        }
      });

    inputs['resetValue']((_, relOutputs) => {
      changeValue(void 0);
      if (relOutputs['resetValueDone']) {
        relOutputs['resetValueDone']();
      }
    });

    inputs['setOptions']((ds, relOutputs) => {
      optionConnectorState.stop = true;
      inputsSetOptions(ds, relOutputs)
    })

    // inputs['setOptions']((ds, relOutputs) => {
    //   if (Array.isArray(ds)) {
    //     const fieldNames = getFieldNames(data);
    //     const newOptions = data.customField
    //       ? ds.map((item) => {
    //           return {
    //             ...(fieldNames.value in item
    //               ? {
    //                   value: item[fieldNames.value]
    //                 }
    //               : {}),
    //             ...(fieldNames.label in item
    //               ? {
    //                   label: item[fieldNames.label]
    //                 }
    //               : {}),
    //             ...(fieldNames.disabled in item
    //               ? {
    //                   disabled: item[fieldNames.disabled]
    //                 }
    //               : {}),
    //             ...(fieldNames.checked in item
    //               ? {
    //                   checked: item[fieldNames.checked]
    //                 }
    //               : {})
    //           };
    //         })
    //       : ds;
    //     data.config.options = [...newOptions];
    //     relOutputs['setOptionsDone'](ds);

    //     //计算值更新
    //     let newValArray: any[] = [],
    //       newVal;
    //     let updateValue = false;
    //     newOptions.map((item) => {
    //       const { checked, value } = item;
    //       if (checked && value != undefined) {
    //         updateValue = true;
    //         newVal = value;
    //         newValArray.push(value);
    //       }
    //     });
    //     if (updateValue) {
    //       if (data.config.mode && ['tags', 'multiple'].includes(data.config.mode)) {
    //         changeValue(newValArray);
    //       }
    //       if (!data.config.mode || data.config.mode === 'default') {
    //         changeValue(newVal);
    //       }
    //     }
    //   } else {
    //     logger.warn(`${title}组件:【设置数据源】参数必须是{label, value}数组！`);
    //   }
    //   setFetching(false);
    // });

    inputs['setLoading']((val: boolean, relOutputs) => {
      data.config = {
        ...data.config,
        loading: val
      };
      relOutputs['setLoadingDone'](val);
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
        if (relOutputs['isEnableDone']) {
          relOutputs['isEnableDone'](val);
        }
      } else {
        data.config.disabled = true;
        if (relOutputs['isEnableDone']) {
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

    // 设置校验状态
    inputs[InputIds.SetValidateInfo]((info: object, relOutputs) => {
      if (validateRelOutputRef.current) {
        validateRelOutputRef.current(info);
        relOutputs['setValidateInfoDone'](info);
        debounceValidateTrigger(parentSlot, {
          id,
          name: name,
          validateInfo: info
        });
      }
    });
    // 设置下拉框字体颜色
    inputs[InputIds.SetColor]((color: string, relOutputs) => {
      if (typeof color === 'string') {
        setColor(color);
        relOutputs['setColorDone'](color);
      }
    });
  }, [value]);

  useEffect(() => {
    const isNumberString = new RegExp(/^\d*$/);
    let maxHeight = data.maxHeight == '0' ? null : data.maxHeight;
    if (maxHeight && isNumberString.test(maxHeight)) {
      maxHeight = maxHeight + 'px';
    }
    // ref.current?.querySelector('select')?.style.setProperty('--select--selection-overflow-max-height', maxHeight);
  }, [data.maxHeight]);

  const onValidateTrigger = (type: string) => {
    data.validateTrigger?.includes(type) && debounceValidateTrigger(parentSlot, { id, name });
  };

  const changeValue = useCallback((value) => {
    if (value == undefined) {
      if (data.config.mode !== "default") {
        // 模式为多选和标签时，默认值为空数组
        value = []
      }
    }
    setValue(value);
    valueRef.current = value;
    const outputValue = getOutputValue(data, env, value);
    onChangeForFc(parentSlot, { id: id, value: outputValue, name });
    return outputValue;
  }, [data.config.mode]);

  const onChange = useCallback((val) => {
    const outputValue = changeValue(val);
    outputs['onChange'](outputValue);
    onValidateTrigger(ValidateTriggerType.OnChange);
  }, []);

  const onBlur = useCallback((e) => {
    const outputValue = getOutputValue(data, env, valueRef.current);
    onValidateTrigger(ValidateTriggerType.OnBlur);
    outputs['onBlur'](outputValue);
  }, []);

  const onSearch = (e) => {
    //开启远程搜索功能
    if (data.dropdownSearchOption) {
      optionConnectorState.stop = true;
      setFetching(true);
      outputs['remoteSearch'](e);
    }
    //1、远程数据源
    if (data.dropdownSearchOption === true && !e && data.resetOptionsWhenEmptySearch) {
      data.config.options = [];
      setSelectOptions([]);
      optionConnectorState.stop = true;
      setFetching(false);
    }
    //2、本地数据源, 不做处理
  };

  const { options, ...configs } = data.config;
  const renderOptions = data.slotAfterOption
    ? void 0
    : i18nFn(selectOptions, env);

  const OptionsWithSlot = () => {
    if (!data.slotAfterOption) return null;
    return (
      <>
        {(env.edit ? [{ label: '搭建占位', value: 1 }] : selectOptions)?.map((opt, inx) => {
          return (
            <Select.Option value={opt.value} label={opt.label} key={opt.value}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <div
                  style={{
                    flex: 1,
                    width: '100%'
                  }}
                >
                  {opt.label}
                </div>
                <div
                  onClick={(e) => {
                    // 阻止触发选项选中事件
                    e.stopPropagation();
                  }}
                  style={{
                    minWidth: env.edit ? '60px' : void 0
                  }}
                >
                  {slots[data.slotAfterOption]?.render({
                    key: data.slotAfterOption,
                    inputValues: {
                      option: opt,
                      index: inx
                    }
                  })}
                </div>
              </div>
            </Select.Option>
          );
        })}
      </>
    );
  };

  const getPopContainer = (triggerNode) => {
    if (data.mount === undefined) {
      data.mount = 'body';
    }
    // 预览态 和发布后 没有env.runtime.debug
    if (env.runtime && !env.runtime.debug) {
      return data.mount === 'current' ? triggerNode : env?.canvasElement || document.body;
    }
    // 其他情况
    return env?.canvasElement || document.body;
  };

  return (
    <div className={`${css.select} ${color ? css.selectColor : ''} ${ANTD_VERSION === 5 ? css.antd5Select : ''}`} ref={ref} id="area">
      {data.isEditable ? (
        <Select
          {...configs}
          placeholder={env.i18n(data.config.placeholder)}
          labelInValue={false}
          showArrow={data.config.showArrow}
          options={renderOptions}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          getPopupContainer={(triggerNode: HTMLElement) => getPopContainer(triggerNode)}
          maxTagCount={data.maxTagCount}
          dropdownClassName={id}
          listHeight={data.maxHeight ? Number(data.maxHeight) : void 0}
          placement={data.placement || 'bottomLeft'}
          optionLabelProp={'label'}
          style={{
            color: color
          }}
          open={
            env.design || (env.edit && data.slotAfterOption && !data.hidePopWhenEdit)
              ? true
              : void 0
          }
          onSearch={data.config.showSearch ? onSearch : void 0}
          notFoundContent={data.dropdownSearchOption && fetching ? <Spin size="small" /> : void 0}
        >
          {OptionsWithSlot()}
        </Select>
      ) : (
        <div>{Array.isArray(value) ? value.join(',') : value}</div>
      )}
    </div>
  );
}
