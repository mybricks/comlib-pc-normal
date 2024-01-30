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
import { Data, FormControlInputId, FormItems } from './types';
import SlotContent from './SlotContent';
import { getLabelCol, isObject, getFormItem } from './utils';
import { slotInputIds, inputIds, outputIds } from './constants';
import { ValidateInfo } from '../types';
import css from './styles.less';
import { checkIfMobile, typeCheck, deepCopy } from '../../utils';
import { NamePath } from 'antd/lib/form/interface';

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
  const { data, env, outputs, inputs, slots, _inputs, logger, title } = props;
  const formContext = useRef({ store: {} });
  const [formRef] = Form.useForm();
  const isMobile = checkIfMobile(env);

  const childrenInputs = useMemo<{
    [id: string]: FormControlInputType;
  }>(() => {
    return {};
  }, [env.edit]);

  useLayoutEffect(() => {
    if (env.runtime) {
      //设置表单数据，触发值变化
      inputs[inputIds.SET_FIELDS_VALUE]((val, relOutputs) => {
        // resetFields();
        setFieldsValue(val, () => {
          slots['content'].inputs[slotInputIds.SET_FIELDS_VALUE](val);
          relOutputs['setFieldsValueDone'](val);
        });
      });

      //设置表单初始化数据
      inputs[inputIds.SET_INITIAL_VALUES]((val, relOutputs) => {
        setInitialValues(val, () => {
          slots['content'].inputs[slotInputIds.SET_FIELDS_VALUE](val);
          relOutputs['setInitialValuesDone'](val);
        });
      });

      inputs['resetFields']((val, outputRels) => {
        const cb = () => {
          outputRels['onResetFinish']();
        };
        resetFields(cb);
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

      inputs[inputIds.SET_DISABLED]((_, relOutputs) => {
        data.config.disabled = true;
        setDisabled();
        relOutputs['setDisabledDone']();
      });

      inputs[inputIds.SET_ENABLED]((_, relOutputs) => {
        data.config.disabled = false;
        setEnabled();
        relOutputs['setEnabledDone']();
      });

      inputs[inputIds.isEditable]((val, relOutputs) => {
        data.isEditable = val;
        setIsEditable(val);
        relOutputs['isReadOnlyDone'](val);
      });

      // 校验字段
      inputs[inputIds.VALIDATE_FIELDS]((nameList: NamePath[], relOutputs) => {
        if (typeof nameList === 'string') nameList = [nameList];
        let isValid = false;
        if (Array.isArray(nameList)) {
          nameList.forEach((name) => {
            const item = data.items.find((item) => item.name === name);
            if (item) {
              isValid = true;
              const input = getFromItemInputEvent(item, childrenInputs);
              validateForInput({
                input,
                model: {
                  curFormItem: item,
                  ...formContext.current.store
                }
              });
            }
          });
        }
        if (!isValid) {
          logger.warn(`${title}[校验表单项]无效: 请输入合法的字段数组`);
          console.warn(`${title}[校验表单项]无效: 请输入合法的字段数组`);
        }
        relOutputs['validateFieldsDone'](isValid);
      });

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
      slots['content']._inputs[slotInputIds.VALIDATE_TRIGGER]((params) => {
        const { id, name } = params;
        const { item, isFormItem } = getFormItem(data, { id, name });

        if (item && isFormItem) {
          // const input = childrenInputs[item.id];
          const input = getFromItemInputEvent(item, childrenInputs);
          validateForInput({
            input,
            model: {
              curFormItem: item,
              ...formContext.current.store
            }
          });
        }
      });
    }
  }, []);

  if (env.runtime) {
    inputs[inputIds.SET_FORM_ITEMS_PROPS]((val, relOutputs) => {
      setFormItemsProps(val);
      relOutputs['setFormItemsPropsDone'](val);
    });

    slots['content']._inputs[slotInputIds.ON_CHANGE](({ id, name, value }) => {
      const { item, isFormItem } = getFormItem(data, { id, name });

      if (item && isFormItem) {
        const fieldsValue = { [item.name]: value };

        formContext.current.store = { ...formContext.current.store, ...fieldsValue };

        if (outputs[outputIds.ON_VALUES_CHANGE]) {
          outputs[outputIds.ON_VALUES_CHANGE]?.({
            changedValues: { ...fieldsValue },
            allValues: { ...formContext.current.store }
          });
        } else {
          console.warn(`outputId onValuesChange 不存在，请升级至最新版本`);
        }
      }
    });

    (data.actions.items || []).forEach((item) => {
      const { key } = item;
      //禁用
      inputs[`${inputIds.SetDisable}_${key}`]?.(() => {
        item.disabled = true;
      });
      //启用
      inputs[`${inputIds.SetEnable}_${key}`]?.(() => {
        item.disabled = false;
      });
      //显示
      inputs[`${inputIds.SetShow}_${key}`]?.(() => {
        item.visible = true;
      });
      //隐藏
      inputs[`${inputIds.SetHidden}_${key}`]?.(() => {
        item.visible = false;
      });
    });
  }

  // useEffect(() => {
  //   if (env.edit) {
  //     if (data.domainModel.entity && data.items.length === 0) {
  //       const fieldAry = data.domainModel.entity.fieldAry

  //       fieldAry?.forEach(item => {
  //         if (!item.isPrivate) {
  //           slots['content'].addCom('mybricks.normal-pc.form-text')
  //         }
  //       })

  //       console.log(fieldAry, slots)
  //     }
  //   }
  // }, [data.domainModel.entity, slots])

  const objectFilter = (val) => {
    const newObj = {};
    if (typeCheck(val, 'object') && Object.keys(val).length > 0) {
      Object.entries(val).forEach(([key, value]) => {
        const item = data.items.find((item) => item.name === key);
        if (item) {
          newObj[key] = value;
        }
      });
    }
    return newObj;
  };

  const setFieldsValue = (val, cb?) => {
    const formData = objectFilter(val);
    if (Object.keys(formData).length > 0) {
      const length = Object.keys(formData).length - 1;
      Object.keys(formData).forEach((key, inx) => {
        const isLast = inx === length;
        setValuesForInput(
          { childrenInputs, formItems: data.items, name: key },
          'setValue',
          formData,
          isLast ? cb : void 0
        );
      });
    } else {
      cb();
    }
  };

  const setInitialValues = (val, cb?) => {
    try {
      const formData = objectFilter(val);
      if (Object.keys(formData).length > 0) {
        const length = Object.keys(formData).length - 1;
        Object.keys(formData).forEach((key, inx) => {
          const isLast = inx === length;
          setValuesForInput(
            { childrenInputs, formItems: data.items, name: key },
            'setInitialValue',
            formData,
            isLast ? cb : void 0
          );
        });
      } else {
        cb();
      }
    } catch (e) {
      cb();
      console.error(e);
    }
  };

  const resetFields = (cb) => {
    try {
      data.items.forEach((item, index) => {
        // const id = item.id;
        // const input = childrenInputs[id];
        const isLast = index === data.items.length - 1;
        const input = getFromItemInputEvent(item, childrenInputs);
        input?.resetValue().resetValueDone(() => {
          item.validateStatus = undefined;
          item.help = undefined;
          if (isLast) cb?.();
        });
      });
    } catch {
      cb?.();
    }
  };

  const setDisabled = (nameList?: string[]) => {
    data.items.forEach((item) => {
      if (!nameList || nameList.includes(item.name)) {
        const input = getFromItemInputEvent(item, childrenInputs);
        input?.setDisabled && input?.setDisabled();
      }
    });
  };

  const setEnabled = (nameList?: string[]) => {
    data.items.forEach((item) => {
      if (!nameList || nameList.includes(item.name)) {
        const input = getFromItemInputEvent(item, childrenInputs);
        input?.setEnabled && input?.setEnabled();
      }
    });
  };

  const setIsEditable = (val, nameList?: string[]) => {
    data.items.forEach((item) => {
      if (!nameList || nameList.includes(item.name)) {
        const input = getFromItemInputEvent(item, childrenInputs);
        input?.isEditable && input?.isEditable(val);
      }
    });
  };

  /**
   * 设置表单项公共配置
   * @param formItemsProps 表单项配置对象
   */
  const setFormItemsProps = (formItemsProps: { string: FormItems }) => {
    if (typeCheck(formItemsProps, ['Object'])) {
      const disableFormList: string[] = [];
      const enableFormList: string[] = [];
      Object.entries(formItemsProps).map(([name, props]) => {
        if (!typeCheck(props, ['Object'])) {
          console.warn(`${title}: 设置表单项【${name}】配置不是对象类型`);
          return;
        }

        const formItemIndex = data.items.findIndex((item) => item.name === name);
        if (formItemIndex < 0) {
          console.warn(`${title}: 设置表单项配置【${name}】不存在`);
          return;
        }

        const formItem = data.items[formItemIndex];
        const { labelStyle, descriptionStyle, labelAlign, labelAutoWrap, ...newFormItem } = props;

        // 禁用、启用
        if (typeof newFormItem.disabled === 'boolean') {
          (newFormItem.disabled ? disableFormList : enableFormList).push(name);
        }

        const temp = {
          ...formItem,
          ...newFormItem,
          // 标题样式、提示语样式
          dynamicStyle: {
            labelStyle,
            descriptionStyle,
            labelAlign,
            labelAutoWrap
          }
        };
        data.items[formItemIndex] = temp;
      });
      // 触发批量禁用、启用
      disableFormList.length && setDisabled(disableFormList);
      enableFormList.length && setEnabled(enableFormList);
    }
  };

  const validate = useCallback(() => {
    return new Promise((resolve, reject) => {
      /** 过滤隐藏表单项 */
      const formItems = getFormItems(data, childrenInputs);

      Promise.all(
        formItems.map((item) => {
          // const id = item.id;
          // const input = childrenInputs[id];
          const input = getFromItemInputEvent(item, childrenInputs);

          return new Promise((resolve, reject) => {
            if (data.submitHiddenFields && !data.validateHiddenFields && !item.visible) {
              resolve({
                validateStatus: 'success'
              });
            } else {
              validateForInput(
                {
                  input,
                  model: {
                    curFormItem: item,
                    ...formContext.current.store
                  }
                },
                resolve
              );
            }
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
      const formItems = getFormItems(data, childrenInputs);

      Promise.all(
        formItems.map((item) => {
          // const id = item.id;
          // const input = childrenInputs[id];
          const input = getFromItemInputEvent(item, childrenInputs);

          return new Promise((resolve, reject) => {
            let value = {};

            input?.getValue().returnValue((val, key) => {
              //调用所有表单项的 getValue/returnValue
              value = {
                name: item.name,
                value: val
              };

              resolve(value);
            });
          });
        })
      )
        .then((values) => {
          const rtn = {};

          values.forEach((item: any) => {
            rtn[item.name] = item.value;
          });

          resolve({ ...rtn });
        })
        .catch((e) => reject(e));
    });
  }, []);

  const submit = (outputRels?: any) => {
    submitMethod(outputIds.ON_FINISH, outputRels);
  };

  const submitMethod = (outputId: string, outputRels?: any, params?: any) => {
    validate()
      .then(() => {
        getValue()
          .then((values: any) => {
            let res = { ...values, ...params };

            if (
              data.domainModel?.entity?.fieldAry?.length > 0 &&
              data.domainModel?.isQuery &&
              data.domainModel?.type === 'domain'
            ) {
              // 领域模型数据处理
              res = {
                values: { ...res },
                fieldsRules: { ...data.domainModel.queryFieldRules }
              };
            }

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
        const { validateStatus, ...other } = e;
        outputRels && outputRels[outputIds.ON_SUBMIT_ERROR](other);
        console.log('校验失败', e);
      });
  };

  const { labelWrap, disabled, ...formCfg } = data.config;

  return (
    <div className={css.wrapper}>
      <Fragment>
        {!data.isFormItem ? (
          <Form
            className={
              slots['content'].size === 0 && env.edit && data.actions.visible
                ? css.empty
                : undefined
            }
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
 * @description 获取表单项列表
 */
const getFormItems = (data: Data, childrenInputs) => {
  let formItems = data.items;

  // hack 脏数据问题，表单项数与实际表单项数不一致
  if (data.items.length !== Object.keys(childrenInputs).length) {
    formItems = formItems.filter((item) => {
      if (item.comName) {
        return childrenInputs[item.comName];
      }

      return childrenInputs[item.id];
    });
  }

  // 过滤隐藏表单项
  if (!data.submitHiddenFields) {
    formItems = formItems.filter((item) => item.visible);
  }

  return formItems;
};

/**
 * @description 过滤表单数据
 */
const getFieldsValue = (data: Data, store: {}, childrenInputs) => {
  let result = {};

  const formItems = getFormItems(data, childrenInputs);

  if (data.submitHiddenFields) {
    result = deepCopy(store);
  } else {
    formItems.forEach((item) => {
      if (item.visible) {
        result[item.name] = store[item.name];
      }
    });
  }

  return result;
};

/**
 * @description 触发表单项校验，并更新校验结果
 */
const validateForInput = (
  { input, model }: { input: FormControlInputType; model: any },
  cb?: (val: any) => void
): void => {
  const item = model?.curFormItem;
  input?.validate(model).returnValidate((validateInfo) => {
    // 存在index, 表示校验失败项是动态表单项的子项
    if (validateInfo.index === undefined) {
      item.validateStatus = validateInfo?.validateStatus;
      item.help = validateInfo?.help;
    }
    if (cb) {
      cb({
        ...validateInfo,
        name: item.name
      });
    }
  });
};

const setValuesForInput = ({ childrenInputs, formItems, name }, inputId, values, cb?) => {
  const item = formItems.find((item) => item.name === name);
  const inputDoneId = inputId + 'Done';

  if (item) {
    const input = getFromItemInputEvent(item, childrenInputs);

    if (input) {
      if (isObject(values[name])) {
        if (input[inputId]) {
          input?.[inputId]?.({ ...values[name] });
        }
      } else {
        input[inputId] &&
          input[inputId](values[name])[inputDoneId]?.((val) => {
            cb?.();
          });
      }
    }
  }
};

const getFromItemInputEvent = (formItem, childrenInputs) => {
  let input;

  input = childrenInputs[formItem.id];
  if (formItem.comName) {
    input = childrenInputs[formItem.comName];
  }

  if (!input) {
    console.warn(
      `FormItem Input Not Found, FormItem Name: ${formItem.name}, 可能存在脏数据 请联系开发人员`
    );
  }

  return input;
};
