import React, { useLayoutEffect, useState } from 'react';
import { InputNumber } from 'antd';
import { validateFormItem } from '../utils/validator';
import css from './runtime.less';
interface Data {
  options: any[];
  rules: any[];
  visible: boolean;
  config: {
    disabled: boolean;
    placeholder: string;
    addonBefore: string;
    addonAfter: string;
    precision: number;
    step: number;
  };
}

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, inputs, outputs, env } = props;
  const [value, setValue] = useState();

  useLayoutEffect(() => {
    inputs['setValue']((val) => {
      setValue(val);
      onChange(val);
    });

    inputs['validate']((val, outputRels) => {
      validateFormItem({
        value: value,
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
      outputRels['returnValue'](value);
    });
  }, [value]);

  //重置
  inputs['resetValue'](() => {
    setValue(void 0);
  });
  //设置显示
  inputs['setVisible'](() => {
    data.visible = true;
  });
  //设置隐藏
  inputs['setInvisible'](() => {
    data.visible = false;
    console.log('数字输入框显示和隐藏', data.visible);
  });
  //设置禁用
  inputs['setDisabled'](() => {
    data.config.disabled = true;
  });
  //设置启用
  inputs['setEnabled'](() => {
    data.config.disabled = false;
  });

  const onChange = (value) => {
    setValue(value);
    outputs['onChange'](value);
  };

  inputs['setVisible']((val) => {
    data.visible = val;
  });

  return (
    data.visible && (
      <div className={css.inputNumber}>
        <InputNumber value={value} {...data.config} onChange={onChange} />
      </div>
    )
  );
}
