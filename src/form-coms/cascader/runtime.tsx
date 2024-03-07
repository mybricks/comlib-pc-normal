import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Cascader, CascaderProps } from 'antd';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import css from './runtime.less';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { mockData } from './mockData';
import { InputIds, OutputIds } from '../types';

export interface Data {
  options: any[];
  placeholder: string;
  isMultiple: boolean;
  maxTagCountType?: string;
  value: number[] | string[];
  rules: any[];
  config: CascaderProps<any[]>;
  isEditable: boolean;
}

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, inputs, outputs, env, parentSlot, id } = props;
  const [options, setOptions] = useState(env.design ? mockData : []);
  const validateRelOutputRef = useRef<any>(null);
  const valueRef = useRef<any>();
  const { edit, runtime } = env;
  const debug = !!(runtime && runtime.debug);
  const [value, setValue] = useState();

  useEffect(() => {
    if (env.runtime.debug?.prototype) {
      setOptions([{
        label: "aaa",
        value: "aaa",
        children: []
      }, {
        label: "bbb",
        value: "bbb",
        children: [{
          label: "ddd",
          value: "ddd",
          children: []
        }, {
          label: "eee",
          value: "eee",
          children: []
        }]
      }, {
        label: "ccc",
        value: "ccc",
        children: []
      }])
    }
  }, [env.runtime.debug?.prototype])

  useFormItemInputs(
    {
      id: props.id,
      name: props.name,
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
                outputs[OutputIds.OnValidate](valueRef.current);
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
    //输入数据源
    inputs['setOptions']((opts, relOutputs) => {
      setOptions(opts);
      relOutputs['setOptionsDone'](opts);
    });
    // 设置校验状态
    inputs[InputIds.SetValidateInfo]((info: object, relOutputs) => {
      if (validateRelOutputRef.current) {
        validateRelOutputRef.current(info);
        relOutputs['setValidateInfoDone'](info);
      }
    });
  }, []);

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id: props.id, name: props.name });
  };

  const changeValue = (val) => {
    setValue(val);
    valueRef.current = val;
    onChangeForFc(parentSlot, { id: props.id, name: props.name, value: val });
  };

  const onChange = (val) => {
    changeValue(val);
    outputs['onChange'](val);
    onValidateTrigger();
  };

  return (
    <div className={css.cascader}>
      {data.isEditable ? (
        <Cascader
          value={value}
          options={options}
          {...data.config}
          placeholder={env.i18n(data.config.placeholder)}
          multiple={data.isMultiple}
          onChange={onChange}
          open={env.design ? true : void 0}
          dropdownClassName={id}
          getPopupContainer={(triggerNode: HTMLElement) => env?.canvasElement || document.body}
        />
      ) : Array.isArray(value) ? (
        value.join(',')
      ) : (
        value
      )}
    </div>
  );
}
