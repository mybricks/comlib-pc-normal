import React, { useMemo, useCallback, useLayoutEffect, useEffect, useRef } from 'react';
import { ChildrenStore, Data } from './types';
import SlotContent from './SlotContent';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import {
  updateValue,
  generateFields,
  validateForInput,
  setValuesForInput,
  changeValue
} from './utils';
import { deepCopy, typeCheck } from '../../utils';
import { RuleKeys, validateFormItem } from '../utils/validator';
import { debounceValidateTrigger } from '../form-container/models/validate';
import { ActionsWrapper, addField, removeField } from './components/FormActions';
import { SlotIds, SlotInputIds, InputIds as SelfInputIds } from './constants';
import { InputIds, OutputIds } from '../types';
import { inputIds, outputIds } from '../form-container/constants';
import { defaultRules } from './editors';

export default function Runtime(props: RuntimeParams<Data>) {
  const { env, data, inputs, outputs, slots, logger, title, parentSlot, id } = props;

  const validateRelOutputRef = useRef<any>(null);
  const callbacks = useRef<any>({});

  const keyRef = useRef<number>(1);

  const childrenStore = useMemo<ChildrenStore>(() => {
    return {};
  }, [env.edit]);

  const listItemPropsStore = useMemo<ChildrenStore>(() => {
    return {};
  }, [env.edit]);
  // let initLength = useMemo(() => {
  //   return data.initLength;
  // }, [data.initLength]);
  const resetForm = useCallback(() => {
    data.value = [];
    data.fields = [];
    data.MaxKey = -1;
    clearValidateStatus();
    Object.keys(childrenStore).forEach((key) => {
      Reflect.deleteProperty(childrenStore, key);
    });
  }, []);

  // 重置表单后，将data.items里面的validateStatus等校验信息清除；不然重设表单项值，下面会有默认的错误提示
  const clearValidateStatus = () => {
    data.items.forEach((item: any) => {
      item.validateStatus = {} as any;
      item.help = {} as any;
    });
  };
  useLayoutEffect(() => {
    data.userAction = {
      type: '',
      index: -1,
      key: -2,
      value: undefined,
      startIndex: -1
    };
    // 设置值
    inputs[InputIds.SetValue]((value, outputRels) => {
      keyRef.current = keyRef.current + 1;
      if (typeCheck(value, ['Array', 'Undefined', 'NULL'])) {
        resetForm();
        data.value = value;
        data.userAction.type = InputIds.SetValue;
        data.userAction.key = -2;
        onChangeForFc(parentSlot, { id, value, name: props.name });
        changeValue({ data, id, outputs, parentSlot, name: props.name });
        generateFields(data);
      } else {
        logger.error(title + '[设置值]: 类型不合法');
      }
      if (outputRels['setValueDone']) {
        outputRels['setValueDone']?.(value);
      }
    });

    // 设置初始值
    inputs[InputIds.SetInitialValue]((value, outputRels) => {
      keyRef.current = keyRef.current + 1;
      if (typeCheck(value, ['Array', 'Undefined', 'NULL'])) {
        resetForm();
        data.value = value;
        data.userAction.type = InputIds.SetInitialValue;
        data.userAction.key = -2;
        outputs[OutputIds.OnInitial](deepCopy(value));
        onChangeForFc(parentSlot, { id, value, name: props.name });
        generateFields(data);
      } else {
        logger.error(title + '[设置初始值]: 类型不合法');
      }
      if (outputRels['setInitialValueDone']) {
        outputRels['setInitialValueDone']?.(value);
      }
    });

    // 获取值
    inputs['getValue']((val, outputRels) => {
      const value = getValue();
      outputRels['returnValue'](value);
    });

    // 重置值
    inputs['resetValue']((_, outputRels) => {
      resetForm();
      onChangeForFc(parentSlot, { id, value: [], name: props.name });
      outputRels['resetValueDone']();
    });

    //设置禁用
    inputs['setDisabled']((_, outputRels) => {
      data.disabled = true;
      data.userAction.type = InputIds.SetDisabled;
      setValuesForInput({ data, childrenStore });
      if (outputRels['setDisabledDone']) {
        outputRels['setDisabledDone']();
      }
    });

    //设置启用
    inputs['setEnabled']((_, outputRels) => {
      data.disabled = false;
      data.userAction.type = InputIds.SetEnabled;
      setValuesForInput({ data, childrenStore });
      if (outputRels['setEnabledDone']) {
        outputRels['setEnabledDone']();
      }
    }, []);

    //设置启用/禁用
    inputs['isEnable']((val, outputRels) => {
      if (val === true) {
        data.disabled = false;
        data.userAction.type = InputIds.SetEnabled;
        setValuesForInput({ data, childrenStore });
        if (outputRels['isEnableDone']) {
          outputRels['isEnableDone'](val);
        }
      } else {
        data.disabled = true;
        data.userAction.type = InputIds.SetDisabled;
        setValuesForInput({ data, childrenStore });
        if (outputRels['isEnableDone']) {
          outputRels['isEnableDone'](val);
        }
      }
    });

    //设置编辑/只读
    inputs['isEditable']((val, outputRels) => {
      data.isEditable = val;
      data.userAction.type = InputIds.SetEditable;
      setValuesForInput({ data, childrenStore });
      if (outputRels['isReadOnlyDone']) {
        outputRels['isReadOnlyDone'](val);
      }
    });

    // 校验
    inputs['validate']((model, outputRels) => {
      // 校验子项
      validate()
        .then(() => {
          // 校验自己
          validateFormItem({
            value: data.value,
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
                outputs[outputIds.ON_VALIDATE](data.value);
              } else {
                outputRels['returnValidate'](r);
                debounceValidateTrigger(parentSlot, { id, name: props.name, validateInfo: r });
              }
            })
            .catch((e) => {
              outputRels['returnValidate'](e);
              debounceValidateTrigger(parentSlot, { id, name: props.name, validateInfo: e });
            });
        })
        .catch((e) => {
          outputRels['returnValidate'](e);
          // 校验子项的，在表单容器里面渲染error提示消息；不必通知出去
          console.log('校验失败', e);
        });
    });

    // 设置校验信息
    inputs[inputIds.SET_VALIDATE_INFO]((info: object, outputRels) => {
      if (validateRelOutputRef.current) {
        validateRelOutputRef.current(info);
        outputRels['setValidateInfoDone'](info);
        debounceValidateTrigger(parentSlot, { id, name: props.name, validateInfo: info });
      }
    });

    // 新增一项
    inputs[SelfInputIds.AddField]?.((val, relOutputs) => {
      addField({ data }, val);
      callbacks.current.addFieldDone = () => relOutputs['addFieldDone'](val);
    });
    // 删除一项
    inputs[SelfInputIds.RemoveField]?.((val, relOutputs) => {
      if (!data.fields.length) {
        return;
      }
      const { index } = val || {};
      let key = val?.key;
      const fieldIndex = typeof index === 'number' ? index : data.fields.length - 1;
      if (typeof key !== 'number' || !key) {
        key = data.fields[fieldIndex]?.key;
      }
      const field = {
        name: fieldIndex,
        key
      };
      removeField({ ...props, childrenStore, field, fieldIndex });
      relOutputs['removeFieldDone'](val);
    });
    // 修改一项
    inputs[SelfInputIds.ModifyField]?.((val, relOutputs) => {
      if (val.index !== undefined && data.fields.length > val.index) {
        if (!data.listItemProps) {
          data.listItemProps = {};
        }
        data.listItemProps[val.index] = val.config;
        if (relOutputs['modifyFieldDone']) {
          relOutputs['modifyFieldDone']?.(val);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (env.runtime) {
      // 值更新
      slots[SlotIds.FormItems]._inputs[SlotInputIds.ON_CHANGE](({ id, name, value }) => {
        // 只有在用户操作触发时才收集更新值
        !data.userAction.type &&
          data.userAction.key === -1 &&
          updateValue({ ...props, childrenStore, childId: id, childName: name, value });
      });
    }
  }, []);
  // useEffect(() => {
  //   // 初始化
  //   if (env.runtime && initLength) {
  //     new Array(initLength).fill(null).forEach((_, index) => {
  //       addField({ data });
  //     });
  //     data.currentAction = 'init';
  //     initLength = 0;
  //   }
  // }, [data.initLength]);

  const validate = useCallback(() => {
    return new Promise((resolve, reject) => {
      const allPromise: (
        | Promise<any>
        | {
            validateStatus: string;
          }
      )[] = [];

      data.fields.forEach((field) => {
        const { name, key } = field;
        const fieldFormItems = childrenStore[key];
        const fieldPromise = data.items
          .filter((item) => {
            return fieldFormItems[item.comName];
          })
          .map((item) => {
            const { index, inputs, visible } = fieldFormItems[item.comName];
            if (!data.submitHiddenFields && !visible) {
              // 隐藏的表单项，不再校验
              return { validateStatus: 'success' };
            }
            return new Promise((resolve, reject) => {
              validateForInput({ item, index, inputs }, resolve);
            });
          });
        allPromise.push(...fieldPromise);
      });
      Promise.all(allPromise)
        .then((values) => {
          let rtn = false;
          values.forEach((item) => {
            if (item.validateStatus !== 'success') {
              reject(item);
            }
          });

          resolve(rtn);
        })
        .catch((e) => reject(e));
    });
  }, []);

  const getValue = useCallback(() => {
    const values: {}[] = [];
    data.fields.forEach((field) => {
      const { name, key } = field;
      if (!values[name]) {
        values[name] = {};
      }
      const fieldFormItems = childrenStore[key];
      data.items
        .filter((item) => {
          return fieldFormItems[item.comName];
        })
        .map((item) => {
          const { visible } = fieldFormItems[item.comName];
          if (data.submitHiddenFields || visible) {
            values[name][item.name] = data.value?.[name]?.[item.name];
          }
        });
    });
    return values;
  }, []);

  const field = useMemo(() => {
    return { name: 0, key: 0 };
  }, []);

  if (env.edit) {
    return (
      <>
        <SlotContent
          {...props}
          childrenStore={childrenStore}
          actions={<ActionsWrapper {...props} field={field} fieldIndex={0} />}
          field={field}
        />
      </>
    );
  }

  const defaultActionProps = {
    ...props,
    field,
    fieldIndex: 0,
    hiddenRemoveButton: true
  };

  data.isEditable = data.isEditable ?? true;

  return (
    <>
      {data.fields.map((field) => {
        const { key, name } = field;

        const actionProps = {
          ...props,
          fieldIndex: name,
          field,
          childrenStore
        };
        const actions = <ActionsWrapper {...actionProps} />;
        return (
          <div
            key={field.key}
            style={{
              margin: data.listItemMargin?.map((i) => i + 'px').join(' ')
            }}
          >
            <SlotContent
              {...props}
              childrenStore={childrenStore}
              actions={actions}
              listItemPropsStore={listItemPropsStore}
              field={field}
              suffixKey={keyRef.current}
              callbacks={callbacks.current}
            />
          </div>
        );
      })}
      {data.isEditable && data.fields.length === 0 && <ActionsWrapper {...defaultActionProps} />}
    </>
  );
}
