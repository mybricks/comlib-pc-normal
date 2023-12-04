import { Form, Input } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
    placeholder: string;
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
  const [value, setValue] = useState();

  useFormItemInputs(
    {
      inputs,
      outputs,
      name,
      configs: {
        setValue(val) {
          changeValue(val);
        },
        setInitialValue(val) {
          changeValue(val);
        },
        returnValue(output) {
          output(value);
        },
        resetValue() {
          changeValue(void 0);
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
            value,
            env,
            model,
            rules: data.rules
          })
            .then((r) => {
              const cutomRule = data.rules.find((i) => i.key === RuleKeys.CUSTOM_EVENT);
              if (cutomRule?.status) {
                validateRelOuputRef.current = outputRels;
                outputs['onValidate'](value);
              } else {
                outputRels(r);
              }
            })
            .catch((e) => {
              outputRels(e);
            });
        }
      }
    },
    [value]
  );

  // const onValidateTrigger = (type: string) => {
  //   data.validateTrigger?.includes(type) && validateTrigger(parentSlot, { id, name });
  // };
  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id, name });
  };

  const changeValue = useCallback((value) => {
    setValue(value);
    onChangeForFc(parentSlot, { id: id, value, name });
  }, []);

  const onChange = useCallback((e) => {
    const value = e.target.value;
    changeValue(value);
    outputs['onChange'](value);
  }, []);

  const onBlur = useCallback((e) => {
    const value = e.target.value;
    changeValue(value);
    outputs['onBlur'](value);
    onValidateTrigger();
  }, []);

  const onPressEnter = useCallback((e) => {
    const value = e.target.value;
    onValidateTrigger();
    outputs['onPressEnter'](value);
  }, []);

  useEffect(() => {
    inputs['setValidateInfo']((info: object, relOutputs) => {
      if (validateRelOuputRef.current) {
        validateRelOuputRef.current(info);
        relOutputs['setValidateInfoDone'](info);
      }
    });
  }, []);

  const inputConfig = {
    ...data.config,
    placeholder: env.i18n(data.config.placeholder),
    addonBefore: env.i18n(data.config.addonBefore),
    addonAfter: env.i18n(data.config.addonAfter)
  };

  let jsx = (
    <Input
      type="text"
      {...inputConfig}
      value={value}
      readOnly={!!edit}
      onChange={onChange}
      onBlur={onBlur}
      onPressEnter={onPressEnter}
    />
  );

  return <div>{jsx}</div>;
}
