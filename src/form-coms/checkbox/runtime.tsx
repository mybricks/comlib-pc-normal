import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Checkbox } from 'antd';
import { validateFormItem } from '../utils/validator';
import { Data } from './type';

export default function Runtime({ env, data, inputs, outputs }: RuntimeParams<Data>) {
  data.config.options = data.staticOptions;
  data.value = data.config.defaultValue;
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
        <Checkbox.Group {...data.config} onChange={onChange}>
          {data.config?.options?.map((item, radioIdx) => {
            const label = item.label;
            return (
              <div data-radio-form-item-radio-index={radioIdx} key={item.key || item.value}>
                {
                  <Checkbox value={item.value} disabled={item.disabled} style={{ marginRight: 8 }}>
                    {label}
                  </Checkbox>
                }
              </div>
            );
          })}
        </Checkbox.Group>
      </div>
    )
  );
}
