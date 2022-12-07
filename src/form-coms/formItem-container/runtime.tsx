import React, { useCallback, useLayoutEffect } from 'react';
import { validateFormItem } from '../utils/validator';
import { SlotIds } from './constants';

interface Data {
  value: string | undefined;
  rules: any[];
  config: {};
}

export default function (props: RuntimeParams<Data>) {
  const { env, data, _inputs, inputs, _outputs, outputs, slots, parentSlot, style } = props;
  const { edit } = env;

  useLayoutEffect(() => {
    inputs['setValue']((val) => {
      data.value = val;
      outputs['onChange'](val);
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
    });
  }, []);

  // const validateTrigger = () => {
  //   parentSlot._inputs['validateTrigger'](props.id)
  // }

  return (
    <div>
      {slots[SlotIds.FormItem] &&
        slots[SlotIds.FormItem].render({
          inputValues: {
            curValue: data.value
          }
        })}
    </div>
  );
}
