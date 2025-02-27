import { Switch, SwitchProps } from 'antd';
import React, { useCallback, useEffect, useRef, useState, useLayoutEffect } from 'react';
import useFormItemInputs from '../form-container/models/FormItem';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import { validateTrigger } from '../form-container/models/validate';
import { debounceValidateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { StatusEnum } from './const';
import { InputIds, OutputIds, ValidateInfo } from '../types';
import css from './runtime.less';

export interface Data {
  value: boolean | undefined;
  rules: any[];
  textMap: {
    [StatusEnum.check]: string;
    [StatusEnum.unCheck]: string;
  };
  config: SwitchProps;
  isEditable: boolean;
  checkedValue: any;
  uncheckedValue: any;
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
  const validateRelOutputRef = useRef<any>(null);

  const [checked, setChecked] = useState<any>(data.config.checked);
  const valueRef = useRef<any>(data.config.checked);

  useLayoutEffect(() => {
    if (env.edit || data.config.checked !== undefined) {
      setChecked(data.config.checked);
    }
    onChangeForFc(parentSlot, { id: id, value: data.config.checked, name: name });
  }, [data.config.checked]);

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
                outputs[OutputIds.OnValidate](valueRef.current);
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
    [checked]
  );

  useEffect(() => {
    // 设置校验状态
    inputs[InputIds.SetValidateInfo]((info: ValidateInfo, relOutputs) => {
      if (validateRelOutputRef.current) {
        validateRelOutputRef.current(info);
        relOutputs['setValidateInfoDone'](info);
        debounceValidateTrigger(parentSlot, { id, name, validateInfo: info });
      }
    });
  }, []);

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id, name: name });
  };

  const changeValue = useCallback((checked) => {
    if (env.edit) return;
    const valueMap = {
      [data.checkedValue]: true,
      [data.uncheckedValue]: false
    };
    setChecked(valueMap[checked]);
    valueRef.current = checked;
    onChangeForFc(parentSlot, { id: id, value: checked, name: name });
  }, []);

  const onChange = useCallback((checked) => {
    if (env.edit) return;
    const valueMap = {
      true: data.checkedValue,
      false: data.uncheckedValue
    };
    changeValue(valueMap[checked]);
    onValidateTrigger();
    outputs['onChange'](valueMap[checked]);
  }, []);

  const config = {
    ...data.config,
    checkedChildren: env.i18n(data.textMap?.[StatusEnum.check] || ''),
    unCheckedChildren: env.i18n(data.textMap?.[StatusEnum.unCheck] || '')
  };

  return (
    <div className={css.switch}>
      {data.isEditable ? (
        <Switch
          {...config}
          checked={checked}
          onChange={onChange}
          // onBlur={onBlur}
        />
      ) : (
        `${checked || false}`
      )}
    </div>
  );
}
