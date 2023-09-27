import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { InputNumber } from 'antd';
import { validateFormItem } from '../utils/validator';
import css from './runtime.less';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
export interface Data {
  options: any[];
  rules: any[];
  config: {
    disabled: boolean;
    placeholder: string;
    addonBefore: string;
    addonAfter: string;
    precision: number;
    step: number;
  };
  isFormatter: boolean;
  charPostion: 'prefix' | 'suffix';
  character: string;
}

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, inputs, outputs, env, parentSlot } = props;
  const [value, setValue] = useState<string | number>();
  useFormItemInputs(
    {
      id: props.id,
      name: props.name,
      inputs,
      outputs,
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
          setValue(void 0);
        },
        setDisabled() {
          data.config.disabled = true;
        },
        setEnabled() {
          data.config.disabled = false;
        },
        validate(model, outputRels) {
          validateFormItem({
            value,
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
    validateTrigger(parentSlot, { id: props.id, name: props.name });
  };

  const onChange = (value) => {
    setValue(value);
    onChangeForFc(parentSlot, { id: props.id, name: props.name, value });
    outputs['onChange'](value);
  };

  const onBlur = useCallback(
    (e) => {
      onValidateTrigger();
      outputs['onBlur'](value);
    },
    [value]
  );

  const onPressEnter = useCallback(
    (e) => {
      onValidateTrigger();
      outputs['onPressEnter'](value);
    },
    [value]
  );

  //数字输入框实时校验位数, 多的小数位禁止输入
  const NumberProps = useMemo(() => {
    return {
      formatter: (value: any) => {
        let reStr = '\\d'.repeat(data.config.precision);
        let reg;
        if (data.config.precision === 0) {
          reg = `${value}`.replace(/^(\-)*(\d+)\.().*$/, '$1$2');
        } else {
          reg = `${value}`.replace(eval('/^(\\-)*(\\d+)\\.(' + reStr + ').*$/'), '$1$2.$3');
        }
        if (reg !== '') {
          if (data.isFormatter && data.charPostion === 'suffix') {
            reg = `${reg}${data.character}`;
          }
          if (data.isFormatter && data.charPostion === 'prefix') {
            reg = `${data.character}${reg}`;
          }
        }
        return reg;
      }
    };
  }, [value, data.character, data.isFormatter]);

  //转换回数字的方式
  const ParserProps = useMemo(() => {
    return {
      parser: (value: any) => {
        if (data.isFormatter) {
          let parser = value.replace(`${data.character}`, '');
          return parser;
        } else {
          return value;
        }
      }
    };
  }, [value, data.character, data.isFormatter]);

  return (
    <div className={css.inputNumber}>
      <InputNumber<string | number>
        value={value}
        {...data.config}
        {...NumberProps}
        {...ParserProps}
        onChange={onChange}
        onBlur={onBlur}
        onPressEnter={onPressEnter}
      />
    </div>
  );
}
