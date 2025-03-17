import { Input, InputProps } from 'antd';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import useFormItemInputs from '../form-container/models/FormItem';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import { validateTrigger } from '../form-container/models/validate';
import { debounceValidateTrigger } from '../form-container/models/validate';
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
  /** 光标位置  */
  selectionStart?: number;
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
  const [placeholder, setPlaceholder] = useState(data.config.placeholder);
  const [autoFocus, setAutoFocus] = useState(false);

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
                debounceValidateTrigger(parentSlot, { id, name, validateInfo: r });
              }
            })
            .catch((e) => {
              outputRels(e);
              debounceValidateTrigger(parentSlot, { id, name, validateInfo: e });
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
    inputs[InputIds.GET_CURSOR_POS] &&
      inputs[InputIds.GET_CURSOR_POS]((val, relOutputs) => {
        if (relOutputs['returnCursorPosValue']) {
          if (!data.selectionStart) {
            // 默认情况下，selectionStart 光标位置为0
            data.selectionStart = 0;
          }
          relOutputs['returnCursorPosValue'](data.selectionStart);
        }
      });
  }, []);

  useEffect(() => {
    // 设置校验状态
    inputs[inputIds.SET_VALIDATE_INFO]((info: object, relOutputs) => {
      if (validateRelOutputRef.current) {
        validateRelOutputRef.current(info);
        relOutputs['setValidateInfoDone'](info);
        debounceValidateTrigger(parentSlot, { id, name, validateInfo: info });
      }
    });
  }, []);

  useEffect(() => {
    //设置是否默认聚焦
    inputs['setAutoFocus']?.((flag: boolean, relOutputs) => {
      setAutoFocus(!!flag);
      !!flag ? inputRef.current?.focus() : null;
      relOutputs['setAutoFocusDone'](!!flag);
    });
  }, []);

  useEffect(() => {
    //设置占位符
    inputs['setPlaceholder']((value, relOutputs) => {
      setPlaceholder(value);
      relOutputs['setPlaceholderDone'](value);
    });
  });

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id: id, name: name });
  };

  const changeValue = useCallback((val) => {
    setValue(val);
    valueRef.current = val;
    onChangeForFc(parentSlot, { id: id, name: name, value: val });
    // 外部IO改变值时，更改光标位置: selectionStart 为字符串最后一个位置
    data.selectionStart = val ? String(val).length : 0;
  }, []);

  const onChange = useCallback((e) => {
    const val = e.target.value;
    console.warn('onChange', val);
    changeValue(val);
    outputs['onChange'](val);
  }, []);

  const onBlur = useCallback((e) => {
    const value = e.target.value;
    changeValue(value);
    onValidateTrigger();
    // 失焦，更新光标位置
    data.selectionStart = e.target.selectionStart ?? 0;
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

    /** 同时使用 rows 和 autoSize 属性，可设置文本区域的初始行数 */
    return {
      rows: data.minRows,
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
        autoFocus={autoFocus}
        placeholder={env.i18n(placeholder)}
        value={value}
        readOnly={!!edit}
        {...sizeConfig}
        onChange={onChange}
        onBlur={onBlur}
        onPressEnter={onPressEnter}
        maxLength={data.config.maxLength && data.config.maxLength > 0 ? data.config.maxLength : void 0} // 兼容 antd5 中 maxLength 为 -1 时 outofrange 的问题
      />
    </div>
  ) : (
    <span style={{ whiteSpace: 'pre-wrap' }}>{value}</span>
  );
}
