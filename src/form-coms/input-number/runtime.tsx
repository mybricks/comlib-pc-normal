import React, { useState, useCallback } from 'react';
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
        validate(output) {
          validateFormItem({
            value,
            env,
            rules: data.rules
          })
            .then((r) => {
              output(r);
            })
            .catch((e) => {
              output(e);
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
  const NumberProps = {
    formatter: (value: any) => {
      let reStr = '\\d'.repeat(data.config.precision);
      let reg;
      if (data.config.precision === 0) {
        reg = `${value}`.replace(/^(\-)*(\d+)\.().*$/, '$1$2');
      } else {
        reg = `${value}`.replace(eval('/^(\\-)*(\\d+)\\.(' + reStr + ').*$/'), '$1$2.$3');
      }
      if (data.isFormatter && data.charPostion === 'suffix') {
        reg = `${reg}${data.character}`;
      }
      if (data.isFormatter && data.charPostion === 'prefix') {
        reg = `${data.character}${reg}`;
      }
      return reg;
    }
  };

  //转换回数字的方式
  const ParserProps = {
    parser: (value: any) => {
      if (data.isFormatter) {
        let parser = value.replace(`${data.character}`, '');
        return parser;
      } else {
        return value;
      }
    }
  };

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
