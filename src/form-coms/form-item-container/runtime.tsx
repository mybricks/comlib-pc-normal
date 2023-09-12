import React, { useCallback, useEffect, useLayoutEffect } from 'react';
import { validateTrigger } from '../form-container/models/validate';
import { InputIds, OutputIds } from '../types';
import { validateFormItem } from '../utils/validator';
import { SlotIds } from './constants';
import { onChange as onChangeForFc } from '../form-container/models/onChange';

interface Data {
  value: string | undefined;
  rules: any[];
  disabled: boolean;
  childrenInputs: Record<string, any>;
  config: {};
}

export default function (props: RuntimeParams<Data>) {
  const { env, data, _inputs, inputs, _outputs, outputs, slots, parentSlot, id, name, style } =
    props;

  useLayoutEffect(() => {
    if (!data.childrenInputs) {
      data.childrenInputs = {};
    }

    inputs['setValue']((val) => {
      data.value = val;
      slots[SlotIds.FormItem].inputs['curValue'](data.value);
      onChangeForFc(parentSlot, { id: props.id, value: val, name });
      outputs['onChange'](val);
      onValidateTrigger();
    });

    inputs['setInitialValue']((val) => {
      data.value = val;
      slots[SlotIds.FormItem].inputs['curValue'](data.value);
      outputs[OutputIds.OnInitial](val);
    });

    inputs['validate']((val, outputRels) => {
      validateFormItem({
        value: data.value,
        env,
        rules: data.rules
      })
        .then((r) => {
          outputRels['returnValidate'](r);
        })
        .catch((e) => {
          outputRels['returnValidate'](e);
        });
    });
    inputs['getValue']((val, outputRels) => {
      outputRels['returnValue'](data.value);
    });

    inputs['resetValue'](() => {
      data.value = void 0;
      slots[SlotIds.FormItem].inputs['curValue'](data.value);
    });

    //设置禁用
    inputs['setDisabled']((val) => {
      data.disabled = true;
      slots[SlotIds.FormItem].inputs['onDisabled'](val);
      setValuesForInput({ data, actionId: InputIds.SetDisabled, val });
    });

    //设置启用
    inputs['setEnabled']((val) => {
      data.disabled = false;
      slots[SlotIds.FormItem].inputs['onEnabled'](val);
      setValuesForInput({ data, actionId: InputIds.SetEnabled, val });
    }, []);
  }, []);

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id, name });
  };

  return (
    <div>
      {slots[SlotIds.FormItem] &&
        slots[SlotIds.FormItem].render({
          wrap(comAray: { id; jsx; name; def; inputs; outputs; style }[]) {
            comAray.forEach((com) => {
              // 编辑态：收集表单项组件
              if (env.edit && com.outputs?.[OutputIds.ReturnValue]) {
                data.childrenInputs[com.name] = {};
              }
              // 运行时：收集表单项组件的输入项
              if (env.runtime && data.childrenInputs[com.name]) {
                data.childrenInputs[com.name] = com.inputs;
              }
            });

            return <>{comAray.map((com) => com.jsx)}</>;
          }
        })}
    </div>
  );
}

/**
 *
 * @param data 组件数据
 * @param actionId 触发操作
 * @param val 参数
 */
const setValuesForInput = ({ data, actionId, val }) => {
  Object.values(data.childrenInputs).forEach((inputs) => inputs?.[actionId]?.(val));
};
