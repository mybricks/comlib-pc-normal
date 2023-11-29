import React, { useLayoutEffect, useState, ReactNode, useCallback, useRef, useEffect } from 'react';
import { Rate } from 'antd';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import * as Icons from '@ant-design/icons';
import css from './runtime.less';
import useFormItemInputs from '../form-container/models/FormItem';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { validateTrigger } from '../form-container/models/validate';
import { InputIds, OutputIds } from '../types';

export interface Data {
  options: any[];
  isChoose: boolean;
  choose: string;
  font: string;
  icon?: string;
  color?: string;
  rules: any[];
  config: {
    disabled: boolean;
    defaultValue: number;
    count: number;
  };
}

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, inputs, outputs, env, parentSlot, id, name } = props;
  const [value, setValue] = useState<number>(data.config.defaultValue);
  const validateRelOuputRef = useRef<any>(null);

  useFormItemInputs(
    {
      inputs,
      outputs,
      name,
      configs: {
        setValue(val) {
          setValue(val);
        },
        setInitialValue(val) {
          setValue(val);
        },
        returnValue(output) {
          output(value);
        },
        resetValue() {
          setValue(0);
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
            value: value,
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
        }
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

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id, name: name });
  };

  //1、值变化
  const onChange = useCallback((value) => {
    setValue(value);
    onChangeForFc(parentSlot, { id: id, name: name, value });
    onValidateTrigger();
    outputs['onChange'](value);
  }, []);

  const btnItemR = ({ icon }: { icon: ReactNode }) => {
    const Icon = Icons && Icons[icon as string]?.render();
    return <>{Icon}</>;
  };

  return (
    <div>
      <Rate
        allowHalf={true}
        {...data.config}
        value={value}
        onChange={onChange}
        character={
          data.isChoose && (data.choose === 'font' || 'icon')
            ? data.choose === 'font'
              ? env.i18n(data.font)
              : btnItemR({ icon: data.icon })
            : void 0
        }
        style={{ color: data.color }}
      ></Rate>
    </div>
  );
}
