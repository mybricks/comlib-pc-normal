import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Radio } from 'antd';
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
      outputs['onChange'](val);
    });

    inputs['setDisabled']((val) => {
      data.config.disabled = val;
    });

    inputs['setOptions']((val) => {
      data.options = val;
    });

    inputs['setVisible']((val) => {
      data.visible = val;
    });
  }, []);

  const onChange = useCallback((e) => {
    const { value } = e.target;
    data.value = value;
    outputs['onChange'](value);
  }, []);

  return (
    data.visible && (
      <div>
        <Radio.Group {...data.config} value={data.value} onChange={onChange}>
          {(data.options || data.staticOptions)?.map((item, radioIdx) => {
            const label = item.label;
            return (
              <Radio value={item.value} disabled={item.disabled} style={{ marginRight: 8 }}>
                {label}
              </Radio>
            );
          })}
        </Radio.Group>
      </div>
    )
  );
}
