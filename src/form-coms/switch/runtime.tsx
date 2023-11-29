import { Switch, SwitchProps } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import useFormItemInputs from '../form-container/models/FormItem';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { StatusEnum } from './const';
import { InputIds, OutputIds } from '../types';

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
  const validateRelOuputRef = useRef<any>(null);

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
      setIsEnabled(val) {
        if (val === true) {
          data.config.disabled = false;
        } else if (val === false) {
          data.config.disabled = true;
        }
      },
      validate(model, outputRels) {
        validateFormItem({
          value: data.config.checked,
          env,
          model,
          rules: data.rules
        })
          .then((r) => {
            const cutomRule = (data.rules || defaultRules).find(
              (i) => i.key === RuleKeys.CUSTOM_EVENT
            );
            if (cutomRule?.status) {
              validateRelOuputRef.current = outputRels;
              outputs[OutputIds.OnValidate](data.config.checked);
            } else {
              outputRels(r);
            }
          })
          .catch((e) => {
            outputRels(e);
          });
      }
    }
  });

  useEffect(() => {
    // 设置校验状态
    inputs[InputIds.SetValidateInfo]((info: object, relOutputs) => {
      if (validateRelOuputRef.current) {
        validateRelOuputRef.current(info);
        relOutputs['setValidateInfoDone'](info);
      }
    });
  }, []);

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
