import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { validateTrigger } from '../form-container/models/validate';
import { InputIds, OutputIds } from '../types';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import { SlotIds, SlotInputIds, SlotOutputIds } from './constants';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { Data } from './types';
import { inputIds, outputIds } from '../form-container/constants';

export default function (props: RuntimeParams<Data>) {
  const { env, data, _inputs, inputs, _outputs, outputs, slots, parentSlot, id, name, style } =
    props;
  const validateRelOuputRef = useRef<any>(null);

  useLayoutEffect(() => {
    if (!data.childrenInputs) {
      data.childrenInputs = {};
    }

    inputs['setValue']((val, outputRels) => {
      data.value = val;
      outputRels['setValueDone'](val);
      slots[SlotIds.FormItem].inputs[SlotInputIds.CurValue](data.value);
      onChangeForFc(parentSlot, { id: props.id, value: val, name });
      outputs['onChange'](val);
    });

    inputs['setInitialValue']((val, outputRels) => {
      data.value = val;
      outputRels['setInitialValueDone'](val);
      slots[SlotIds.FormItem].inputs[SlotInputIds.CurValue](data.value);
      outputs[OutputIds.OnInitial](val);
    });

    // 设置表单项值
    slots[SlotIds.FormItem].outputs[SlotOutputIds.SetCurValue]?.((val) => {
      data.value = val;
      onChangeForFc(parentSlot, { id: props.id, value: val, name });
      onValidateTrigger();
    });

    inputs['validate']((model, outputRels) => {
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
            validateRelOuputRef.current = outputRels['returnValidate'];
            outputs[outputIds.ON_VALIDATE](data.value);
          } else {
            outputRels['returnValidate'](r);
          }
        })
        .catch((e) => {
          outputRels['returnValidate'](e);
        });
    });
    inputs['getValue']((val, outputRels) => {
      outputRels['returnValue'](data.value);
    });

    inputs['resetValue']((_, outputRels) => {
      data.value = void 0;
      slots[SlotIds.FormItem].inputs[SlotInputIds.CurValue](data.value);
      outputRels['resetValueDone']();
    });

    //设置禁用
    inputs['setDisabled']((val, outputRels) => {
      data.disabled = true;
      slots[SlotIds.FormItem].inputs['onDisabled'](val);
      outputRels['setDisabledDone'](val);
      setValuesForInput({ data, actionId: InputIds.SetDisabled, val });
    });

    //设置启用
    inputs['setEnabled']((val, outputRels) => {
      data.disabled = false;
      slots[SlotIds.FormItem].inputs['onEnabled'](val);
      outputRels['setEnabledDone'](val);
      setValuesForInput({ data, actionId: InputIds.SetEnabled, val });
    }, []);

    //设置启用/禁用
    inputs['isEnable']((val, outputRels) => {
      if (val === true) {
        data.disabled = false;
        slots[SlotIds.FormItem].inputs['onEnabled'](val);
        outputRels['isEnableDone'](val);
        setValuesForInput({ data, actionId: InputIds.SetEnabled, val });
      } else {
        data.disabled = true;
        slots[SlotIds.FormItem].inputs['onDisabled'](val);
        outputRels['isEnableDone'](val);
        setValuesForInput({ data, actionId: InputIds.SetDisabled, val });
      }
    });

    // 设置校验状态
    inputs[inputIds.SET_VALIDATE_INFO]((info: object, outputRels) => {
      if (validateRelOuputRef.current) {
        validateRelOuputRef.current(info);
        outputRels['setValidateInfoDone'](info);
      }
    });
  }, []);

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id, name });
  };

  return (
    <div>
      {slots[SlotIds.FormItem] &&
        slots[SlotIds.FormItem].render({
          wrap(comAray: { id; jsx; name; def; inputs; outputs; style }[] = []) {
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
