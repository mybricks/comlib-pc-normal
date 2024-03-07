import React, { useCallback, useRef, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Select, Spin } from 'antd';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import { Data } from './types';
import css from './runtime.less';
import { typeCheck, i18nFn } from '../../utils';
import { InputIds, OutputIds, ValidateTriggerType } from '../types';
import { debounceValidateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';

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

export default function Runtime({
  env,
  data,
  inputs,
  outputs,
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
          }
        })
        .catch((e) => {
          outputRels['returnValidate'](e);
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
      if (Array.isArray(ds)) {
        data.config.options = [...ds];
        relOutputs['setOptionsDone'](ds);

        //计算值更新
        let newValArray: any[] = [],
          newVal;
        let updateValue = false;
        ds.map((item) => {
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
    });

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
      }
    });
    // 设置下拉框字体颜色
    inputs[InputIds.SetColor]((color: string, relOutputs) => {
      const target = ref.current?.querySelector?.('.ant-select-selection-item') as HTMLSpanElement;
      if (target) {
        target.style.color = typeof color === 'string' ? color : '';
      }
      relOutputs['setColorDone'](color);
    });
  }, [value]);

  useEffect(() => {
    const isNumberString = new RegExp(/^\d*$/);
    let maxHeight = data.maxHeight == '0' ? null : data.maxHeight;
    if (maxHeight && isNumberString.test(maxHeight)) {
      maxHeight = maxHeight + 'px';
    }
    ref.current?.style.setProperty('--select--selection-overflow-max-height', maxHeight);
  }, [data.maxHeight]);

  const onValidateTrigger = (type: string) => {
    data.validateTrigger?.includes(type) && debounceValidateTrigger(parentSlot, { id, name });
  };

  const changeValue = useCallback((value) => {
    if (value == undefined) {
      setValue('');
    }
    setValue(value);
    valueRef.current = value;
    const outputValue = getOutputValue(data, env, value);
    onChangeForFc(parentSlot, { id: id, value: outputValue, name });
    return outputValue;
  }, []);

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
      setFetching(true);
      outputs['remoteSearch'](e);
    }
    //1、远程数据源
    if (data.dropdownSearchOption === true && !e && data.resetOptionsWhenEmptySearch) {
      data.config.options = [];
      setFetching(false);
    }
    //2、本地数据源, 不做处理
  };

  return (
    <div className={css.select} ref={ref} id="area">
      {data.isEditable ? (
        <Select
          {...data.config}
          placeholder={env.i18n(data.config.placeholder)}
          labelInValue={false}
          showArrow={data.config.showArrow}
          options={env.edit ? i18nFn(data.staticOptions, env) : i18nFn(data.config.options, env)}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          getPopupContainer={(triggerNode: HTMLElement) => env?.canvasElement || document.body}
          maxTagCount={data.maxTagCount}
          dropdownClassName={id}
          open={env.design ? true : void 0}
          onSearch={data.config.showSearch ? onSearch : void 0}
          notFoundContent={data.dropdownSearchOption && fetching ? <Spin size="small" /> : void 0}
        />
      ) : (
        <div>{Array.isArray(value) ? value.join(',') : value}</div>
      )}
    </div>
  );
}
