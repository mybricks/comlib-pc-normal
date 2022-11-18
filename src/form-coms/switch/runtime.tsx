import { Switch } from 'antd';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { validateFormItem } from '../utils/validator';

interface Data {
  value: boolean | undefined;
  visible: boolean;
  rules: any[];
  config: {
    allowClear: boolean;
    disabled: boolean;
    addonBefore: string;
    addonAfter: string;
    showCount: boolean;
    maxLength?: number;
    checked: boolean;
  };
}

export default function ({ env, data, _inputs, inputs, _outputs, outputs }: RuntimeParams<Data>) {
  const { edit } = env;

  useLayoutEffect(() => {
    inputs['setValue']((val) => {
      data.config.checked = val;
      outputs['onChange'](val);
    });

    inputs['validate']((val, outputRels) => {
      validateFormItem({
        value: data.config.checked,
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
      outputRels['returnValue'](data.config.checked);
    });

    inputs['resetValue'](() => {
      data.config.checked = false;
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
  }, [data.config.checked]);

  const changeValue = useCallback((checked) => {
    data.config.checked = checked;
    outputs['onChange'](checked);
  }, []);

  return (
    data.visible && (
      <Switch
        {...data.config}
        onChange={changeValue}
        // onBlur={onBlur}
      />
    )
  );
}
