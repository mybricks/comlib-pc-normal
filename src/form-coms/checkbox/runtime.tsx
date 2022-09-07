import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Checkbox } from 'antd';
import { validateFormItem } from '../utils/validator';
import { Data } from './types';

export default function Runtime({ env, data, inputs, outputs }: RuntimeParams<Data>) {
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
      onChange(val);
    });

    inputs['resetValue'](() => {
      data.value = void 0;
    });

    inputs['setDisabled']((val) => {
      data.config.disabled = val;
    });

    inputs['setOptions']((val) => {
      data.config.options = val;
    });

    inputs['setVisible']((val) => {
      data.visible = val;
    });
  }, []);

  const onChange = useCallback((checkedValue) => {
    data.value = checkedValue;
    outputs['onChange'](checkedValue);
  }, []);
  return (
    data.visible && (
      <div>
        <Checkbox.Group
          {...data.config}
          options={env.edit ? data.staticOptions : data.config.options}
          value={data.value as any}
          onChange={onChange}
        />
      </div>
    )
  );
}
