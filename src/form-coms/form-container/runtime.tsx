import React, {
  useEffect,
  useMemo,
  useCallback,
  useLayoutEffect,
  Fragment,
  useState,
  useRef
} from 'react';
import { Form } from 'antd';
import { typeCheck } from '../../utils';
import { Data, FormControlInputId, FormItems } from './types';
import SlotContent from './SlotContent';
import { getLabelCol, isObject } from './utils';
import { slotInputIds, inputIds, outputIds } from './constants';
import { ValidateInfo } from '../types';
import css from './styles.less';

type FormControlInputRels = {
  validate: (val?: any) => {
    returnValidate: (cb: (val: ValidateInfo) => void) => void;
  };
  getValue: (val?: any) => {
    returnValue: (val) => {};
  };
  [key: string]: (val?: any) => void;
};

type FormControlInputType = {
  [key in FormControlInputId]: FormControlInputRels[key];
};

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, env, outputs, inputs, slots, _inputs } = props;
  const formContext = useRef({ store: {} });
  const [formRef] = Form.useForm();

  const childrenInputs = useMemo<{
    [id: string]: FormControlInputType;
  }>(() => {
    return {};
  }, [env.edit]);

  useLayoutEffect(() => {
    inputs[inputIds.SET_FIELDS_VALUE]((val) => {
      // resetFields();
      setFieldsValue(val);
      slots['content'].inputs[slotInputIds.SET_FIELDS_VALUE](val);
    });

    inputs[inputIds.SET_INITIAL_VALUES]((val) => {
      setInitialValues(val);
      slots['content'].inputs[slotInputIds.SET_FIELDS_VALUE](val);
    });

    inputs['resetFields']((val, outputRels) => {
      resetFields();
      outputRels['onResetFinish']();
    });

    inputs[inputIds.SUBMIT]((val, outputRels) => {
      submit(outputRels);
    });

    inputs[inputIds.SUBMIT_AND_MERGE]((val, outputRels) => {
      if (isObject(val)) {
        submitMethod(outputIds.ON_MERGE_FINISH, outputRels, val);
      } else {
        submitMethod(outputIds.ON_MERGE_FINISH, outputRels);
      }
    });

    inputs[inputIds.GET_FIELDS_VALUE]?.((val, outputRels) => {
      getValue().then((v) => {
        outputRels[outputIds.RETURN_VALUES](v);
      });
    });

    // inputs[inputIds.SET_DISABLED](() => {
    //   data.config.disabled = true;
    //   setDisabled();
    // });

    // inputs[inputIds.SET_ENABLED](() => {
    //   data.config.disabled = false;
    //   setEnabled();
    // });

    //------ For 表单项私有 start ---------
    // _inputs['validate']((val, outputRels) => {
    //   validate().then((r) => {
    //     outputRels['returnValidate']({
    //       validateStatus: 'success'
    //     });
    //   });
    // });

    // _inputs['getValue']((val, outputRels) => {
    //   getValue().then((v) => {
    //     outputRels['returnValue'](v);
    //   });
    // });

    // _inputs['setValue']((val) => {
    //   setFieldsValue(val);
    // });
    //------ For 表单项私有 end---------

    /**
     * @description 响应触发对应表单项校验
     */
    slots['content']._inputs[slotInputIds.VALIDATE_TRIGGER](({ id }) => {
      const item = data.items.find((item) => item.id === id);
      if (item) {
        const input = childrenInputs[item.id];
        validateForInput({ item, input });
      }
    });
  }, []);

  if (env.runtime) {
    inputs[inputIds.SET_FORM_ITEMS_PROPS]((val) => {
      setFormItemsProps(val);
    });

    slots['content']._inputs[slotInputIds.ON_CHANGE](({ id, value }) => {
      const item = data.items.find((item) => item.id === id);
      if (item) {
        const fieldsValue = { [item.name || item.label]: value };

        formContext.current.store = { ...formContext.current.store, ...fieldsValue };

        outputs[outputIds.ON_VALUES_CHANGE]({
          changedValues: { ...fieldsValue },
          allValues: { ...formContext.current.store }
        });
      }
    });
  }
  /**
   * 设置表单项公共配置
   * @param formItemsProps 表单项配置对象
   */
  const setFormItemsProps = useCallback((formItemsProps: { string: FormItems }) => {
    if (typeCheck(formItemsProps, ['Object'])) {
      Object.entries(formItemsProps).map(([name, props]) => {
        if (!typeCheck(props, ['Object'])) {
          console.warn(`表单项配置不是对象类型`);
          return;
        }

        const formItemIndex = data.items.findIndex((item) => (item.name || item.label) === name);
        if (formItemIndex < 0) {
          console.warn(`表单项${name}不存在`);
          return;
        }

        const formItem = data.items[formItemIndex];
        const newFormItem = { ...props };
        const { descriptionStyle, labelStyle } = formItem;
        if (!newFormItem.descriptionStyle) newFormItem.descriptionStyle = {};
        if (!newFormItem.labelStyle) newFormItem.labelStyle = {};
        Object.assign(newFormItem.descriptionStyle, descriptionStyle);
        Object.assign(newFormItem.labelStyle, labelStyle);

        const temp = {
          ...formItem,
          ...props
        };
        data.items[formItemIndex] = temp;
      });
    }
  }, []);

  const setFieldsValue = (val) => {
    if (val) {
      Object.keys(val).forEach((key) => {
        setValuesForInput({ childrenInputs, formItems: data.items, name: key }, 'setValue', val);
      });
    }
  };

  const setInitialValues = (val) => {
    if (val) {
      Object.keys(val).forEach((key) => {
        setValuesForInput(
          { childrenInputs, formItems: data.items, name: key },
          'setInitialValue',
          val
        );
      });
    }
  };

  const resetFields = () => {
    data.items.forEach((item) => {
      const id = item.id;
      const input = childrenInputs[id];
      input?.resetValue();
      item.validateStatus = undefined;
      item.help = undefined;
    });
  };

  // const setDisabled = () => {
  //   data.items.forEach((item) => {
  //     const id = item.id;
  //     const input = childrenInputs[id];
  //     input?.setDisabled && input?.setDisabled();
  //   });
  // };

  // const setEnabled = () => {
  //   data.items.forEach((item) => {
  //     const id = item.id;
  //     const input = childrenInputs[id];
  //     input?.setEnabled && input?.setEnabled();
  //   });
  // };

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

  const getValue = useCallback(() => {
    return new Promise((resolve, reject) => {
      /** 隐藏的表单项，不收集数据 **/
      const formItems = data.submitHiddenFields
        ? data.items
        : data.items.filter((item) => item.visible);

      Promise.all(
        formItems.map((item) => {
          const id = item.id;
          const input = childrenInputs[id];

          return new Promise((resolve, reject) => {
            let count = 0;
            let value = {};
            input?.getValue().returnValue((val, key) => {
              //调用所有表单项的 getValue/returnValue
              if (typeof data.fieldsLength !== 'undefined') {
                value[key] = {
                  name: item.name,
                  value: val
                };

                count++;

                if (count == data.fieldsLength) {
                  resolve(value);
                }
              } else {
                value = {
                  name: item.name || item.label,
                  value: val
                };

                resolve(value);
              }
            });
          });
        })
      )
        .then((values) => {
          if (data.dataType === 'list') {
            const arr = [];
            values.forEach((valItem) => {
              Object.keys(valItem).map((key) => {
                if (!arr[key]) {
                  arr[key] = {};
                }
                arr[key][valItem[key].name] = valItem[key].value;
              });
            });
            resolve(arr);
          } else {
            const rtn = {};

            values.forEach((item: any) => {
              rtn[item.name] = item.value;
            });

            resolve({ ...rtn });
          }
        })
        .catch((e) => reject(e));
    });
  }, []);

  const submit = (outputRels?: any) => {
    submitMethod(outputIds.ON_FINISH, outputRels);
  };

  const submitMethod = (outputId: string, outputRels?: any, params?: any) => {
    // console.log('提交', formContext.current.store)
    validate()
      .then(() => {
        getValue()
          .then((values: any) => {
            const res = { ...values, ...params };
            if (outputRels) {
              outputRels[outputId](res);
            } else {
              outputs[outputId](res);
            }
          })
          .catch((e) => {
            console.log('收集表单项值失败', e);
          });
      })
      .catch((e) => {
        console.log('校验失败', e);
      });
  };

  const { labelWrap, ...formCfg } = data.config;

  return (
    <div className={css.wrapper}>
      <Fragment>
        {!data.isFormItem ? (
          <Form
            form={formRef}
            labelCol={
              (data.config?.layout || data.layout) === 'horizontal' ? getLabelCol(data) : undefined
            }
            {...formCfg}
            // wrapperCol={{ span: 16 }}
          >
            <SlotContent
              env={env}
              slots={slots}
              data={data}
              childrenInputs={childrenInputs}
              outputs={outputs}
              submit={submitMethod}
            />
          </Form>
        ) : (
          <SlotContent env={env} slots={slots} data={data} childrenInputs={childrenInputs} />
        )}
      </Fragment>
    </div>
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

const setValuesForInput = ({ childrenInputs, formItems, name }, inputId, values) => {
  const item = formItems.find((item) => (item.name || item.label) === name);
  if (item) {
    const input = childrenInputs[item.id];
    if (isObject(values[name])) {
      input[inputId] && input[inputId]({ ...values[name] });
    } else {
      input[inputId] && input[inputId](values[name]);
    }
  }
};
