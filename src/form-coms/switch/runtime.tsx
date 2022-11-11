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
  };
}

export default function ({ env, data, _inputs, inputs, _outputs, outputs }: RuntimeParams<Data>) {
  const { edit } = env;
  const [checked, setChecked] = useState<boolean>();

  useLayoutEffect(() => {
    inputs['setValue']((val) => {
      setChecked(val);
      outputs['onChange'](val);
    });

    inputs['validate']((val, outputRels) => {
      validateFormItem({
        value: checked,
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
      outputRels['returnValue'](checked);
    });

    inputs['resetValue'](() => {
      setChecked(false);
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
  }, [checked]);

  const changeValue = useCallback((checked) => {
    setChecked(checked);
    outputs['onChange'](checked);
  }, []);

  return (
    data.visible && (
      <Switch
        checked={checked}
        {...data.config}
        onChange={changeValue}
        // onBlur={onBlur}
      />
    )
  );
}
