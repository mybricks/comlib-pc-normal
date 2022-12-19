import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Checkbox } from 'antd';
import { validateFormItem } from '../utils/validator';
import { Data } from './types';
import { Option, OutputIds } from '../types';
import { uuid } from '../../utils';
import { validateTrigger } from '../form-container/models/validate';

export default function Runtime({
  env,
  data,
  inputs,
  outputs,
  logger,
  parentSlot,
  id
}: RuntimeParams<Data>) {
  useLayoutEffect(() => {
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

    inputs['setValue']((val) => {
      if (val !== undefined && !Array.isArray(val)) {
        logger.error(`多选框的值应为数组格式`);
      } else {
        data.value = val;
        outputs['onChange'](data.value);
      }
    });

    inputs['setInitialValue'] &&
      inputs['setInitialValue']((val) => {
        if (val !== undefined && !Array.isArray(val)) {
          logger.error(`多选框的值应为数组格式`);
        } else {
          data.value = val;
          outputs[OutputIds.OnInitial](val);
        }
      });

    inputs['resetValue'](() => {
      data.value = [];
      data.value = void 0;
    });

    //设置禁用
    inputs['setDisabled'](() => {
      data.config.disabled = true;
    });
    //设置启用
    inputs['setEnabled'](() => {
      data.config.disabled = false;
    });

    inputs['setOptions']((ds) => {
      let tempDs: Option[] = [];
      if (Array.isArray(ds)) {
        ds.forEach((item, index) => {
          tempDs.push({
            checked: false,
            disabled: false,
            lable: `选项${index}`,
            value: `${uuid()}`,
            ...item
          });
        });
      } else {
        tempDs = [
          {
            checked: false,
            disabled: false,
            lable: `选项`,
            value: `${uuid()}`,
            ...(ds || {})
          }
        ];
      }
      let newValArray: any[] = [];
      tempDs.map((item) => {
        const { checked, value } = item;
        if (checked && value != undefined) {
          newValArray.push(value);
        }
      });
      data.value = newValArray;
      data.config.options = tempDs;
    });
  }, []);

  const onChange = useCallback((checkedValue) => {
    data.value = checkedValue;
    outputs['onChange'](checkedValue);
    onValidateTrigger();
  }, []);
  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id });
  };

  return (
    <div>
      <Checkbox.Group
        {...data.config}
        options={env.edit ? data.staticOptions : data.config.options}
        value={data.value as any}
        onChange={onChange}
      />
    </div>
  );
}
