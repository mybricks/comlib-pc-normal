import { Form, Input } from 'antd';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { validateFormItem } from '../utils/validator';

interface Data {
  value: string | undefined;
  rules: any[];
  config: {
    allowClear: boolean;
    disabled: boolean;
    addonBefore: string;
    addonAfter: string;
    showCount: boolean;
    maxLength?: number;
  };
}

export default function ({ env, data, _inputs, inputs, _outputs, outputs }: RuntimeParams<Data>) {
  const { edit } = env;

  useLayoutEffect(() => {
    //1.设置值
    inputs['setValue']((val) => {
      data.value = val;
      outputs['onChange'](data.value);
    });
    //2.校验
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
    //3.获取值
    inputs['getValue']((val, outputRels) => {
      outputRels['returnValue'](data.value);
    });
    //4.重置值
    inputs['resetValue'](() => {
      data.value = void 0;
    });
    //5.设置禁用
    inputs['setDisabled'](() => {
      data.config.disabled = true;
    });
    //6.设置启用
    inputs['setEnabled'](() => {
      data.config.disabled = false;
    });
  }, []);

  const changeValue = useCallback((e) => {
    const value = e.target.value;
    data.value = value;
    outputs['onChange'](value);
  }, []);

  const onBlur = useCallback((e) => {
    const value = e.target.value;
    data.value = value;
    outputs['onBlur'](value);
  }, []);

  let jsx = (
    <Input
      type="text"
      {...data.config}
      value={data.value}
      readOnly={!!edit}
      onChange={changeValue}
      onBlur={onBlur}
    />
  );

  return <div>{jsx}</div>;
}
