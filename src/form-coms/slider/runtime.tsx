import React, { useCallback, useLayoutEffect } from 'react';
import { InputNumber, Slider, Row, Col } from 'antd';
import { validateFormItem } from '../utils/validator';
import { Data } from './types';
import { valueType } from 'antd/lib/statistic/utils';
import { InputNumberProps } from 'antd/es/input-number';
import { typeCheck } from '../../utils';
import css from './runtime.less';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';

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
      validate(output) {
        validateFormItem({
          value: data.value,
          env,
          rules: data.rules
        })
          .then((r) => {
            output(r);
          })
          .catch((e) => {
            output(e);
          });
      }
    }
  });

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
    disabled: data.config.disabled
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
    <Slider {...commonProps} range={data.config.range || true} value={data.rangeValue} />
  ) : !data.useInput ? (
    <Slider {...commonProps} value={data.singleValue} />
  ) : (
    <Row>
      <Col span={data.sliderSpan}>
        <Slider {...commonProps} value={data.singleValue} />
      </Col>
      <Col className={css.inputCol} span={data.inputSpan}>
        <InputNumber {...inputNumberProps} />
      </Col>
    </Row>
  );
}
