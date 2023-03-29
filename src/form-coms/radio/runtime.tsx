import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Radio } from 'antd';
import { validateFormItem } from '../utils/validator';
import { Data } from './types';
import { uuid } from '../../utils';
import { Option } from '../types';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateTrigger } from '../form-container/models/validate';

export default function Runtime({
  env,
  data,
  inputs,
  outputs,
  parentSlot,
  id
}: RuntimeParams<Data>) {
  useFormItemInputs({
    inputs,
    outputs,
    configs: {
      setValue(val) {
        data.value = val;
      },
      setInitialValue(val) {
        data.value = val;
      },
      returnValue(output) {
        output(data.value);
      },
      resetValue() {
        data.value = '';
        data.value = void 0;
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

  useLayoutEffect(() => {
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
  }, []);

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id });
  };

  const onChange = useCallback((e) => {
    const { value } = e.target;
    data.value = value;
    outputs['onChange'](value);
    onValidateTrigger();
  }, []);

  return (
    <div>
      <Radio.Group
        optionType={data.enableButtonStyle ? 'button' : 'default'}
        buttonStyle={data.buttonStyle}
        {...data.config}
        value={data.value}
        onChange={onChange}
      >
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
