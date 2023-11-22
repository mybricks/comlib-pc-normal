import React, { useMemo, useCallback, useLayoutEffect, useEffect, useRef } from 'react';
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
import { RuleKeys, validateFormItem } from '../utils/validator';
import { ActionsWrapper, addField, removeField } from './components/FormActions';
import { SlotIds, SlotInputIds, InputIds as SelfInputIds } from './constants';
import { InputIds, OutputIds } from '../types';
import { inputIds, outputIds } from '../form-container/constants';
import { defaultRules } from './editors';

export default function Runtime(props: RuntimeParams<Data>) {
  const { env, data, inputs, outputs, slots, logger, title, parentSlot, id } = props;

  const validateRelOuputRef = useRef<any>(null);

  const childrenStore = useMemo<ChildrenStore>(() => {
    return {};
  }, [env.edit]);
  // let initLength = useMemo(() => {
  //   return data.initLength;
  // }, [data.initLength]);

  useLayoutEffect(() => {
    data.userAction = {
      type: '',
      startIndex: -1
    };
    // 设置值
    inputs[InputIds.SetValue]((value) => {
      if (typeCheck(value, ['Array', 'Undefined', 'NULL'])) {
        data.value = value;
        changeValue({ data, id, outputs, parentSlot, name: props.name });
        const changeLength = generateFields(data);
        data.userAction.type = InputIds.SetValue;
        // changeLength < 0时，不会触发已有的列表项刷新
        changeLength <= 0 && setValuesForInput({ data, childrenStore });
      } else {
        logger.error(title + '[设置值]: 类型不合法');
      }
    });

    // 设置初始值
    inputs[InputIds.SetInitialValue]((value) => {
      if (typeCheck(value, ['Array', 'Undefined', 'NULL'])) {
        data.value = value;
        outputs[OutputIds.OnInitial](deepCopy(data.value));
        const changeLength = generateFields(data);
        data.userAction.type = InputIds.SetInitialValue;
        // changeLength < 0时，不会触发已有的列表项刷新
        changeLength <= 0 && setValuesForInput({ data, childrenStore });
      } else {
        logger.error(title + '[设置初始值]: 类型不合法');
      }
    });

    // 获取值
    inputs['getValue']((val, outputRels) => {
      outputRels['returnValue'](data.value);
    });

    // 重置值
    inputs['resetValue'](() => {
      data.value = [];
      data.fields = [];
      data.MaxKey = -1;
    });

    //设置禁用
    inputs['setDisabled'](() => {
      data.disabled = true;
      data.userAction.type = InputIds.SetDisabled;
      setValuesForInput({ data, childrenStore });
    });

    //设置启用
    inputs['setEnabled'](() => {
      data.disabled = false;
      data.userAction.type = InputIds.SetEnabled;
      setValuesForInput({ data, childrenStore });
    }, []);

    //设置启用/禁用
    inputs['isEnable']((val) => {
      if (val === true) {
        data.disabled = false;
        data.userAction.type = InputIds.SetEnabled;
        setValuesForInput({ data, childrenStore });
      } else {
        data.disabled = true;
        data.userAction.type = InputIds.SetDisabled;
        setValuesForInput({ data, childrenStore });
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
              const cutomRule = (data.rules || defaultRules).find(
                (i) => i.key === RuleKeys.CUSTOM_EVENT
              );
              if (cutomRule?.status) {
                validateRelOuputRef.current = outputRels['returnValidate'];
                outputs[outputIds.ON_VALIDATE](data.value);
              } else {
                outputRels['returnValidate'](r);
              }
            })
            .catch((e) => {
              outputRels['returnValidate'](e);
            });
        })
        .catch((e) => {
          console.log('校验失败', e);
        });
    });

    // 设置校验信息
    inputs[inputIds.SET_VALIDATE_INFO]((info: object) => {
      if (validateRelOuputRef.current) {
        validateRelOuputRef.current(info);
      }
    });

    // 新增一项
    inputs[SelfInputIds.AddField]?.((val) => {
      addField({ data }, val);
    });
    // 删除一项
    inputs[SelfInputIds.RemoveField]?.((val) => {
      const { index, key } = val;
      const fieldIndex = typeof index === 'number' ? index : data.fields.length;
      const field = {
        name: fieldIndex,
        key
      };
      removeField({ ...props, childrenStore, field, fieldIndex });
    });
  }, []);

  if (env.runtime) {
    // 值更新
    slots[SlotIds.FormItems]._inputs[SlotInputIds.ON_CHANGE](({ id, name, value }) => {
      // 只有在用户操作触发时才收集更新值
      !data.userAction.type &&
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
          <div
            key={field.key}
            style={{
              margin: data.listItemMargin?.map((i) => i + 'px').join(' ')
            }}
          >
            <SlotContent {...props} childrenStore={childrenStore} actions={actions} field={field} />
          </div>
        );
      })}
      {data.fields.length === 0 && <ActionsWrapper {...defaultActionProps} />}
    </>
  );
}
