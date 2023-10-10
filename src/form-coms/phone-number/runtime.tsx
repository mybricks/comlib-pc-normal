import { Form, Input } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateTrigger } from '../form-container/models/validate';
import { validateFormItem, RuleKeys } from '../utils/validator';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
export interface Data {
  value: string | undefined;
  rules: any[];
  validateTrigger: string[];
  config: {
    allowClear: boolean;
    disabled: boolean;
    addonBefore: string;
    addonAfter: string;
  };
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
        data.value = val;
      },
      setInitialValue(val) {
        data.value = val;
      },
      returnValue(output) {
        output(data.value);
      },
      resetValue() {
        data.value = void 0;
      },
      setDisabled() {
        data.config.disabled = true;
      },
      setEnabled() {
        data.config.disabled = false;
      },
      validate(model, outputRels) {
        validateFormItem({
          value: data.value,
          env,
          model,
          rules: data.rules
        })
          .then((r) => {
            const cutomRule = data.rules.find((i) => i.key === RuleKeys.CUSTOM_EVENT);
            if (cutomRule?.status) {
              validateRelOuputRef.current = outputRels;
              outputs['onValidate'](data.value);
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

  // const onValidateTrigger = (type: string) => {
  //   data.validateTrigger?.includes(type) && validateTrigger(parentSlot, { id, name });
  // };
  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id, name });
  };

  const changeValue = useCallback((e) => {
    const value = e.target.value;
    data.value = value;
    onChangeForFc(parentSlot, { id: id, value, name });
    outputs['onChange'](value);
  }, []);

  const onBlur = useCallback((e) => {
    const value = e.target.value;
    data.value = value;
    outputs['onBlur'](value);
    onValidateTrigger();
  }, []);

  const onPressEnter = useCallback((e) => {
    const value = e.target.value;
    onValidateTrigger();
    outputs['onPressEnter'](value);
  }, []);

  useEffect(() => {
    inputs['setValidateInfo']((info: object) => {
      if (validateRelOuputRef.current) {
        validateRelOuputRef.current(info);
      }
    });
  }, []);

  let jsx = (
    <Input
      type="text"
      {...data.config}
      value={data.value}
      readOnly={!!edit}
      onChange={changeValue}
      onBlur={onBlur}
      onPressEnter={onPressEnter}
    />
  );

  return <div>{jsx}</div>;
}
