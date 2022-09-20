import { Form, Input } from 'antd';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { validateFormItem } from '../utils/validator';

import css from './runtime.less';

interface Data {
  value: string | undefined;
  visible: boolean;
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

export default function ({ env, data, _inputs, inputs, _outputs, outputs }: RuntimeParams<Data>) {
  const { edit } = env;

  const [value, setValue] = useState();

  useLayoutEffect(() => {
    inputs['setValue']((val) => {
      data.value = val;
      setValue(val);
      outputs['onChange'](value);
    });

    inputs['validate']((val, outputRels) => {
      validateFormItem({
        // value: data.value,
        value,
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
    console.log('----text1111', `data.value ${data.value} ---`, value);
    inputs['getValue']((val, outputRels) => {
      console.log('----text2222', `data.value ${data.value} ---`, value);
      outputRels['returnValue'](value);
      // outputRels['returnValue'](data.value);
    });

    inputs['resetValue'](() => {
      data.value = void 0;
      setValue(void 0);
    });

    inputs['setVisible']((val: boolean) => {
      data.visible = val;
    });

    inputs['setDisabled']((val: boolean) => {
      data.config.disabled = val;
    });
  }, [value]);

  const changeValue = useCallback((e) => {
    // const value = e.target.value;
    data.value = e.target.value;
    setValue(e.target.value);
    outputs['onChange'](e.target.value);
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
      value={value}
      readOnly={!!edit}
      onChange={changeValue}
      onBlur={onBlur}
    />
  );

  return data.visible && <div className={css.fiText}>{jsx}</div>;
}
