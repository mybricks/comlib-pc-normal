import React, { useLayoutEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Input } from 'antd';
import { Picker } from 'antd-mobile';
import { SearchOutlined, SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import { Data } from './types';
import css from './runtime.less';
import { typeCheck, i18nFn } from '../../utils';
import { InputIds, OutputIds } from '../types';
import { debounceValidateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
const DefaultOptionKey = '_id';

const getFieldNames = (data: Data) => {
  const fieldNames = {
    label: data.labelFieldName || 'label',
    value: data.valueFieldName || 'value',
    disabled: data.disabledFieldName || 'disabled',
    checked: data.checkedFieldName || 'checked'
  };

  return fieldNames;
};

/**
 * 计算表单项的输出值
 * @params data 组件数据
 */
const getOutputValue = (data, env, value) => {
  const getOutputValuefromValue = (val, index?) => {
    if (val?.value) val = val.value;
    let result = val;
    if (val == null) return result;
    if (data.config.labelInValue) {
      const option = data.config.options?.find((i) => i.value === val) || {};
      const { value, label } = option;
      result = {
        value,
        label: env.i18n(label)
      };
    }
    if (data.outputValueType === 'option') {
      const { [DefaultOptionKey]: id, ...res } =
        data.config.options.find((i) => i.value === val) || {};
      result = {
        ...res,
        label: env.i18n(res.label)
      };
    }
    return result;
  };

  let outputValue: any = value;
  if (Array.isArray(outputValue)) {
    outputValue = outputValue.map(getOutputValuefromValue);
  } else {
    outputValue = getOutputValuefromValue(outputValue);
  }

  return outputValue;
};

export default function Runtime({
  env,
  data,
  inputs,
  outputs,
  slots,
  logger,
  parentSlot,
  id,
  name,
  title
}: RuntimeParams<Data>) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(data.value);
  const [searchValue, setSearchValue] = useState('');
  const valueRef = useRef<any>(data.value);
  const validateRelOutputRef = useRef<any>(null);

  const changeValue = useCallback((value) => {
    setValue(value);
    valueRef.current = value;
    const outputValue = getOutputValue(data, env, value);
    outputs['onChange'](outputValue);
    onChangeForFc(parentSlot, { id: id, value: outputValue, name });
    return outputValue;
  }, []);

  useLayoutEffect(() => {
    inputs['validate']((model, outputRels) => {
      validateFormItem({
        value: valueRef.current,
        env,
        model,
        rules: data.rules
      })
        .then((r) => {
          const customRule = (data.rules || defaultRules).find(
            (i) => i.key === RuleKeys.CUSTOM_EVENT
          );
          if (customRule?.status) {
            validateRelOutputRef.current = outputRels['returnValidate'];
            const outputValue = getOutputValue(data, env, valueRef.current);
            outputs[OutputIds.OnValidate](outputValue);
          } else {
            outputRels['returnValidate'](r);
            debounceValidateTrigger(parentSlot, {
              id,
              name,
              validateInfo: r
            });
          }
        })
        .catch((e) => {
          outputRels['returnValidate'](e);
          debounceValidateTrigger(parentSlot, {
            id,
            name,
            validateInfo: e
          });
        });
    });

    inputs['getValue']((val, outputRels) => {
      const outputValue = getOutputValue(data, env, valueRef.current);
      outputRels['returnValue'](outputValue);
    });

    inputs['setValue']((val, relOutputs) => {
      const outputValue = setValue(val);
      outputs[OutputIds.OnChange](outputValue);
      if (relOutputs['setValueDone']) {
        relOutputs['setValueDone'](val);
      }
    });

    inputs['setInitialValue'] &&
      inputs['setInitialValue']((val, relOutputs) => {
        const outputValue = setValue(val);
        outputs[OutputIds.OnInitial](outputValue);
        if (relOutputs['setInitialValueDone']) {
          relOutputs['setInitialValueDone'](val);
        }
      });

    inputs['resetValue']((_, relOutputs) => {
      setValue(void 0);
      if (relOutputs['resetValueDone']) {
        relOutputs['resetValueDone']();
      }
    });

    inputs['setOptions']((ds, relOutputs) => {
      if (Array.isArray(ds)) {
        // const fieldNames = getFieldNames(data);
        // const newOptions = data.customField
        //   ? ds.map((item) => {
        //       return {
        //         ...(fieldNames.value in item
        //           ? {
        //               value: item[fieldNames.value]
        //             }
        //           : {}),
        //         ...(fieldNames.label in item
        //           ? {
        //               label: item[fieldNames.label]
        //             }
        //           : {}),
        //         ...(fieldNames.disabled in item
        //           ? {
        //               disabled: item[fieldNames.disabled]
        //             }
        //           : {}),
        //         ...(fieldNames.checked in item
        //           ? {
        //               checked: item[fieldNames.checked]
        //             }
        //           : {})
        //       };
        //     })
        //   : ds;
        data.config.options = [...ds];
        relOutputs['setOptionsDone'](ds);

        //计算值更新
        let newValArray: any[] = [],
          newVal;
        let updateValue = false;
        ds.map((item) => {
          const { checked, value } = item;
          if (checked && value != undefined) {
            updateValue = true;
            newVal = value;
            newValArray.push(value);
          }
        });
      } else {
        logger.warn(`${title}组件:【设置数据源】参数必须是{label, value}二维数组！`);
      }
    });

    //设置禁用
    inputs['setDisabled']((_, relOutputs) => {
      data.config.disabled = true;
      if (relOutputs['setDisabledDone']) {
        relOutputs['setDisabledDone']();
      }
    });
    //设置启用
    inputs['setEnabled']((_, relOutputs) => {
      data.config.disabled = false;
      if (relOutputs['setEnabledDone']) {
        relOutputs['setEnabledDone']();
      }
    });
    //设置启用/禁用
    inputs['isEnable']((val, relOutputs) => {
      if (val === true) {
        data.config.disabled = false;
        if (relOutputs['isEnableDone']) {
          relOutputs['isEnableDone'](val);
        }
      } else {
        data.config.disabled = true;
        if (relOutputs['isEnableDone']) {
          relOutputs['isEnableDone'](val);
        }
      }
    });

    //设置编辑/只读
    inputs['isEditable']((val, relOutputs) => {
      data.isEditable = val;
      if (relOutputs['isEditableDone']) {
        relOutputs['isEditableDone'](val);
      }
    });

    // 设置校验状态
    inputs[InputIds.SetValidateInfo]((info: object, relOutputs) => {
      if (validateRelOutputRef.current) {
        validateRelOutputRef.current(info);
        relOutputs['setValidateInfoDone'](info);
        debounceValidateTrigger(parentSlot, {
          id,
          name: name,
          validateInfo: info
        });
      }
    });
  }, [value]);

  const { options, ...configs } = data.config;

  const getPopContainer = () => {
    if (data.mount === undefined) {
      data.mount = 'body';
    }
    // 其他情况
    return env?.canvasElement || document.body;
  };

  const renderSearch = useCallback(() => {
    return (
      <div className={css.searchContent}>
        <SearchOutlined className={css.searchContentIconSearch} />
        <Input
          className={css.searchContentInput}
          placeholder="搜索"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <CloseCircleOutlined className={css.searchContentIconClose} onClick={() => {
          setSearchValue('');
          changeValue('');
        }} />
      </div>
    );
  }, [searchValue]);

  const onClose = useCallback(() => {
    setVisible(false);
    outputs['onCancel']?.();
  }, []);

  const onConfirm = useCallback((v) => {
    changeValue(v);
    outputs['onConfirm']?.(v);
  }, []);

  const columns = useMemo(() => {
    if (data.config.options?.find((item) => !Array.isArray(item))) {
      logger.warn(`${title}组件:【设置数据源】参数必须是{label, value}二维数组！`);
      return [data.config.options];
    }
    if (!searchValue) {
      return data.config.options || [];
    } else {
      return (data.config.options || []).map((opts) => {
        return opts?.filter((opt) => opt.label.includes(searchValue));
      });
    }
  }, [data.config.options, searchValue]);

  return (
    <div className={`${css.picker} picker-m`}>
      {data.isEditable ? (
        <>
          <Picker
            getContainer={getPopContainer}
            visible={visible}
            onClose={onClose}
            title={renderSearch()}
            columns={columns}
            onConfirm={onConfirm}
            // onSelect={changeValue}
            value={value}
          >
            {(items, { open, close }) => {
              return (
                <div
                  className={`${css.pickerContent} pickerContent ${
                    data.config.disabled ? css.pickerDisabled : ''
                  }`}
                  onClick={() =>
                    env.runtime !== false && !data.config.disabled && setVisible((v) => !v)
                  }
                >
                  {items.length === 0 ? (
                    <div className={css.pickerPlaceholder}>{data.config.placeholder}</div>
                  ) : (
                    <div
                      className={css.pickerValue}
                      onClick={() =>
                        env.runtime !== false && !data.config.disabled && setVisible((v) => !v)
                      }
                    >
                      {items.map((v) => v?.label || '未选择').join('/')}
                    </div>
                  )}
                  <SearchOutlined className={css.pickerArrow} />
                </div>
              );
            }}
          </Picker>
        </>
      ) : (
        <div>test not isEditable</div>
      )}
    </div>
  );
}
