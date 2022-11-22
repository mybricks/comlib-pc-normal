import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Radio } from 'antd';
import { validateFormItem } from '../utils/validator';
import { Data } from './types';
import { uuid } from '../../utils';
import { Option } from '../types';

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

    inputs['resetValue'](() => {
      data.value = void 0;
    });

    inputs['setOptions']((ds) => {
      let tempDs: Option[] = [];
      if (Array.isArray(ds)) {
        ds.forEach((item, index) => {
          tempDs.push({
            checked: false,
            disabled: false,
            lable: `单选框${index}`,
            value: `${uuid()}`,
            ...item
          });
        });
      } else {
        tempDs = [
          {
            checked: false,
            disabled: false,
            lable: `单选框`,
            value: `${uuid()}`,
            ...(ds || {})
          }
        ];
      }
      let newVal;
      tempDs.map((radio) => {
        const { checked, value } = radio;
        if (checked && value != undefined) {
          newVal = value;
        }
      });
      data.value = newVal;
      data.config.options = tempDs;
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

  const onChange = useCallback((e) => {
    const { value } = e.target;
    data.value = value;
    outputs['onChange'](value);
  }, []);

  return (
    <div>
      <Radio.Group {...data.config} value={data.value} onChange={onChange}>
        {(env.edit ? data.staticOptions : data.config.options)?.map((item, radioIdx) => {
          const label = item.label;
          return (
            <Radio
              key={item.value}
              value={item.value}
              disabled={item.disabled}
              checked={item.checked}
              style={{ marginRight: 8 }}
            >
              {label}
            </Radio>
          );
        })}
      </Radio.Group>
    </div>
  );
}
