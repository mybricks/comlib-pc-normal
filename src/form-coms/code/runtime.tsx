import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Input } from 'antd';
import { Data } from './constants';
import CodeEditor from './CodeLocal';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import useFormItemInputs from '../form-container/models/FormItem';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { validateTrigger } from '../form-container/models/validate';
import { InputIds, OutputIds } from '../types';

export default function ({
  data,
  inputs,
  outputs,
  env,
  id,
  parentSlot,
  name
}: RuntimeParams<Data>) {
  const [value, setValue] = useState<string>();
  const validateRelOuputRef = useRef<any>(null);

  const validate = useCallback(
    (model, outputRels) => {
      validateFormItem({
        value,
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
            outputs[OutputIds.OnValidate](value);
          } else {
            outputRels(r);
          }
        })
        .catch((e) => {
          outputRels(e);
        });
    },
    [value]
  );

  useFormItemInputs(
    {
      id,
      name,
      inputs,
      outputs,
      configs: {
        setValue: setValue,
        setInitialValue: setValue,
        returnValue(output) {
          output(value);
        },
        resetValue() {
          setValue(void 0);
        },
        setDisabled() {
          data.readOnly = true;
        },
        setEnabled() {
          data.readOnly = false;
        },
        setIsEnabled(val) {
          if (val === true) {
            data.readOnly = false;
          } else if (val === false) {
            data.readOnly = true;
          }
        },
        validate
      }
    },
    [value]
  );

  useEffect(() => {
    // 设置校验状态
    inputs[InputIds.SetValidateInfo]((info: object, relOutputs) => {
      if (validateRelOuputRef.current) {
        validateRelOuputRef.current(info);
        relOutputs['setValidateInfoDone'](info);
      }
    });
  }, []);

  const onChange = (value: string) => {
    setValue(value);
    onChangeForFc(parentSlot, { id, name, value });
    outputs.onChange(value);
    validateTrigger(parentSlot, { id, name });
  };

  return env.runtime ? (
    <CodeEditor
      value={value}
      onChange={onChange}
      config={{ ...data.aceConfig, placeholder: env.i18n(data.aceConfig.placeholder) }}
      readOnly={data.readOnly}
    />
  ) : (
    <Input.TextArea
      value={value}
      rows={data.aceConfig.minLines}
      placeholder={env.i18n(data.aceConfig.placeholder)}
      readOnly={true}
    />
  );
}
