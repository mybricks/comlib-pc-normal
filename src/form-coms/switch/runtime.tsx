import { Switch, SwitchProps } from 'antd';
import React, { useCallback } from 'react';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateFormItem } from '../utils/validator';
import { validateTrigger } from '../form-container/models/validate';
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
      validate(model, outputRels) {
        validateFormItem({
          value: data.config.checked,
          env,
          model,
          rules: data.rules
        })
          .then((r) => {
            outputRels(r);
          })
          .catch((e) => {
            outputRels(e);
          });
      }
    }
  });

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id, name: name });
  };

  const changeValue = useCallback((checked) => {
    if (env.edit) return;
    data.config.checked = checked;
    onChangeForFc(parentSlot, { id: id, value: checked, name: name });
    onValidateTrigger();
    outputs['onChange'](checked);
  }, []);

  return (
    <div>
      <Switch
        {...data.config}
        onChange={changeValue}
        // onBlur={onBlur}
      />
    </div>
  );
}
