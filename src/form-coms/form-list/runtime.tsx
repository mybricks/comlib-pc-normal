import React, { useMemo, useCallback, useLayoutEffect, useEffect } from 'react';
import { ChildrenStore, Data, FormControlInputRels } from './types';
import SlotContent from './SlotContent';
import { updateValue, getValue, generateFields } from './utils';
import { typeCheck } from '../../utils';
import { validateFormItem } from '../utils/validator';
import { ActionsWrapper } from './components/FormActions';
import { SlotIds, SlotInputIds } from './constants';
import { InputIds, OutputIds } from '../types';

export default function Runtime(props: RuntimeParams<Data>) {
  const { env, data, inputs, outputs, slots, logger, title, parentSlot, id } = props;

  const childrenStore = useMemo<ChildrenStore>(() => {
    return {};
  }, [env.edit]);

  useLayoutEffect(() => {
    // 设置值
    inputs[InputIds.SetValue]((value) => {
      if (typeCheck(value, ['Array', 'Undefined'])) {
        data.value = value;
        generateFields(data);
        data.currentInputId = InputIds.SetValue;
      } else {
        logger.error(title + '的值是列表类型');
      }
    });

    // 设置初始值
    inputs[InputIds.SetInitialValue]((value) => {
      if (typeCheck(value, ['Array', 'Undefined'])) {
        data.value = value;
        outputs[OutputIds.OnInitial](data.value);
        data.currentInputId = InputIds.SetInitialValue;
        generateFields(data);
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
      if (Array.isArray(data.value)) {
        data.fields = [
          {
            key: 0,
            name: 0
          }
        ];
        data.value = [{}];
        data.currentInputId = InputIds.ResetValue;
      }
    });

    //设置禁用
    inputs['setDisabled'](() => {
      data.disabled = true;
      data.currentInputId = InputIds.SetDisabled;
    });

    //设置启用
    inputs['setEnabled'](() => {
      data.disabled = false;
      data.currentInputId = InputIds.SetEnabled;
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
    slots[SlotIds.FormItems]._inputs[SlotInputIds.ON_CHANGE](({ id, value }) => {
      console.log('-------值更新---', id, value);
      updateValue({ ...props, childrenStore });
    });
  }

  const validate = useCallback(() => {
    return new Promise((resolve, reject) => {
      const allPromise: (
        | Promise<any>
        | {
            validateStatus: string;
          }
      )[] = [];

      data.fields.map((field) => {
        const { name, key } = field;
        const fieldFormItems = childrenStore[key];
        const fieldPromise = data.items.map((item) => {
          const { index, inputs, visible } = fieldFormItems[item.id];
          if (!data.submitHiddenFields && !visible) {
            // 隐藏的表单项，不再校验
            return { validateStatus: 'success' };
          }
          return new Promise((resolve, reject) => {
            validateForInput({ item, inputs }, resolve);
          });
        });
        allPromise.push(...fieldPromise);
      });
      Promise.all(allPromise)
        .then((values) => {
          console.log(values, 'values----------校验');
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

  useEffect(() => {
    // 收集子项初始值
    getValue({ data, childrenStore })
      .then(() => {
        if (data.value?.[0]) data.initialValues = data.value[0];
      })
      .catch((e) => logger.error(e));
  }, []);

  if (env.edit) {
    return (
      <>
        <SlotContent
          {...props}
          childrenStore={childrenStore}
          actions={<ActionsWrapper {...props} />}
          field={{ name: 0, key: 0 }}
        />
      </>
    );
  }

  const defaultActionProps = {
    ...props,
    hiddenRemoveButton: true
  };
  console.log('-------render------', data.fields);
  return (
    <>
      {data.fields.map((field) => {
        // 更新childrenInputs的index
        const { key, name } = field;
        data.items.forEach((item) => {
          if (childrenStore[key]?.[item.id]) {
            childrenStore[key][item.id].index = name;
          }
        });
        // console.log('-------更新childrenInputs的index---', childrenStore);

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

/**
 * @description 触发表单项校验，并更新校验结果
 */
const validateForInput = (
  { inputs, item }: { inputs: FormControlInputRels; item: any },
  cb?: (val: any) => void
): void => {
  inputs?.validate({ ...item }).returnValidate((validateInfo) => {
    item.validateStatus = validateInfo?.validateStatus;
    item.help = validateInfo?.help;
    if (cb) {
      cb(validateInfo);
    }
  });
};
