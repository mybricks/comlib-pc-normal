import React, { useMemo, useCallback, useLayoutEffect, useEffect } from 'react';
import { ChildrenInputs, Data, FormControlInputType, FormItems } from './types';
import SlotContent from './SlotContent';
import {
  changeValue,
  updateValue,
  isObject,
  getValue,
  generateFields,
  setValuesForInput,
  isChildrenInputsValid
} from './utils';
import { typeCheck } from '../../utils';
import { validateFormItem } from '../utils/validator';
import { ActionsWrapper } from './components/FormActions';
import { SlotIds, SlotInputIds } from './constants';
import { InputIds, OutputIds } from '../types';

export default function Runtime(props: RuntimeParams<Data>) {
  const { env, data, inputs, outputs, slots, logger, title, parentSlot, id } = props;

  const childrenInputs = useMemo<ChildrenInputs>(() => {
    return {};
  }, [env.edit]);

  useLayoutEffect(() => {
    inputs[InputIds.SetValue]((value) => {
      if (typeCheck(value, ['Array', 'Undefined'])) {
        data.value = value;
        generateFields(data);
        data.currentInputId = InputIds.SetValue;
      } else {
        logger.error(title + '的值是列表类型');
      }
    });

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
  }, []);

  if (env.runtime) {
    // 值更新
    slots[SlotIds.FormItems]._inputs[SlotInputIds.ON_CHANGE](({ id, value }) => {
      console.log('-------值更新---', id, value);
      updateValue({ ...props, childrenInputs });
    });
  }

  const validate = useCallback(() => {
    return new Promise((resolve, reject) => {
      Promise.all(
        data.items.map((item) => {
          if (!data.submitHiddenFields) {
            // 隐藏的表单项，不再校验
            if (!item.visible) return { validateStatus: 'success' };
          }

          const id = item.id;
          const input = childrenInputs[id];

          return new Promise((resolve, reject) => {
            validateForInput({ item, input }, resolve);
          });
        })
      )
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

  useEffect(() => {
    // 收集子项初始值
    getValue({ data, childrenInputs })
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
          childrenInputs={childrenInputs}
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
          if (childrenInputs[key]?.[item.id]) {
            childrenInputs[key][item.id].index = name;
          }
        });
        // console.log('-------更新childrenInputs的index---', childrenInputs);

        const actionProps = {
          ...props,
          fieldIndex: name,
          field,
          childrenInputs
        };
        const actions = <ActionsWrapper {...actionProps} />;
        return (
          <div key={field.key}>
            <SlotContent
              {...props}
              childrenInputs={childrenInputs}
              actions={actions}
              field={field}
            />
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
  { input, item }: { input: FormControlInputType; item: any },
  cb?: (val: any) => void
): void => {
  input?.validate({ ...item }).returnValidate((validateInfo) => {
    item.validateStatus = validateInfo?.validateStatus;
    item.help = validateInfo?.help;
    if (cb) {
      cb(validateInfo);
    }
  });
};
