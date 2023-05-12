import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Radio, Space } from 'antd';
import { validateFormItem } from '../utils/validator';
import { Data } from './types';
import { uuid } from '../../utils';
import { Option } from '../types';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import css from './runtime.less';

export default function Runtime({
  env,
  data,
  inputs,
  outputs,
  parentSlot,
  id,
  name
}: RuntimeParams<Data>) {
  useFormItemInputs({
    name,
    id,
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
            key: `${uuid()}`,
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
            key: `${uuid()}`,
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
    validateTrigger(parentSlot, { id, name });
  };

  const onChange = useCallback((e) => {
    const { value } = e.target;
    data.value = value;
    onChangeForFc(parentSlot, { id: id, value, name });
    outputs['onChange'](value);
    onValidateTrigger();
  }, []);

  return (
    <div className={css.radio}>
      <Radio.Group
        optionType={data.enableButtonStyle ? 'button' : 'default'}
        buttonStyle={data.buttonStyle}
        disabled={data.config.disabled}
        value={data.value}
        onChange={onChange}
      >
        <Space direction={data.layout === 'vertical' ? 'vertical' : void 0}>
          {(env.edit ? data.staticOptions : data.config.options)?.map((item, radioIdx) => {
            const label = item.label;
            return (
              <Radio
                key={item.key}
                value={item.value}
                disabled={item.disabled}
                checked={item.checked}
                style={{ marginRight: 8 }}
              >
                {label}
              </Radio>
            );
          })}
        </Space>
      </Radio.Group>
    </div>
  );
}
