import React, { useLayoutEffect, useState } from 'react';
import { Cascader } from 'antd';
import { validateFormItem } from '../utils/validator';
import css from './runtime.less';

interface Data {
  options: any[];
  visible: boolean;
  placeholder: string;
  isMultiple: boolean;
  maxTagCountType?: string;
  value: number[] | string[];
  rules: any[];
  config: {
    placeholder: string;
    allowClear: boolean;
    disabled: boolean;
    maxTagCount?: 'responsive' | number;
    changeOnSelect: boolean;
    showSearch: boolean;
  };
}

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, inputs, outputs, env } = props;
  const [options, setOptions] = useState();

  useLayoutEffect(() => {
    inputs['setValue']((val) => {
      data.value = val;
      onChange(val);
    });

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
  }, [data.value]);

  //重置，
  inputs['resetValue'](() => {
    data.value = [];
  });
  //设置显示
  inputs['setVisible'](() => {
    data.visible = true;
  });
  //设置隐藏
  inputs['setInvisible'](() => {
    data.visible = false;
  });
  //设置禁用
  inputs['setDisabled'](() => {
    data.config.disabled = true;
  });
  //设置启用
  inputs['setEnabled'](() => {
    data.config.disabled = false;
  });
  //输入数据源
  inputs['setOptions']((value) => {
    setOptions(value);
  });

  const onChange = (value) => {
    data.value = value;
    outputs['onChange'](value);
  };

  return (
    data.visible && (
      <div className={css.cascader}>
        <Cascader
          value={data.value}
          options={options}
          {...data.config}
          multiple={data.isMultiple}
          onChange={onChange}
        />
      </div>
    )
  );
}
