import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { InputNumber, Slider, Row, Col } from 'antd';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import { Data } from './types';
import { valueType } from 'antd/lib/statistic/utils';
import { InputNumberProps } from 'antd/es/input-number';
import { typeCheck } from '../../utils';
import css from './runtime.less';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { InputIds, OutputIds } from '../types';

export default function Runtime({
  env,
  data,
  inputs,
  outputs,
  logger,
  parentSlot,
  id,
  name
}: RuntimeParams<Data>) {
  const validateRelOutputRef = useRef<any>(null);

  const [value, setValue] = useState<any>();
  const [singleValue, setSingleValue] = useState<any>();
  const [rangeValue, setRangeValue] = useState<any>();
  const valueRef = useRef<any>();

  useFormItemInputs(
    {
      inputs,
      outputs,
      name,
      configs: {
        setValue(val) {
          changeValue(val);
        },
        setInitialValue(val) {
          changeValue(val);
        },
        returnValue(output) {
          output(valueRef.current);
        },
        resetValue() {
          changeValue(void 0);
        },
        setDisabled() {
          data.config.disabled = true;
        },
        setEnabled() {
          data.config.disabled = false;
        },
        setIsEnabled(val) {
          if (val === true) {
            data.config.disabled = false;
          } else if (val === false) {
            data.config.disabled = true;
          }
        },
        validate(model, outputRels) {
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
                validateRelOutputRef.current = outputRels;
                outputs[OutputIds.OnValidate](valueRef.current);
              } else {
                outputRels(r);
              }
            })
            .catch((e) => {
              outputRels(e);
            });
        }
      }
    },
    [value, singleValue, rangeValue]
  );
  useEffect(() => {
    // 设置校验状态
    inputs[InputIds.SetValidateInfo]((info: object, relOutputs) => {
      if (validateRelOutputRef.current) {
        validateRelOutputRef.current(info);
        relOutputs['setValidateInfoDone'](info);
      }
    });
  }, []);

  /**监听事件和格式化函数 */
  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id, name });
  };

  const changeValue = useCallback((val) => {
    if (val === undefined) {
      // 迂回重置视图
      setValue(0);
      setSingleValue(0);
      setRangeValue([0, 0]);
      setSingleValue(void 0);
      setRangeValue(void 0);
    }
    setValue(val);
    valueRef.current = val;
    if (typeCheck(val, 'number')) {
      setSingleValue(val);
    }
    if (typeCheck(val, 'array')) {
      setRangeValue(val);
    }
    onChangeForFc(parentSlot, { id: id, value: val, name });
  }, []);

  const onChange = useCallback((val) => {
    changeValue(val);
    outputs['onChange'](val);
  }, []);

  const onAfterChange = useCallback((val) => {
    changeValue(val);
    outputs['onChange'](val);
    onValidateTrigger();
  }, []);
  const formatter = useCallback(
    (value?: valueType) => `${value}${data.formatter || ''}`,
    [data.formatter]
  );

  /**组件props */
  const commonProps = {
    onChange: changeValue,
    onAfterChange,
    tipFormatter: formatter,
    disabled: data.config.disabled,
    min: data.config.min,
    max: data.config.max
  };
  const inputNumberProps: InputNumberProps = {
    value: singleValue,
    min: data.config.min,
    max: data.config.max,
    disabled: data.config.disabled,
    style: {
      width: '100%'
    },
    onChange,
    formatter
  };

  return data.config.range ? (
    <Slider
      {...commonProps}
      className={css.antSliderHorizontal}
      range={data.config.range || true}
      value={rangeValue}
    />
  ) : !data.useInput ? (
    <Slider {...commonProps} className={css.antSliderHorizontal} value={singleValue} />
  ) : (
    <Row>
      <Col span={data.sliderSpan}>
        <Slider {...commonProps} className={css.antSliderHorizontal} value={singleValue} />
      </Col>
      <Col className={css.inputCol} span={data.inputSpan}>
        <InputNumber {...inputNumberProps} />
      </Col>
    </Row>
  );
}
