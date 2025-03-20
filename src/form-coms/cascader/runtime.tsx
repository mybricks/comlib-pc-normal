import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Cascader, CascaderProps, message } from 'antd';
import type { FieldNames } from 'rc-cascader';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import css from './runtime.less';
import useFormItemInputs from '../form-container/models/FormItem';
import { debounceValidateTrigger } from '../form-container/models/validate';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { mockData } from './mockData';
import { InputIds, OutputIds } from '../types';
import { setDataForLoadData } from './utils';

export interface Data {
  options: any[];
  placeholder: string;
  isMultiple: boolean;
  maxTagCountType?: string;
  value: number[] | string[];
  rules: any[];
  config: CascaderProps<any[]>;
  isEditable: boolean;
  fieldNames: FieldNames;
  mount?: string;
  useLoadData: boolean;
  loadDataOnce: boolean;
}

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, inputs, outputs, title, logger, env, parentSlot, id } = props;
  const [options, setOptions] = useState(env.design ? mockData : []);
  const validateRelOutputRef = useRef<any>(null);
  const valueRef = useRef<any>();
  const { edit, runtime } = env;
  const debug = !!(runtime && runtime.debug);
  const [value, setValue] = useState<Array<any>>();
  const curNode = useRef({});

  useEffect(() => {
    if (env.runtime.debug?.prototype) {
      setOptions([
        {
          label: 'aaa',
          value: 'aaa',
          children: []
        },
        {
          label: 'bbb',
          value: 'bbb',
          children: [
            {
              label: 'ddd',
              value: 'ddd',
              children: []
            },
            {
              label: 'eee',
              value: 'eee',
              children: []
            }
          ]
        },
        {
          label: 'ccc',
          value: 'ccc',
          children: []
        }
      ]);
    }
  }, [env.runtime.debug?.prototype]);

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
                debounceValidateTrigger(parentSlot, {
                  id: props.id,
                  name: props.name,
                  validateInfo: r
                });
              }
            })
            .catch((e) => {
              outputRels(e);
              debounceValidateTrigger(parentSlot, {
                id: props.id,
                name: props.name,
                validateInfo: e
              });
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
        debounceValidateTrigger(parentSlot, { id: props.id, name: props.name, validateInfo: info });
        relOutputs['setValidateInfoDone'](info);
      }
    });
  }, []);

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id: props.id, name: props.name });
  };

  const changeValue = (val) => {
    if (
      Array.isArray(val) &&
      !Array.isArray(val[0]) &&
      ['object', 'function'].includes(typeof val[0])
    ) {
      logger.warn(`${title}组件:【设置值】参数类型错误！`);
      if (env.runtime?.debug) {
        message.warn(`${title}组件:【设置值】参数类型错误！`);
      }
      return;
    }
    setValue(val);
    valueRef.current = val;
    onChangeForFc(parentSlot, { id: props.id, name: props.name, value: val });
  };

  const getAllValues = (optionsArray: Array<Record<string, any>>, pre: Array<string>) => {
    let values = [];
    optionsArray.forEach((option) => {
      if (option[data.fieldNames.children]?.length) {
        values.push(
          ...getAllValues(option[data.fieldNames.children], [
            ...pre,
            option[data.fieldNames?.value]
          ])
        );
      } else {
        values.push([...pre, option[data.fieldNames?.value]]);
      }
    });
    return values;
  };

  const onChange = (val, selectedOptions) => {
    let useFormatted = data.isCheckAutoWithChildren === true && data.isMultiple;
    let flattedVal: Array<any> = [];
    // 多选模式下，为true时，某一项选项全选，带上下一级children的信息
    // 例如[{label: 'A', value: 'A', children: [{ label: 'BB', value: 'BB'}, {label: 'CC', val: 'CC}]}], 选中[['A']]后，处理后的值是[['A', 'BB'], ['A', 'CC']]
    if (data.isCheckAutoWithChildren === true && data.isMultiple) {
      if (val.length) {
        selectedOptions.forEach((selectedOpt, index) => {
          let last = selectedOpt[selectedOpt.length - 1];
          if (last[data.fieldNames.children]?.length) {
            flattedVal.push(...getAllValues(last[data.fieldNames.children], val[index]));
          } else {
            if (Array.isArray(val[index])) {
              flattedVal.push(val[index] as Array<any>);
            }
          }
        });
      }
    }
    changeValue(useFormatted ? flattedVal : val);
    outputs['onChange'](useFormatted ? flattedVal : val);
    onValidateTrigger();
  };

  const getPopContainer = (triggerNode) => {
    if (data.mount === undefined) {
      data.mount = 'body';
    }
    // 预览态 和发布后 没有env.runtime.debug
    if (env.runtime && !env.runtime.debug) {
      return data.mount === 'current' ? triggerNode : env?.canvasElement || document.body;
    }
    // 其他情况
    return env?.canvasElement || document.body;
  };


  useEffect(() => {
    inputs['setLoadData']((val, relOutputs) => {
      if (!data.useLoadData) {
        return;
      }
      const { node, resolve } = curNode.current as any;
      const targetOption = node[node.length - 1];
      if(Array.isArray(val)){
        setOptions(setDataForLoadData(data, targetOption, options, val));
        relOutputs['setLoadDataDone'](val);
      }else{
        logger.error('请设置数组类型子项数据');
      }
      resolve();
    });
  }, [options]);

  const onLoadData = (node) => {
    return new Promise((resolve) => {
      curNode.current = {
        node,
        resolve
      };
      outputs['loadData'](node[node.length - 1]);
    });
  };

  return (
    <div className={`${css.cascader}`}>
      {data.isEditable ? (
        <Cascader
          value={value}
          options={options}
          fieldNames={data.fieldNames}
          {...data.config}
          placeholder={env.i18n(data.config.placeholder)}
          multiple={data.isMultiple}
          onChange={onChange}
          open={env.design ? true : void 0}
          dropdownClassName={id}
          getPopupContainer={(triggerNode: HTMLElement) => getPopContainer(triggerNode)}
          loadData={data.useLoadData ? onLoadData : undefined}
        />
      ) : Array.isArray(value) ? (
        value.join(',')
      ) : (
        value
      )}
    </div>
  );
}
