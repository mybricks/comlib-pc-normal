import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { InputNumber, Slider, Row, Col } from 'antd';
import { validateFormItem } from '../utils/validator';
import { Data } from './types';
import { valueType } from 'antd/lib/statistic/utils';
import { SliderSingleProps, SliderRangeProps } from 'antd/es/slider';
import { InputNumberProps } from 'antd/es/input-number';
import { typeCheck } from '../../utils';

export default function Runtime({ env, data, inputs, outputs, logger }: RuntimeParams<Data>) {
  useLayoutEffect(() => {
    inputs['validate']((val, outputRels) => {
      validateFormItem({
        value: data.value,
        env,
        rules: data.rules
      })
        .then((r) => {
          outputRels['returnValidate'](r);
        })
        .catch((e) => {
          outputRels['returnValidate'](e);
        });
    });

    inputs['getValue']((val, outputRels) => {
      outputRels['returnValue'](data.value);
    });

    inputs['setValue']((val) => {
      data.value = val;
      outputs['onChange'](val);
    });

    inputs['resetValue'](() => {
      data.value = void 0;
      data.singleValue = void 0;
      data.rangeValue = void 0;
    });

    //设置禁用
    inputs['setDisabled'](() => {
      data.config.disabled = true;
    });
    //设置启用
    inputs['setEnabled'](() => {
      data.config.disabled = false;
    });
  }, []);

  /**更新表单项的值 */
  useEffect(() => {
    if (data.config.range) {
      data.value = data.rangeValue;
    } else {
      data.value = data.singleValue;
    }
  }, [data.singleValue, data.rangeValue, data.config.range]);

  /**监听事件和格式化函数 */
  const changeValue = useCallback((val) => {
    data.value = val;
    if (typeCheck(val, 'number')) {
      console.log('data.singleValue');
      data.singleValue = val;
    }
    if (typeCheck(val, 'array')) {
      console.log('data.array');
      data.rangeValue = val;
    }
  }, []);
  const onChange = useCallback((val) => {
    changeValue(val);
    outputs['onChange'](val);
  }, []);
  const onAfterChange = useCallback((val) => {
    changeValue(val);
    outputs['onChange'](val);
  }, []);
  const formatter = useCallback(
    (value?: valueType) => `${value}${data.formatter || ''}`,
    [data.formatter]
  );

  /**组件props */
  const singleProps: SliderSingleProps = {
    value: data.singleValue,
    onChange: changeValue,
    style: {
      width: '100%',
      padding: '5px',
      height: '32px'
    },
    onAfterChange,
    tipFormatter: formatter
  };
  const rangeProps: SliderRangeProps = {
    value: data.rangeValue,
    range: data.config.range || true,
    style: {
      width: '100%',
      padding: '5px',
      height: '32px'
    },
    onChange: changeValue,
    onAfterChange,
    tipFormatter: formatter
  };
  const inputNumberProps: InputNumberProps = {
    value: data.singleValue,
    min: data.config.min,
    max: data.config.max,
    style: {
      width: '100%'
    },
    onChange,
    formatter
  };

  return (
    data.visible &&
    (data.config.range ? (
      <Slider {...rangeProps} />
    ) : !data.useInput ? (
      <Slider {...singleProps} />
    ) : (
      <Row gutter={10}>
        <Col span={data.sliderSpan}>
          <Slider {...singleProps} />
        </Col>
        <Col span={data.inputSpan} data-slider-input="inputnumber">
          <InputNumber {...inputNumberProps} />
        </Col>
      </Row>
    ))
  );
}
