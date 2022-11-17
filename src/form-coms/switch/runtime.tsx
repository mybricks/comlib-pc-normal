import { Switch } from 'antd';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { validateFormItem } from '../utils/validator';

interface Data {
  value: boolean | undefined;
  visible: boolean;
  rules: any[];
  checked: boolean;
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

  useLayoutEffect(() => {
    inputs['setValue']((val) => {
      data.checked = val;
      outputs['onChange'](val);
    });

    inputs['validate']((val, outputRels) => {
      validateFormItem({
        value: data.checked,
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
      outputRels['returnValue'](data.checked);
    });

    inputs['resetValue'](() => {
      data.checked = false;
    });

    // //设置显示
    // inputs['setVisible'](() => {
    //   data.visible = true;
    // });
    // //设置隐藏
    // inputs['setInvisible'](() => {
    //   data.visible = false;
    // });
    //设置禁用
    inputs['setDisabled'](() => {
      data.config.disabled = true;
    });
    //设置启用
    inputs['setEnabled'](() => {
      data.config.disabled = false;
    });
  }, [data.checked]);

  const changeValue = useCallback((checked) => {
    data.checked = checked;
    outputs['onChange'](checked);
  }, []);

  return (
    data.visible && (
      <Switch
        checked={data.checked}
        {...data.config}
        onChange={changeValue}
        // onBlur={onBlur}
      />
    )
  );
}
