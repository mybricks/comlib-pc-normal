import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, Checkbox } from 'antd';
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
  id,
  title
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
        changeValue(val);
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
      data.value = void 0;
      changeValue();
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

  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  // 校验触发
  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id });
  };
  // data.value变化事件
  const changeValue = useCallback((checkedValue?: any[]) => {
    if (Array.isArray(checkedValue)) {
      setIndeterminate(!!checkedValue.length && checkedValue.length < data.config.options.length);
      setCheckAll(checkedValue.length === data.config.options.length);
      data.value = checkedValue;
    } else {
      setIndeterminate(false);
      setCheckAll(false);
      data.value = [];
      data.value = void 0;
    }
  }, []);
  // 全选框组监听事件
  const onChange = useCallback((checkedValue) => {
    changeValue(checkedValue);
    outputs['onChange'](checkedValue);
    onValidateTrigger();
  }, []);
  // 全选框监听事件
  const onCheckAllChange = (e) => {
    data.value = e.target.checked ? data.config.options.map((item) => item.value) : [];
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    onValidateTrigger();
  };
  if (data.renderError) {
    return <Alert message={`${title}渲染错误：存在选项值未定义！`} type="error" />;
  }
  return (
    <div>
      {data.checkAll && (
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
          disabled={data.config.disabled}
        >
          {data.checkAllText}
        </Checkbox>
      )}
      <Checkbox.Group
        {...data.config}
        options={env.edit ? data.staticOptions : data.config.options}
        value={data.value as any}
        onChange={onChange}
      />
    </div>
  );
}
