import { Input } from 'antd';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { validateFormItem } from '../utils/validator';

interface Data {
  value: string | undefined;
  visible: boolean;
  rules: any[];
  config: {
    allowClear: boolean;
    disabled: boolean;
    placeholder: string;
    showCount: boolean;
    maxLength?: number;
  };
}

export default function ({ env, data, _inputs, inputs, _outputs, outputs }: RuntimeParams<Data>) {
  const { edit } = env;

  useLayoutEffect(() => {
    inputs['setValue']((val) => {
      data.value = val;
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

    inputs['setVisible']((val: boolean) => {
      data.visible = val;
    });

    inputs['setDisabled']((val: boolean) => {
      data.config.disabled = val;
    });
  }, []);

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

  return (
    <div>
      <Input.TextArea
        {...data.config}
        value={data.value}
        readOnly={!!edit}
        onChange={changeValue}
        onBlur={onBlur}
      />
    </div>
  );
}
