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
const getOutputValue = (data, env) => {
  const getOutputValuefromValue = (val, index?) => {
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

  let outputValue: any = data.value;
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
  const validateRelOuputRef = useRef<any>(null);

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
    inputs['validate']((model, outputRels) => {
      validateFormItem({
        value: data.value,
        env,
        model,
        rules: data.rules
      })
        .then((r) => {
          const cutomRule = (data.rules || defaultRules).find(
            (i) => i.key === RuleKeys.CUSTOM_EVENT
          );
          if (cutomRule?.status) {
            validateRelOuputRef.current = outputRels['returnValidate'];
            const outputValue = getOutputValue(data, env);
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
      const outputValue = getOutputValue(data, env);
      outputRels['returnValue'](outputValue);
    });

    inputs['setValue']((val) => {
      if (!typeCheck(val, valueTypeCheck.type)) {
        logger.warn(valueTypeCheck.message);
      } else {
        changeValue(val);
        // data.value = val;
      }
    });

    inputs['setInitialValue'] &&
      inputs['setInitialValue']((val) => {
        if (!typeCheck(val, valueTypeCheck.type)) {
          logger.warn(valueTypeCheck.message);
        } else {
          if (val == undefined) {
            data.value = '';
          }
          data.value = val;
          const outputValue = getOutputValue(data, env);
          outputs[OutputIds.OnInitial](outputValue);
        }
      });

    inputs['resetValue'](() => {
      data.value = '';
      data.value = void 0;
    });

    inputs['setOptions']((ds) => {
      if (Array.isArray(ds)) {
        data.config.options = [...ds];

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
          if (data.config.mode && ['tags', 'multiple'].includes(data.config.mode))
            data.value = newValArray;
          if (!data.config.mode || data.config.mode === 'default') data.value = newVal;
        }
      } else {
        logger.warn(`${title}组件:【设置数据源】参数必须是{label, value}数组！`);
      }
      setFetching(false);
    });

    inputs['setLoading']((val: boolean) => {
      data.config = {
        ...data.config,
        loading: val
      };
    });

    //设置禁用
    inputs['setDisabled'](() => {
      data.config.disabled = true;
    });
    //设置启用
    inputs['setEnabled'](() => {
      data.config.disabled = false;
    });
    //设置启用/禁用
    inputs['isEnable']((val) => {
      if (val === true) {
        data.config.disabled = false;
      } else {
        data.config.disabled = true;
      }
    });

    // 设置校验状态
    inputs[InputIds.SetValidateInfo]((info: object) => {
      if (validateRelOuputRef.current) {
        validateRelOuputRef.current(info);
      }
    });
    // 设置下拉框字体颜色
    inputs[InputIds.SetColor]((color: string) => {
      const target = ref.current?.querySelector?.('.ant-select-selection-item') as HTMLSpanElement;
      if (target) {
        target.style.color = typeof color === 'string' ? color : '';
      }
    });
  }, []);

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
      data.value = '';
    }
    data.value = value;
    const outputValue = getOutputValue(data, env);
    onChangeForFc(parentSlot, { id: id, value: outputValue, name });
    outputs['onChange'](outputValue);
  }, []);

  const onChange = useCallback((val) => {
    changeValue(val);
    onValidateTrigger(ValidateTriggerType.OnChange);
  }, []);

  const onBlur = useCallback((e) => {
    const outputValue = getOutputValue(data, env);
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
    if (!e && data.dropdownSearchOption === true) {
      data.config.options = [];
      setFetching(false);
    }
    //2、本地数据源, 不做处理
  };

  return (
    <div className={css.select} ref={ref} id="area">
      <Select
        {...data.config}
        placeholder={env.i18n(data.config.placeholder)}
        labelInValue={false}
        showArrow={data.config.showArrow}
        options={env.edit ? i18nFn(data.staticOptions, env) : i18nFn(data.config.options, env)}
        value={data.value}
        onChange={onChange}
        onBlur={onBlur}
        getPopupContainer={(triggerNode: HTMLElement) => env?.canvasElement || document.body}
        maxTagCount={data.maxTagCount}
        dropdownClassName={id}
        open={env.design ? true : void 0}
        onSearch={data.config.showSearch ? onSearch : void 0}
        notFoundContent={data.dropdownSearchOption && fetching ? <Spin size="small" /> : void 0}
      />
    </div>
  );
}
