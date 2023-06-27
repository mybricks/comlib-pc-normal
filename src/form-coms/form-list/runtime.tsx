import React, { useMemo, useCallback, useLayoutEffect, useEffect } from 'react';
import { ChildrenStore, Data } from './types';
import SlotContent from './SlotContent';
import {
  updateValue,
  generateFields,
  validateForInput,
  setValuesForInput,
  changeValue
} from './utils';
import { deepCopy, typeCheck } from '../../utils';
import { validateFormItem } from '../utils/validator';
import { ActionsWrapper, addField } from './components/FormActions';
import { SlotIds, SlotInputIds } from './constants';
import { InputIds, OutputIds } from '../types';

export default function Runtime(props: RuntimeParams<Data>) {
  const { env, data, inputs, outputs, slots, logger, title, parentSlot, id } = props;

  const childrenStore = useMemo<ChildrenStore>(() => {
    return {};
  }, [env.edit]);
  // let initLength = useMemo(() => {
  //   return data.initLength;
  // }, [data.initLength]);

  useLayoutEffect(() => {
    // 设置值
    inputs[InputIds.SetValue]((value) => {
      if (typeCheck(value, ['Array', 'Undefined'])) {
        data.value = value;
        changeValue({ data, id, outputs, parentSlot, name: props.name });
        const changeLength = generateFields(data);
        data.currentAction = InputIds.SetValue;
        // changeLength < 0时，不会触发已有的列表项刷新
        changeLength <= 0 && setValuesForInput({ data, childrenStore });
      } else {
        logger.error(title + '的值是列表类型');
      }
    });

    // 设置初始值
    inputs[InputIds.SetInitialValue]((value) => {
      if (typeCheck(value, ['Array', 'Undefined'])) {
        data.value = value;
        outputs[OutputIds.OnInitial](deepCopy(data.value));
        const changeLength = generateFields(data);
        data.currentAction = InputIds.SetInitialValue;
        // changeLength < 0时，不会触发已有的列表项刷新
        changeLength <= 0 && setValuesForInput({ data, childrenStore });
      } else {
        logger.error(title + '的值是列表类型');
      }
    });

    // 获取值
    inputs['getValue']((val, outputRels) => {
      outputRels['returnValue'](data.value);
    });

    // 重置值
    inputs['resetValue'](() => {
      data.value = [{}];
      generateFields(data);
      data.currentAction = InputIds.ResetValue;
      setValuesForInput({ data, childrenStore });
    });

    //设置禁用
    inputs['setDisabled'](() => {
      data.disabled = true;
      data.currentAction = InputIds.SetDisabled;
      setValuesForInput({ data, childrenStore });
    });

    //设置启用
    inputs['setEnabled'](() => {
      data.disabled = false;
      data.currentAction = InputIds.SetEnabled;
      setValuesForInput({ data, childrenStore });
    }, []);

    // 校验
    inputs['validate']((val, outputRels) => {
      // 校验子项
      validate()
        .then(() => {
          // 校验自己
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
        })
        .catch((e) => {
          console.log('校验失败', e);
        });
    });
  }, []);

  if (env.runtime) {
    // 值更新
    slots[SlotIds.FormItems]._inputs[SlotInputIds.ON_CHANGE](({ id, name, value }) => {
      // 只有在用户操作触发时才收集更新值
      !data.currentAction &&
        updateValue({ ...props, childrenStore, childId: id, childName: name, value });
    });
  }

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
        const fieldPromise = data.items.map((item) => {
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
          <div key={field.key}>
            <SlotContent {...props} childrenStore={childrenStore} actions={actions} field={field} />
          </div>
        );
      })}
      {data.fields.length === 0 && <ActionsWrapper {...defaultActionProps} />}
    </>
  );
}
