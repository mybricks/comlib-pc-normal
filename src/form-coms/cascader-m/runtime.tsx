import React, { useLayoutEffect, useState, useRef, useCallback, useMemo, useEffect } from 'react';
import classNames from 'classnames';
import { Popup, ActionSheet } from 'antd-mobile';
import { DownOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import { Data } from './types';
import css from './runtime.less';
import { InputIds, OutputIds } from '../types';
import { debounceValidateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
const DefaultOptionKey = '_id';

/**
 * 计算表单项的输出值
 * @params data 组件数据
 */
const getOutputValue = (data, env, value) => {
  const getOutputValuefromValue = (val, index?) => {
    let result = val[data.valueFieldName]
    if (val == null) return result;
    if (data.config.labelInValue) {
      result = {
        value: val[data.valueFieldName],
        label: env.i18n( val[data.labelFieldName])
      };
    }
    if (data.outputValueType === 'option') {
      result = {
        ...val,
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
        data.config.options = [...ds];
        relOutputs['setOptionsDone'](ds);
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
      target = target.find((i) => i[data.valueFieldName] === key[data.valueFieldName]).children;
    });
    return target;
  }, [data.config.options, subKeys, data.valueFieldName]);

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
        setSubKeys((ls) => [...ls, item]);
      } else {
        // 选中
        const currentItem = getCurrentList().find(
          (i) => i[data.valueFieldName] === item[data.valueFieldName]
        );
        setValue((ls) => {
          if (data.mode === 'single') return [currentItem];
          if (ls.find((i) => i[data.valueFieldName] === currentItem[data.valueFieldName])) {
            return ls.filter((i) => {
              return i[data.valueFieldName] !== currentItem[data.valueFieldName];
            });
          } else {
            return [...ls, currentItem];
          }
        });
      }
    },
    [options, getCurrentList, data.mode]
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
                {value.map((i) => i.value).join(data.showValueSplit || '、')}
              </span>
            ) : (
              <span>{data.config.placeholder}</span>
            )}
            <DownOutlined className={css.cascaderSelectorIcon} />
          </div>
          <Popup visible={visible} onMaskClick={onClose}>
            <div className={css.cascaderPopupOperate}>
              <a onClick={onClose}>{env.i18n('取消')}</a>
              {data.mode === 'single' && (
                <span className={css.cascaderPopupOperateLevel}>
                  {subKeys.map((i) => i[data.labelFieldName]).join('/')}
                </span>
              )}
              <a onClick={onConfirm}>{env.i18n('确定')}</a>
            </div>
            {data.mode === 'multiple' && (
              <div className={css.cascaderPopupSelected}>
                {value.length > 0 && (
                  <a className={css.cascaderPopupSelectedClear} onClick={() => {
                    const deleteHandle = ActionSheet.show({
                      actions: [
                        {
                          text: env.i18n('确认'),
                          key: 'ok',
                          onClick: () => {
                            setValue([]);
                            deleteHandle.close();
                          }
                        }
                      ],
                      extra: env.i18n('是否清空所有已选项？'),
                      cancelText: env.i18n('取消'),
                    });
                  }}>
                    {env.i18n('清空')}
                  </a>
                )}
                {value.map((item) => (
                  <a className={css.cascaderPopupSelectedItem}>
                    {item.value}
                    <CloseCircleOutlined
                      className={css.cascaderPopupSelectedItemClose}
                      onClick={() => {
                        setValue((ls) =>
                          ls.filter((v) => v[data.valueFieldName] !== item[data.valueFieldName])
                        );
                      }}
                    />
                  </a>
                ))}
              </div>
            )}
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
                    [css.cascaderPopupListItemSelected]: !!value.find(
                      (i) => i[data.valueFieldName] === item[data.valueFieldName]
                    )
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
        <div>{value.join(data.showValueSplit || '、')}</div>
      )}
    </div>
  );
}
