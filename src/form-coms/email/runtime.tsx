import { Form, Input, InputProps } from 'antd';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateFormItem, RuleKeys } from '../utils/validator';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';

export interface Data {
  value: string | undefined;
  rules: any[];
  validateTrigger: string[];
  config: InputProps;
}

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, inputs, outputs, env, parentSlot } = props;
  const { edit } = env;
  const validateRelOutputRef = useRef<any>(null);
  const [value, setValue] = useState();
  const valueRef = useRef<any>();

  useFormItemInputs(
    {
      id: props.id,
      name: props.name,
      inputs,
      outputs,
      configs: {
        setValue(val) {
          changeValue(val);
        },
        setInitialValue(val) {
          changeValue(val);
        },
        returnValue(output) {
          output(valueRef.current);
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
            value: valueRef.current,
            env,
            model,
            rules: data.rules
          })
            .then((r) => {
              const customRule = data.rules.find((i) => i.key === RuleKeys.CUSTOM_EVENT);
              if (customRule?.status) {
                validateRelOutputRef.current = outputRels;
                outputs['onValidate'](valueRef.current);
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

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id: props.id, name: props.name });
  };
  // const onValidateTrigger = (type: string) => {
  //   data.validateTrigger?.includes(type) &&
  //   validateTrigger(parentSlot, { id: props.id, name: props.name });
  // };

  const changeValue = useCallback((val) => {
    setValue(val);
    valueRef.current = val;
    onChangeForFc(parentSlot, { id: props.id, name: props.name, value: val });
  }, []);

  const onChange = useCallback((e) => {
    const val = e.target.value;
    changeValue(val);
    outputs['onChange'](val);
  }, []);

  const onBlur = useCallback((e) => {
    const val = e.target.value;
    changeValue(val);
    onValidateTrigger();
    // onValidateTrigger(ValidateTriggerType.OnBlur);
    outputs['onBlur'](val);
  }, []);

  useEffect(() => {
    inputs['setValidateInfo']((info: object, outputRels) => {
      if (validateRelOutputRef.current) {
        validateRelOutputRef.current(info);
        outputRels['setValidateInfoDone'](info);
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
    />
  );

  return <div>{jsx}</div>;
}
