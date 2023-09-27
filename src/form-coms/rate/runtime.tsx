import React, { useLayoutEffect, useState, ReactNode, useCallback } from 'react';
import { Rate } from 'antd';
import { validateFormItem } from '../utils/validator';
import * as Icons from '@ant-design/icons';
import css from './runtime.less';
import useFormItemInputs from '../form-container/models/FormItem';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { validateTrigger } from '../form-container/models/validate';

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
        validate(model, outputRels) {
          validateFormItem({
            value: value,
            env,
            model,
            rules: data.rules
          })
            .then((r) => {
              outputRels(r);
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
              ? data.font
              : btnItemR({ icon: data.icon })
            : void 0
        }
        style={{ color: data.color }}
      ></Rate>
    </div>
  );
}
