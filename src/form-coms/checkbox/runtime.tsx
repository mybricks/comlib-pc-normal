import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Alert, Checkbox } from 'antd';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import { Data } from './types';
import { InputIds, OutputIds } from '../types';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import css from './runtime.less';
import { typeCheck } from '../../utils';

export default function Runtime({
  env,
  data,
  inputs,
  outputs,
  logger,
  parentSlot,
  id,
  title,
  name
}: RuntimeParams<Data>) {
  const validateRelOuputRef = useRef<any>(null);
  const [activeFontColor, setActiveFontColor] = useState('');
  const [single, setSingle] = useState<boolean>(false);

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
            outputs[OutputIds.OnValidate](data.value);
          } else {
            outputRels['returnValidate'](r);
          }
        })
        .catch((e) => {
          outputRels['returnValidate'](e);
        });
    });

    inputs['getValue']((val, outputRels) => {
      outputRels['returnValue'](data.value);
    });

    inputs['setValue']((val, outputRels) => {
      if (!typeCheck(val, ['Array', 'Undefined', 'NULL'])) {
        logger.warn(`${title}组件:【设置值】参数必须是数组！`);
      } else {
        changeValue(val);
        outputRels['setValueDone'](val);
        outputs['onChange'](data.value);
      }
    });

    inputs['setInitialValue'] &&
      inputs['setInitialValue']((val, outputRels) => {
        if (!typeCheck(val, ['Array', 'Undefined', 'NULL'])) {
          logger.warn(`${title}组件:【设置值】参数必须是数组！`);
        } else {
          changeValue(val);
          outputRels['setInitialValueDone'](val);
          outputs[OutputIds.OnInitial](val);
        }
      });

    inputs['resetValue']((_, outputRels) => {
      changeValue(undefined);
      outputRels['resetValueDone']();
    });

    //设置禁用
    inputs['setDisabled']((_, outputRels) => {
      data.config.disabled = true;
      outputRels['setDisabledDone']();
    });
    //设置启用
    inputs['setEnabled']((_, outputRels) => {
      data.config.disabled = false;
      outputRels['setEnabledDone']();
    });

    //设置启用/禁用
    inputs['isEnable']((val, outputRels) => {
      if (val === true) {
        data.config.disabled = false;
        outputRels['isEnableDone'](val);
      } else {
        data.config.disabled = true;
        outputRels['isEnableDone'](val);
      }
    });

    //设置数据源
    inputs['setOptions']((ds, outputRels) => {
      if (Array.isArray(ds)) {
        data.config.options = [...ds];
        outputRels['setOptionsDone'](ds);
        let newValArray: any[] = [];
        ds.map((item) => {
          const { checked, value } = item;
          if (checked && value != undefined) {
            newValArray.push(value);
          }
        });
        newValArray.length ? (data.value = newValArray) : void 0;
      } else {
        logger.warn(`${title}组件:【设置数据源】参数必须是{label, value}数组！`);
      }
    });
    // 设置校验状态
    inputs[InputIds.SetValidateInfo]((info: object, relOutputs) => {
      if (validateRelOuputRef.current) {
        validateRelOuputRef.current(info);
        relOutputs['setValidateInfoDone'](info);
      }
    });

    // 设置激活选项字体的颜色
    inputs['setActiveFontColor']((color: string, relOutputs) => {
      if (typeof color === 'string') {
        setActiveFontColor(color);
        relOutputs['setActiveFontColorDone'](color);
      }
    });
  }, []);

  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  // 校验触发
  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id, name });
  };
  // data.value变化事件
  const changeValue = useCallback((checkedValue?: any[]) => {
    if (Array.isArray(checkedValue)) {
      setIndeterminate(!!checkedValue.length && checkedValue.length < data.config.options.length);
      setCheckAll(checkedValue.length === data.config.options.length);
      data.value = checkedValue;
    } else {
      setIndeterminate(false);
      setCheckAll(false);
      data.value = [];
      data.value = checkedValue;
    }
    onChangeForFc(parentSlot, { id, name, value: checkedValue });
  }, []);

  // 多选框组监听事件
  const onChange = useCallback((checkedValue) => {
    changeValue(checkedValue);
    outputs['onChange'](checkedValue);
    onValidateTrigger();
  }, []);

  // 全选框监听事件
  const onCheckAllChange = (e) => {
    changeValue(e.target.checked ? data.config.options.map((item) => item.value) : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    onChangeForFc(parentSlot, { id, name, value: data.value });
    outputs['onChange'](data.value);
    onValidateTrigger();
  };
  if (data.renderError) {
    return <Alert message={`${title}渲染错误：存在选项值未定义！`} type="error" />;
  }

  const checkboxStyle = {
    paddingBottom: data.layout === 'vertical' ? '8px' : void 0
  };

  const checkboxGroup = {
    display: data.layout === 'vertical' ? 'grid' : void 0,
    gap: data.layout === 'vertical' ? '8px' : void 0
  };

  const singlebox = {
    width: '16px'
  };

  let options = env.edit ? data.staticOptions : data.config.options;
  let newOptions = options.map((opt) => {
    return {
      ...opt,
      label: (
        <span style={{ color: data.value?.includes(opt.value) ? activeFontColor : '' }}>
          {env.i18n(opt.label)}
        </span>
      )
    };
  });

  useEffect(() => {
    if (options.length === 1 && options[0].label === '' && !data.checkAll) {
      setSingle(true);
    } else {
      setSingle(false);
    }
  }, [data.staticOptions, data.config.options, data.checkAll]);

  return (
    <div className={css.checkbox} style={single ? singlebox : void 0}>
      {data.checkAll && (
        <Checkbox
          style={checkboxStyle}
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
          disabled={data.config.disabled}
        >
          {env.i18n(data.checkAllText)}
        </Checkbox>
      )}
      <Checkbox.Group
        style={checkboxGroup}
        {...data.config}
        options={newOptions}
        value={data.value}
        onChange={onChange}
      />
    </div>
  );
}
