import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
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
  const validateRelOuputRef = useRef<any>(null);

  useFormItemInputs({
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
        output(data.value);
      },
      resetValue() {
        // 迂回重置视图
        data.value = 0;
        data.singleValue = 0;
        data.rangeValue = [0, 0];
        data.value = void 0;
        data.singleValue = void 0;
        data.rangeValue = void 0;
      },
      setDisabled() {
        data.config.disabled = true;
      },
      setEnabled() {
        data.config.disabled = false;
      },
      validate(model, outputRels) {
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
              validateRelOuputRef.current = outputRels;
              outputs[OutputIds.OnValidate](data.value);
            } else {
              outputRels(r);
            }
          })
          .catch((e) => {
            outputRels(e);
          });
      }
    }
  });
  useEffect(() => {
    // 设置校验状态
    inputs[InputIds.SetValidateInfo]((info: object) => {
      if (validateRelOuputRef.current) {
        validateRelOuputRef.current(info);
      }
    });
  }, []);

  /**监听事件和格式化函数 */
  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id, name });
  };
  const changeValue = useCallback((val) => {
    data.value = val;
    if (typeCheck(val, 'number')) {
      data.singleValue = val;
    }
    if (typeCheck(val, 'array')) {
      data.rangeValue = val;
    }
  }, []);
  const onChange = useCallback((val) => {
    changeValue(val);
    onChangeForFc(parentSlot, { id: id, value: val, name });
    outputs['onChange'](val);
  }, []);
  const onAfterChange = useCallback((val) => {
    changeValue(val);
    onChangeForFc(parentSlot, { id: id, value: val, name });
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
    value: data.singleValue,
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
      value={data.rangeValue}
    />
  ) : !data.useInput ? (
    <Slider {...commonProps} className={css.antSliderHorizontal} value={data.singleValue} />
  ) : (
    <Row>
      <Col span={data.sliderSpan}>
        <Slider {...commonProps} className={css.antSliderHorizontal} value={data.singleValue} />
      </Col>
      <Col className={css.inputCol} span={data.inputSpan}>
        <InputNumber {...inputNumberProps} />
      </Col>
    </Row>
  );
}
