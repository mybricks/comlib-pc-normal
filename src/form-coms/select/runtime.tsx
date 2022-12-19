import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Select, Spin } from 'antd';
import { validateFormItem } from '../utils/validator';
import { Data } from './types';
import css from './runtime.less';
import { typeCheck, uuid } from '../../utils';
import { Option, OutputIds } from '../types';
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
  //fetching, 是否开启loading的开关
  const [fetching, setFetching] = useState(false);
  const typeMap = useMemo(() => {
    if (data.config.mode && ['multiple', 'tags'].includes(data.config.mode)) {
      return {
        type: ['ARRAY', 'UNDEFINED'],
        message: `${data.config.mode === 'multiple' ? '多选下拉框' : '标签多选框'}的值应为数组格式`
      };
    }
    if (data.config.labelInValue) {
      return {
        type: ['OBJECT', 'UNDEFINED'],
        message: `下拉框的值应为{label,value}对象格式`
      };
    }
    return {
      type: ['NUMBER', 'BOOLEAN', 'STRING', 'UNDEFINED'],
      message: `下拉框的值应为基本类型`
    };
  }, [data.config.mode, data.config.labelInValue]);

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
      if (!typeCheck(val, typeMap.type)) {
        logger.error(typeMap.message);
      } else {
        onChange(val);
        // data.value = val;
      }
    });

    inputs['setInitialValue'] &&
      inputs['setInitialValue']((val) => {
        if (!typeCheck(val, typeMap.type)) {
          logger.error(typeMap.message);
        } else {
          data.value = val;
          outputs[OutputIds.OnInitial](val);
        }
      });

    inputs['resetValue'](() => {
      data.value = '';
      data.value = void 0;
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
        data.value =
          data.config.mode && ['tags', 'multiple'].includes(data.config.mode)
            ? newValArray
            : newVal;
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

    //设置禁用
    inputs['setDisabled'](() => {
      data.config.disabled = true;
    });
    //设置启用
    inputs['setEnabled'](() => {
      data.config.disabled = false;
    });
  }, []);

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id });
  };
  const onChange = useCallback((value) => {
    if (value === undefined) {
      data.value = '';
    }
    data.value = value;
    outputs['onChange'](value);
  }, []);
  const onBlur = useCallback((e) => {
    outputs['onBlur'](data.value);
    onValidateTrigger();
  }, []);

  const onSearch = (e) => {
    //开启远程搜索功能
    if (data.dropdownSearchOption) {
      outputs['remoteSearch'](e);
      setFetching(true);
    }
    //1、远程数据源
    if (!e && data.dropdownSearchOption === true) {
      data.config.options = [];
      setFetching(false);
    }
    //2、本地数据源, 不做处理
  };

  return (
    <div className={css.select}>
      <Select
        {...data.config}
        options={env.edit ? data.staticOptions : data.config.options}
        value={data.value}
        onChange={onChange}
        onBlur={onBlur}
        onSearch={data.config.showSearch ? onSearch : void 0}
        notFoundContent={data.dropdownSearchOption && fetching ? <Spin size="small" /> : void 0}
      />
    </div>
  );
}
