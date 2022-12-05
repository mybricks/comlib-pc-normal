import { Form, Input } from 'antd';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { validateFormItem } from '../utils/validator';
import useFormItemInputs from '../form-container/models/FormItem';

import css from './runtime.less';

export interface Data {
  value: string | undefined;
  rules: any[];
  config: {
    allowClear: boolean;
    disabled: boolean;
    addonBefore: string;
    addonAfter: string;
    showCount: boolean;
    maxLength?: number;
  };
}

export default function (props: RuntimeParams<Data>) {
  const { env, data, _inputs, inputs, _outputs, outputs, parentSlot, style } = props;
  const { edit } = env;

  useFormItemInputs({
    inputs,
    outputs,
    env,
    configs: {
      setValue(val) {
        data.value = val;
      },
      setInitialValue(val) {
        data.value = val;
      },
      returnValue(cb) {
        cb(data.value);
      },
      resetValue() {
        data.value = void 0;
      },
      setDisabled() {
        data.config.disabled = true;
      },
      setEnabled() {
        data.config.disabled = false;
      }
    }
  });

  useLayoutEffect(() => {
    // inputs['setValue']((val) => {
    //   data.value = val;
    //   outputs['onChange'](val);
    // });

    // inputs['setInitialValue']((val) => {
    //   data.value = val;
    //   outputs['onInitial'](val);
    // });

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

    // inputs['getValue']((val, outputRels) => {
    //   outputRels['returnValue'](data.value);
    // });

    // inputs['resetValue'](() => {
    //   data.value = void 0;
    // });
    // //设置禁用
    // inputs['setDisabled'](() => {
    //   data.config.disabled = true;
    // });
    // //设置启用
    // inputs['setEnabled'](() => {
    //   data.config.disabled = false;
    // });
  }, []);

  // const validateTrigger = () => {
  //   parentSlot._inputs['validateTrigger'](props.id)
  // }

  const changeValue = useCallback((e) => {
    const value = e.target.value;
    data.value = value;
    outputs['onChange'](value);
  }, []);

  const onBlur = useCallback((e) => {
    const value = e.target.value;
    data.value = value;
    outputs['onBlur'](value);
  }, []);

  let jsx = (
    <Input
      type="text"
      {...data.config}
      value={data.value}
      readOnly={!!edit}
      onChange={changeValue}
      onBlur={onBlur}
    />
  );

  return <div className={css.fiText}>{jsx}</div>;
}
