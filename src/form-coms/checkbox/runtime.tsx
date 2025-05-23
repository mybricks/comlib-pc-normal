import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { Alert, Checkbox } from 'antd';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import { Data } from './types';
import { InputIds, OutputIds } from '../types';
import { debounceValidateTrigger } from '../form-container/models/validate';
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
  const validateRelOutputRef = useRef<any>(null);
  const [activeFontColor, setActiveFontColor] = useState('');
  const [dynamicStyles, setDynamicStyles] = useState<{ value: any; style: CSSProperties }[]>([]);
  const [single, setSingle] = useState<boolean>(false);
  const valueRef = useRef<any>(data.value);

  const [value, setValue] = useState<any>(data.value);
  // 运行时只执行一次
  const hasSetDefaultChecked = useRef<boolean>(false);

  const handleRetunrValueByType = (checkedData:string[]) =>{
    if(data.outputValueType === 'value') {
      return valueRef.current
    }else {
      return data.config.options.filter((item)=>checkedData.includes(item.value))
    }
  }

  useLayoutEffect(() => {
    if (env.edit || data.value !== undefined) changeValue(data.value);
  }, [data.value]);

  useEffect(() => {
    // 编辑态，只改变全选框状态，不更新值
    if (env.edit) {
      setCheckAll(data.defaultCheckedAll);
    }
    if (env.runtime && hasSetDefaultChecked.current === false) {
      hasSetDefaultChecked.current = true;
      let allValues = data.config.options.map((item) => item.value);
      if (data.defaultCheckedAll) {
        allValues.length ? changeValue(data.defaultCheckedAll ? allValues : []) : void 0;
        setCheckAll(data.defaultCheckedAll);
      }
    }
  }, [data.defaultCheckedAll, hasSetDefaultChecked.current, data.value]);

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
            outputs[OutputIds.OnValidate](valueRef.current);
          } else {
            outputRels['returnValidate'](r);
            debounceValidateTrigger(parentSlot, { id, name, validateInfo: r });
          }
        })
        .catch((e) => {
          outputRels['returnValidate'](e);
          debounceValidateTrigger(parentSlot, { id, name, validateInfo: e });
        });
    });

    inputs['getValue']((val, outputRels) => {
      const returnValue = handleRetunrValueByType(valueRef.current)
      outputRels['returnValue'](returnValue);
    });

    inputs['setValue']((val, outputRels) => {
      if (!typeCheck(val, ['Array', 'Undefined', 'NULL'])) {
        logger.warn(`${title}组件:【设置值】参数必须是数组！`);
      } else {
        changeValue(val);
        const returnValue = handleRetunrValueByType(val)
        outputs['onChange'](returnValue);
      }
      outputRels['setValueDone']?.(val);
    });

    inputs['setInitialValue'] &&
      inputs['setInitialValue']((val, outputRels) => {
        if (!typeCheck(val, ['Array', 'Undefined', 'NULL'])) {
          logger.warn(`${title}组件:【设置值】参数必须是数组！`);
        } else {
          changeValue(val);
          outputs[OutputIds.OnInitial](val);
        }
        if (outputRels['setInitialValueDone']) {
          outputRels['setInitialValueDone'](val);
        }
      });

    inputs['resetValue']((_, outputRels) => {
      changeValue(undefined);
      if (outputRels['resetValueDone']()) {
        outputRels['resetValueDone']();
      }
    });

    //设置禁用
    inputs['setDisabled']((_, outputRels) => {
      data.config.disabled = true;
      if (outputRels['setDisabledDone']) {
        outputRels['setDisabledDone']();
      }
    });
    //设置启用
    inputs['setEnabled']((_, outputRels) => {
      data.config.disabled = false;
      if (outputRels['setEnabledDone']) {
        outputRels['setEnabledDone']();
      }
    });

    //设置启用/禁用
    inputs['isEnable']((val, outputRels) => {
      if (val === true) {
        data.config.disabled = false;
        if (outputRels['isEnableDone']) {
          outputRels['isEnableDone'](val);
        }
      } else {
        data.config.disabled = true;
        if (outputRels['isEnableDone']) {
          outputRels['isEnableDone'](val);
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

    //设置数据源
    inputs['setOptions']((ds, outputRels) => {
      if (Array.isArray(ds)) {
        data.config.options = [...ds];
        outputRels['setOptionsDone'](ds);
        let newValArray: any[] = [];
        // 设置数据源时，里面如果value有undefined 的选项，renderError 为true
        if (ds.every((opt) => opt.value !== undefined)) {
          data.renderError = false;
        } else {
          data.renderError = true;
        }
        let allCheckedArray = [];
        ds.map((item) => {
          const { checked, value } = item;
          if (checked && value != undefined) {
            newValArray.push(value);
          }
          if (value !== undefined) {
            allCheckedArray.push(value);
          }
        });
        if (data.defaultCheckedAll) {
          changeValue(allCheckedArray);
        } else {
          // 这里再执行一边
          // changeValue(newValArray);
          newValArray.length ? changeValue(newValArray) : void 0;
        }
        // newValArray.length ? changeValue(newValArray) : void 0;
      } else {
        logger.warn(`${title}组件:【设置数据源】参数必须是{label, value}数组！`);
      }
    });
    // 设置校验状态
    inputs[InputIds.SetValidateInfo]((info: object, relOutputs) => {
      if (validateRelOutputRef.current) {
        validateRelOutputRef.current(info);
        debounceValidateTrigger(parentSlot, { id, name, validateInfo: info });
        relOutputs['setValidateInfoDone'](info);
      }
    });

    // 设置激活选项字体的颜色
    inputs['setActiveFontColor']?.((color: string, relOutputs) => {
      if (typeof color === 'string') {
        setActiveFontColor(color);
        relOutputs['setActiveFontColorDone'](color);
      }
    });

    // 设置选项样式
    inputs['setDynamicStyles']?.((styles, relOutputs) => {
      setDynamicStyles(styles);
      relOutputs['setDynamicStylesDone'](styles);
    });

    //设置多选框，全选框的可控状态
    if (data.isIndeterminate) {
      inputs['setIndeterminate']((val: string, relOutputs) => {
        if (val === 'partChecked') {
          setIndeterminate(true);
          setCheckAll(false);
          relOutputs['setIndeterminateDone'](val);
        } else if (val === 'unChecked') {
          setCheckAll(false);
          setIndeterminate(false);
          relOutputs['setIndeterminateDone'](val);
        } else if (val === 'allChecked') {
          setCheckAll(true);
          setIndeterminate(false);
          relOutputs['setIndeterminateDone'](val);
        } else {
          console.error('传入值应该为partChecked、unChecked、allChecked');
        }
      });
    }
  }, [value]);

  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  // 校验触发
  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id, name });
  };
  // data.value变化事件
  const changeValue = useCallback((checkedValue?: any[]) => {
    if (Array.isArray(checkedValue)) {
      setIndeterminate(
        data.isIndeterminate
          ? false
          : !!checkedValue.length && checkedValue.length < data.config.options.length
      );
      setCheckAll(
        data.isIndeterminate
          ? false
          : checkedValue.length && checkedValue.length === data.config.options.length
      );
      setValue(checkedValue);
      valueRef.current = checkedValue;
    } else {
      setIndeterminate(false);
      setCheckAll(false);
      setValue([]);
      setValue(checkedValue);
      valueRef.current = checkedValue;
    }
    onChangeForFc(parentSlot, { id, name, value: checkedValue });
  }, []);

  // 多选框组监听事件
  const onChange = useCallback((checkedValue) => {
    changeValue(checkedValue);
    const returnValue = handleRetunrValueByType(checkedValue)
    outputs['onChange'](returnValue);
    onValidateTrigger();
  }, []);

  // 全选框监听事件
  const onCheckAllChange = (e) => {
    changeValue(e.target.checked ? data.config.options.map((item) => item.value) : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    onChangeForFc(parentSlot, { id, name, value: valueRef.current });
    const returnValue = handleRetunrValueByType(valueRef.current)
    outputs['onChange'](returnValue);
    onValidateTrigger();
  };

  useEffect(() => {
    if (options.length === 1 && options[0].label === '' && !data.checkAll) {
      setSingle(true);
    } else {
      setSingle(false);
    }
  }, [data.staticOptions, data.config.options, data.checkAll]);

  // if (data.renderError) {
  //   return <Alert message={`${title}渲染错误：存在选项值未定义！`} type="error" />;
  // }

  const checkboxStyle = {
    marginBottom: data.layout === 'vertical' ? '8px' : void 0
  };

  const checkboxGroup = {
    display: data.layout === 'vertical' ? 'grid' : void 0,
    gap: data.layout === 'vertical' ? '8px' : void 0
  };

  const singlebox = {
    width: '16px'
  };

  const onBubbleClick = (e) => {
    //e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  let options = env.edit ? data.staticOptions : data.config.options;
  let newOptions = options.map((opt) => {
    const dynamicStyle = dynamicStyles.find((i) => i?.value === opt.value)?.style || {};
    return {
      ...opt,
      label: (
        <span
          style={{
            color: valueRef.current?.includes(opt.value) ? activeFontColor : '',
            ...dynamicStyle
          }}
        >
          {env.i18n(opt.label)}
        </span>
      )
    };
  });

  const radioGroupChildren = useMemo(() => {
    if (env.edit) {
      return newOptions.map((item) => (
        <span data-checkbox-idx={item.key}>
          <Checkbox {...item}>{item.label}</Checkbox>
        </span>
      ));
    }
    return !data.eventBubble
      ? newOptions.map((item) => <Checkbox {...item}>{item.label}</Checkbox>)
      : newOptions.map((item) => {
          return (
            <span onClick={onBubbleClick}>
              <Checkbox
                value={item.value}
                checked={valueRef.current?.includes(item.value)}
                disabled={item.disabled}
                onClick={onBubbleClick}
              >
                {item.label}
              </Checkbox>
            </span>
          );
        });
  }, [env.edit, newOptions, data.eventBubble]);

  if (data.renderError) {
    return <Alert message={`${title}渲染错误：存在选项值未定义！`} type="error" />;
  }

  if (env.edit && data.staticOptions?.length === 0) {
    return <div className={css.suggestion}>在编辑栏中添加静态选项</div>;
  }

  return (
    <div className={`${css.checkbox} checkbox`} style={single ? singlebox : void 0}>
      {data.isEditable
        ? data.checkAll && (
            <span data-checkbox-idx={'all'}>
              <Checkbox
                style={checkboxStyle}
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}
                disabled={data.config.disabled}
                onClick={data.eventBubble ? onBubbleClick : undefined}
              >
                {env.i18n(data.checkAllText)}
              </Checkbox>
            </span>
          )
        : void 0}
      {data.isEditable ? (
        <Checkbox.Group
          style={checkboxGroup}
          // {...data.config}
          disabled={data.config.disabled}
          options={env.edit ? undefined : data.eventBubble ? undefined : newOptions}
          value={value}
          onChange={onChange}
        >
          {radioGroupChildren}
        </Checkbox.Group>
      ) : Array.isArray(value) ? (
        value.join(',')
      ) : (
        value
      )}
    </div>
  );
}
