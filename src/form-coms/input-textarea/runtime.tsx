import { Input, InputProps } from 'antd';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import useFormItemInputs from '../form-container/models/FormItem';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { TextAreaRef } from 'antd/lib/input/TextArea';
import { inputIds, outputIds } from '../form-container/constants';
import { InputIds } from '../types';

export interface Data {
  value: string | undefined;
  rules: any[];
  config: InputProps;
  minRows?: number;
  maxRows?: number;

  isEditable: boolean;
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
  const [value, setValue] = useState();

  const inputRef = useRef<TextAreaRef>(null);
  const validateRelOutputRef = useRef<any>(null);
  const valueRef = useRef<any>();

  useFormItemInputs(
    {
      id: id,
      name: name,
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
        setIsEditable(val) {
          data.isEditable = val;
        },
        validate(model, outputRels) {
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
                outputs[outputIds.ON_VALIDATE](valueRef.current);
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

  useLayoutEffect(() => {
    /**
     * @description 设置字体颜色
     */
    inputs[InputIds.SetColor] &&
      inputs[InputIds.SetColor]((color, relOutputs) => {
        if (inputRef?.current?.resizableTextArea?.textArea) {
          inputRef.current.resizableTextArea.textArea.style.color = color;
          relOutputs['setColorDone'](color);
        }
      });
  }, []);

  useEffect(() => {
    // 设置校验状态
    inputs[inputIds.SET_VALIDATE_INFO]((info: object, relOutputs) => {
      if (validateRelOutputRef.current) {
        validateRelOutputRef.current(info);
        relOutputs['setValidateInfoDone'](info);
      }
    });
  }, []);

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id: id, name: name });
  };

  const changeValue = useCallback((val) => {
    setValue(val);
    valueRef.current = val;
    onChangeForFc(parentSlot, { id: id, name: name, value: val });
  }, []);

  const onChange = useCallback((e) => {
    const val = e.target.value;
    changeValue(val);
    outputs['onChange'](val);
  }, []);

  const onBlur = useCallback((e) => {
    const value = e.target.value;
    changeValue(value);
    onValidateTrigger();
    outputs['onBlur'](value);
  }, []);

  const onPressEnter = useCallback((e) => {
    const value = e.target.value;
    onValidateTrigger();
    outputs['onPressEnter'](value);
  }, []);

  const sizeConfig = useMemo(() => {
    if (env.edit) {
      return {
        rows: data.minRows
      };
    }

    return {
      autoSize: {
        minRows: data.minRows,
        maxRows: data.maxRows
      }
    };
  }, [env.edit, data.minRows, data.maxRows]);

  return data.isEditable ? (
    <div>
      <Input.TextArea
        ref={inputRef}
        {...data.config}
        placeholder={env.i18n(data.config.placeholder)}
        value={value}
        readOnly={!!edit}
        {...sizeConfig}
        onChange={onChange}
        onBlur={onBlur}
        onPressEnter={onPressEnter}
      />
    </div>
  ) : (
    <span style={{ whiteSpace: 'pre-wrap' }}>{value}</span>
  );
}
