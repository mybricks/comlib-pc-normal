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
  const validateRelOutputRef = useRef<any>(null);
  const valueRef = useRef<any>();

  const validate = useCallback(
    (model, outputRels) => {
      validateFormItem({
        value: valueRef.current,
        env,
        model,
        rules: data.rules
      })
        .then((r) => {
          const customRule = (data.rules || defaultRules).find(
            (i) => i.key === RuleKeys.CUSTOM_EVENT
          );
          if (customRule?.status) {
            validateRelOutputRef.current = outputRels;
            outputs[OutputIds.OnValidate](valueRef.current);
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
      if (validateRelOutputRef.current) {
        validateRelOutputRef.current(info);
        relOutputs['setValidateInfoDone'](info);
      }
    });
  }, []);

  const changeValue = (val) => {
    valueRef.current = val;
    setValue(val);
    onChangeForFc(parentSlot, { id, name, value: val });
  };

  const onChange = (val: string) => {
    changeValue(val);
    outputs.onChange(val);
    validateTrigger(parentSlot, { id, name });
  };

  return env.runtime ? (
    <CodeEditor
      value={value}
      onChange={onChange}
      valueRef={valueRef}
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
