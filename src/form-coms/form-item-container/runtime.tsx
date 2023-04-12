import React, { useCallback, useLayoutEffect } from 'react';
import { validateTrigger } from '../form-container/models/validate';
import { OutputIds } from '../types';
import { validateFormItem } from '../utils/validator';
import { SlotIds } from './constants';
import { onChange as onChangeForFc } from '../form-container/models/onChange';

interface Data {
  value: string | undefined;
  rules: any[];
  config: {};
}

export default function (props: RuntimeParams<Data>) {
  const { env, data, _inputs, inputs, _outputs, outputs, slots, parentSlot, id, style } = props;
  const { edit } = env;

  useLayoutEffect(() => {
    inputs['setValue']((val) => {
      data.value = val;
      slots[SlotIds.FormItem].inputs['curValue'](data.value);
      onChangeForFc(parentSlot, { id: props.id, value: val });
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
  }, []);

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id });
  };

  return <div>{slots[SlotIds.FormItem] && slots[SlotIds.FormItem].render()}</div>;
}
