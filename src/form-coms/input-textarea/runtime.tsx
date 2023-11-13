import { Input } from 'antd';
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
  config: {
    allowClear: boolean;
    disabled: boolean;
    placeholder: string;
    showCount: boolean;
    maxLength?: number;
  };
  minRows?: number;
  maxRows?: number;
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
  const validateRelOuputRef = useRef<any>(null);

  useFormItemInputs({
    id: id,
    name: name,
    inputs,
    outputs,
    configs: {
      setValue(val) {
        // data.value = val;
        setValue(val);
      },
      setInitialValue(val) {
        // data.value = val;
        setValue(val);
      },
      returnValue(output) {
        output(data.value);
      },
      resetValue() {
        // data.value = void 0;
        setValue(void 0);
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
          value: data.value,
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
              outputs[outputIds.ON_VALIDATE](data.value);
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

  useLayoutEffect(() => {
    /**
     * @description 设置字体颜色
     */
    inputs[InputIds.SetColor] &&
      inputs[InputIds.SetColor]((color) => {
        if (inputRef?.current?.resizableTextArea?.textArea) {
          inputRef.current.resizableTextArea.textArea.style.color = color;
        }
      });
  }, []);

  useEffect(() => {
    // 设置校验状态
    inputs[inputIds.SET_VALIDATE_INFO]((info: object) => {
      if (validateRelOuputRef.current) {
        validateRelOuputRef.current(info);
      }
    });
  }, []);

  useEffect(() => {
    data.value = value;
  }, [value]);

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id: id, name: name });
  };

  const changeValue = useCallback((e) => {
    const value = e.target.value;
    // data.value = value;
    setValue(value);
    onChangeForFc(parentSlot, { id: id, name: name, value });
    outputs['onChange'](value);
  }, []);

  const onBlur = useCallback((e) => {
    const value = e.target.value;
    onValidateTrigger();
    // data.value = value;
    setValue(value);
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

  return (
    <div>
      <Input.TextArea
        ref={inputRef}
        {...data.config}
        // value={data.value}
        value={value}
        readOnly={!!edit}
        {...sizeConfig}
        onChange={changeValue}
        onBlur={onBlur}
        onPressEnter={onPressEnter}
      />
    </div>
  );
}
