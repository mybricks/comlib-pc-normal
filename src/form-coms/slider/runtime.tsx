import React, { useCallback, useLayoutEffect } from 'react';
import { InputNumber, Slider, Row, Col } from 'antd';
import { validateFormItem } from '../utils/validator';
import { Data } from './types';
import { valueType } from 'antd/lib/statistic/utils';
import { InputNumberProps } from 'antd/es/input-number';
import { typeCheck } from '../../utils';
import css from './runtime.less';

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
      onChange(val);
    });

    inputs['resetValue'](() => {
      // 迂回重置视图
      data.value = 0;
      data.singleValue = 0;
      data.rangeValue = [0, 0];
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

  /**监听事件和格式化函数 */
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
  const commonProps = {
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
