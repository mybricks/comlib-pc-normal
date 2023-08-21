import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, Checkbox } from 'antd';
import { validateFormItem } from '../utils/validator';
import { Data } from './types';
import { OutputIds } from '../types';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import css from './runtime.less';

export default function Runtime({
  env,
  data,
  inputs,
  outputs,
  logger,
  parentSlot,
  id,
  title,
  name
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
        logger.warn(`${title}组件:【设置值】参数必须是数组！`);
      } else {
        changeValue(val);
        outputs['onChange'](data.value);
      }
    });

    inputs['setInitialValue'] &&
      inputs['setInitialValue']((val) => {
        if (val !== undefined && !Array.isArray(val)) {
          logger.warn(`${title}组件:【设置值】参数必须是数组！`);
        } else {
          changeValue(val);
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
    //设置数据源
    inputs['setOptions']((ds) => {
      if (Array.isArray(ds)) {
        data.config.options = [...ds];
        let newValArray: any[] = [],
          updateValue = false;
        ds.map((item) => {
          const { checked, value } = item;
          if (checked && value != undefined) {
            newValArray.push(value);
            updateValue = true;
          }
        });
        updateValue ? (data.value = newValArray) : void 0;
      } else {
        logger.warn(`${title}组件:【设置数据源】参数必须是{label, value}数组！`);
      }
    });
  }, []);

  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  // 校验触发
  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id, name });
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

  // 多选框组监听事件
  const onChange = useCallback((checkedValue) => {
    changeValue(checkedValue);
    onChangeForFc(parentSlot, { id, name, value: checkedValue });
    outputs['onChange'](checkedValue);
    onValidateTrigger();
  }, []);

  // 全选框监听事件
  const onCheckAllChange = (e) => {
    data.value = e.target.checked ? data.config.options.map((item) => item.value) : [];
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    onChangeForFc(parentSlot, { id, name, value: data.value });
    outputs['onChange'](data.value);
    onValidateTrigger();
  };
  if (data.renderError) {
    return <Alert message={`${title}渲染错误：存在选项值未定义！`} type="error" />;
  }

  const checkboxStyle = {
    paddingBottom: data.layout === 'vertical' ? '8px' : void 0
  };

  const checkboxGroup = {
    display: data.layout === 'vertical' ? 'grid' : void 0,
    gap: data.layout === 'vertical' ? '8px' : void 0
  };

  return (
    <div className={css.checkbox}>
      {data.checkAll && (
        <Checkbox
          style={checkboxStyle}
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
          disabled={data.config.disabled}
        >
          {data.checkAllText}
        </Checkbox>
      )}
      <Checkbox.Group
        style={checkboxGroup}
        {...data.config}
        options={env.edit ? data.staticOptions : data.config.options}
        value={data.value}
        onChange={onChange}
      />
    </div>
  );
}
