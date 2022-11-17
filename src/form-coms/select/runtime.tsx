import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Select } from 'antd';
import { validateFormItem } from '../utils/validator';
import { Data } from './types';
import css from './runtime.less';
import { typeCheck, uuid } from '../../utils';
import { Option } from '../types';

export default function Runtime({ env, data, inputs, outputs, logger }: RuntimeParams<Data>) {
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
      if (data.config.mode && ['multiple', 'tags'].includes(data.config.mode)) {
        if (!Array.isArray(val)) {
          logger.error(
            `${data.config.mode === 'multiple' ? '多选下拉框' : '标签多选框'}的值应为数组格式`
          );
        } else {
          onChange(val);
        }
      } else if (typeCheck(val, ['NUMBER', 'BOOLEAN', 'STRING', 'UNDEFINED'])) {
        onChange(val);
      } else {
        logger.error(`下拉框的值应为基本类型`);
      }
    });

    inputs['resetValue'](() => {
      onChange(void 0);
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
      let newValArray: any[] = [],
        newVal;
      let updateValue = false;
      tempDs.map((item) => {
        const { checked, value } = item;
        if (checked && value != undefined) {
          updateValue = true;
          newVal = value;
          newValArray.push(value);
        }
      });
      if (updateValue) {
        onChange(
          data.config.mode && ['tags', 'multiple'].includes(data.config.mode) ? newValArray : newVal
        );
      }
      data.config.options = tempDs.map(({ label, value, disabled }) => {
        return {
          label,
          value,
          disabled
        };
      });
    });

    inputs['setLoading']((val: boolean) => {
      data.config = {
        ...data.config,
        loading: val
      };
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
  }, []);

  const onChange = useCallback((value) => {
    data.value = value;
    outputs['onChange'](value);
  }, []);
  const onBlur = useCallback((e) => {
    outputs['onBlur'](data.value);
  }, []);

  return (
    data.visible && (
      <div className={css.select}>
        <Select
          {...data.config}
          options={env.edit ? data.staticOptions : data.config.options}
          value={data.value}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>
    )
  );
}
