import { Switch, SwitchProps } from 'antd';
import React, { useCallback } from 'react';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateFormItem } from '../utils/validator';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { StatusEnum } from './const';

export interface Data {
  value: boolean | undefined;
  rules: any[];
  textMap: {
    [StatusEnum.check]: string;
    [StatusEnum.unCheck]: string;
  };
  config: SwitchProps;
}

export default function ({
  env,
  data,
  _inputs,
  inputs,
  _outputs,
  outputs,
  parentSlot,
  id,
  name
}: RuntimeParams<Data>) {
  const { edit } = env;

  useFormItemInputs({
    inputs,
    outputs,
    name,
    configs: {
      setValue(val) {
        data.config.checked = val;
      },
      setInitialValue(val) {
        data.config.checked = val;
      },
      returnValue(output) {
        output(data.config.checked);
      },
      resetValue() {
        data.config.checked = false;
      },
      setDisabled() {
        data.config.disabled = true;
      },
      setEnabled() {
        data.config.disabled = false;
      },
      validate(output) {
        validateFormItem({
          value: data.config.checked,
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

  const changeValue = useCallback((checked) => {
    if (env.edit) return;
    data.config.checked = checked;
    onChangeForFc(parentSlot, { id: id, value: checked, name: name });
    outputs['onChange'](checked);
  }, []);

  return (
    <Switch
      {...data.config}
      onChange={changeValue}
      // onBlur={onBlur}
    />
  );
}
