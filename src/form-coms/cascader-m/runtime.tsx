import React, { useLayoutEffect, useState, useRef, useCallback, useMemo, useEffect } from 'react';
import classNames from 'classnames';
import { Popup } from 'antd-mobile';
import { DownOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import { Data } from './types';
import css from './runtime.less';
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
  const [value, setValue] = useState<any[]>(data.value || []);
  const [subKeys, setSubKeys] = useState<string[]>([]); // 选中的item的唯一标识key，使用数组便于在点击返回上一级时可以快速找到
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
      setValue([]);
      if (relOutputs['resetValueDone']) {
        relOutputs['resetValueDone']();
      }
    });

    inputs['setOptions']((ds, relOutputs) => {
      if (Array.isArray(ds)) {
        const fieldNames = getFieldNames(data);
        const newOptions = data.customField
          ? ds.map((item) => {
              return {
                ...(fieldNames.value in item
                  ? {
                      value: item[fieldNames.value]
                    }
                  : {}),
                ...(fieldNames.label in item
                  ? {
                      label: item[fieldNames.label]
                    }
                  : {}),
                ...(fieldNames.disabled in item
                  ? {
                      disabled: item[fieldNames.disabled]
                    }
                  : {}),
                ...(fieldNames.checked in item
                  ? {
                      checked: item[fieldNames.checked]
                    }
                  : {})
              };
            })
          : ds;
        data.config.options = [...newOptions];
        relOutputs['setOptionsDone'](ds);

        //计算值更新
        let newValArray: any[] = [],
          newVal;
        let updateValue = false;
        newOptions.map((item) => {
          const { checked, value } = item;
          if (checked && value != undefined) {
            updateValue = true;
            newVal = value;
            newValArray.push(value);
          }
        });
      } else {
        logger.warn(`${title}组件:【设置数据源】参数必须是{label, value}数组！`);
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
          validateInfo: info as any
        });
      }
    });
  }, [value]);

  const getCurrentList = useCallback(() => {
    if (subKeys.length === 0) return data.config.options || [];
    let target = data.config.options || [];
    subKeys.forEach((key) => {
      target = target.find((i) => i.name === key).children;
    });
    return target;
  }, [data.config.options, subKeys]);

  const { options, ...configs } = data.config;

  const getPopContainer = () => {
    if (data.mount === undefined) {
      data.mount = 'body';
    }
    // 其他情况
    return env?.canvasElement || document.body;
  };

  const onClose = useCallback(() => {
    setVisible(false);
    outputs['onCancel']?.();
  }, []);

  const onConfirm = useCallback(() => {
    changeValue(value);
    outputs['onConfirm']?.(value);
    onClose();
  }, [value, onClose]);

  const handleItemClick = useCallback(
    (item) => {
      // 展开子列表
      if (item.children && item.children.length > 0) {
        setSubKeys((ls) => [...ls, item.name]);
      } else {
        // 选中
        const currentItem = getCurrentList().find((i) => i.name === item.name);
        currentItem.checked = !currentItem.checked;
        setValue((ls) => {
          if (!currentItem.checked) {
            return ls.filter((i) => {
              return i.name !== currentItem.name;
            });
          } else {
            return [...ls, currentItem];
          }
        });
      }
    },
    [options, getCurrentList]
  );

  const returnLastLevel = useCallback(() => {
    setSubKeys((ls) => {
      const newList = ls.slice(0, -1);
      return newList;
    });
  }, []);

  const renderSelectedCount = useCallback((item) => {
    if (!item.children || item.children.length === 0) return null;
    const count = item.children.filter((i) => i.checked).length;
    if (count < 1) return null;
    return <span>(已选{count}项)</span>;
  }, []);

  return (
    <div>
      {data.isEditable ? (
        <>
          <div
            className={classNames({
              [css.cascaderSelectorDisabled]: data.config.disabled,
              [css.cascaderSelector]: true
            })}
            onClick={() => {
              if (env.runtime && !data.config.disabled) {
                setVisible((v) => !v);
              }
            }}
          >
            {value.length > 0 ? (
              <span className={css.cascaderSelectorValue}>
                {value.map((i) => i.value).join('、')}
              </span>
            ) : (
              <span>{data.config.placeholder}</span>
            )}
            <DownOutlined className={css.cascaderSelectorIcon} />
          </div>
          <Popup visible={visible} onMaskClick={onClose}>
            <div className={css.cascaderPopupOperate}>
              <a onClick={onClose}>{env.i18n('取消')}</a>
              <a onClick={onConfirm}>{env.i18n('确定')}</a>
            </div>
            <div className={css.cascaderPopupSelected}>
              {value.length > 0 && (
                <a className={css.cascaderPopupSelectedClear}>{env.i18n('清空')}</a>
              )}
              {value.map((item) => (
                <a className={css.cascaderPopupSelectedItem}>
                  {item.value}
                  <CloseCircleOutlined className={css.cascaderPopupSelectedItemClose} />
                </a>
              ))}
            </div>
            {subKeys.length > 0 && (
              <a className={css.cascaderPopupReturnLast} onClick={returnLastLevel}>
                {env.i18n('返回上一级')}
              </a>
            )}
            <div className={css.cascaderPopupList}>
              {getCurrentList().map((item) => (
                <div
                  className={classNames({
                    [css.cascaderPopupListItem]: true,
                    [css.cascaderPopupListItemSelected]: item.checked
                  })}
                  onClick={() => handleItemClick(item)}
                >
                  {item.value}
                  {renderSelectedCount(item)}
                </div>
              ))}
            </div>
          </Popup>
        </>
      ) : (
        <div>{value.join('、')}</div>
      )}
    </div>
  );
}
