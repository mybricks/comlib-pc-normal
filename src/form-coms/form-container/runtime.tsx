import React, {
  useEffect,
  useMemo,
  useCallback,
  useLayoutEffect,
  Fragment,
  useState,
  useRef
} from 'react';
import { uuid } from '../../utils';
import { Form } from 'antd';
import { Data, DynamicItemData, FormControlInputId, FormItems } from './types';
import SlotContent from './SlotContent';
import { getLabelCol, isObject, getFormItem } from './utils';
import { slotInputIds, inputIds, outputIds } from './constants';
import { ValidateInfo } from '../types';
import { refreshSchema } from './schema';
import css from './styles.less';
import classnames from 'classnames';
import { checkIfMobile, typeCheck, deepCopy } from '../../utils';
import { NamePath } from 'antd/lib/form/interface';
import { isArray } from 'lodash';
import useElementWidth from './hooks/use-element-width';

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
  console.log(outputs)
  const formContext = useRef({ store: {} });
  const [formRef] = Form.useForm();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const isMobile = checkIfMobile(env);

  const dynamicEnableOrDisabledRef = useRef(() => {});

  const [wrapperWidth] = useElementWidth(wrapperRef);
  const childrenInputs = useMemo<{
    [id: string]: FormControlInputType;
  }>(() => {
    return {};
  }, [env.edit]);

  const adaptiveMobile = useMemo(() => {
    const layout = data.config?.layout || data.layout;
    let isHor = layout === 'horizontal';
    // 水平布局 且开启宽度适配
    return isHor && data.mobileConfig?.enableWidthAdaptive !== false;
  }, [data.layout, data.config.layout, data.mobileConfig?.enableWidthAdaptive]);

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
      /** 设置表单数据源 */
      inputs[inputIds.setFieldsSource]((val, relOutputs) => {
        setFieldsSourceValue(val, () => {
          slots['content'].inputs[slotInputIds.SET_FIELDS_SOURCE](val);
          relOutputs['setFieldsSourceDone'](val);
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
      // 动态设置表单项
      if (data.useDynamicItems && inputs[inputIds.setDynamicFormItems]) {
        inputs[inputIds.setDynamicFormItems]((val: Array<DynamicItemData>, relOutputs: any) => {
          let newItems: any[] = [];
          if (!data.originItems) {
            // 运行时只执行一次，记录原始表单项
            data.originItems = JSON.parse(JSON.stringify(data.items));
          }
          const uniqueNames: string[] = [];
          const notFoundOrUniqueNames: string[] = [];
          const disableFormList: string[] = [];
          const enableFormList: string[] = [];
          const fieldsSource = {};
          val.forEach((item) => {
            let sameNameItem = data.originItems.find((i) => i.name === item.relOriginField);
            let isUniqueName = !uniqueNames.includes(item.name);
            if (sameNameItem && isUniqueName) {
              uniqueNames.push(item.name);
              // 动态输入的表单在搭建册不存在，不添加
              const disabledConfig =
                item.formItemProps?.disabled !== undefined
                  ? { disabled: item.formItemProps?.disabled }
                  : {};
              const { labelStyle, descriptionStyle, labelAlign, labelAutoWrap } =
                item.formItemProps || {};
              let dynamicStyle = {
                labelStyle,
                descriptionStyle,
                labelAlign,
                labelAutoWrap
              };
              if (typeof item.formItemProps?.disabled === 'boolean') {
                (item.formItemProps?.disabled ? disableFormList : enableFormList).push(item.name);
              }
              if (
                isArray(item.formItemProps?.fieldSource) ||
                isObject(item.formItemProps?.fieldSource)
              ) {
                fieldsSource[item.name] = item.formItemProps?.fieldSource;
              }
              let config = Object.assign(sameNameItem?.config || {}, disabledConfig);
              newItems.push({
                ...sameNameItem,
                name: item.name,
                label: item.label,
                id: uuid(),
                ...(item?.formItemProps ? item.formItemProps : {}),
                config,
                dynamicStyle
              });
            } else {
              notFoundOrUniqueNames.push(item.name);
            }
          });
          data.items = newItems;
          // 触发批量禁用、启用;需要在动态表单项childrenInputs
          dynamicEnableOrDisabledRef.current = () => {
            disableFormList.length && setDisabled(disableFormList);
            enableFormList.length && setEnabled(enableFormList);
            Object.keys(fieldsSource).length > 0 &&
              setFieldsSourceValue(fieldsSource, () => {
                slots['content'].inputs[slotInputIds.SET_FIELDS_SOURCE](fieldsSource);
              });
            relOutputs['setDynamicFormItemsDone']('done');
          };
          if (notFoundOrUniqueNames.length) {
            console.warn(
              `以下动态设置的字段名重复或者在搭建册不存在关联的字段`,
              notFoundOrUniqueNames.join(',')
            );
          }
        });
      }

      // 校验字段
      inputs[inputIds.VALIDATE_FIELDS]((nameList: NamePath[], relOutputs) => {
        if (typeof nameList === 'string') nameList = [nameList];
        if (Array.isArray(nameList)) {
          const validNameList = nameList.filter((name) =>
            data.items.find((item) => item.name === name)
          );
          if (!validNameList.length) {
            logger.warn(`${title}[校验表单项]无效: 请输入合法的字段数组`);
            console.warn(`${title}[校验表单项]无效: 请输入合法的字段数组`);
            return;
          }
          let count = 0;
          validNameList.forEach((name) => {
            const item = data.items.find((item) => item.name === name);
            const index = data.items.findIndex((item) => item.name === name);
            const input = getFromItemInputEvent(item, childrenInputs, {
              useDynamicItems: data.useDynamicItems
            });
            validateForInput(
              {
                input,
                model: {
                  curFormItem: item,
                  ...formContext.current.store
                }
              },
              (validateInfo) => {
                count++;
                if (validateInfo.validateStatus !== 'success') {
                  relOutputs['validateFieldsDone'](validateInfo);
                  count = 0;
                } else if (count === validNameList.length) {
                  relOutputs['validateFieldsDone']({
                    validateStatus: 'success'
                  });
                }
              }
            );
          });
        }
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
        const { id, name, validateInfo } = params;
        const { item, isFormItem } = getFormItem(data, {
          id,
          name,
          useDynamicItems: data.useDynamicItems
        });

        if (item && isFormItem) {
          if (validateInfo) {
            item.validateStatus = validateInfo?.validateStatus;
            item.help = validateInfo?.help;
            return;
          }
          // const input = childrenInputs[item.id];
          const input = getFromItemInputEvent(item, childrenInputs, {
            useDynamicItems: data.useDynamicItems
          });
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
      const { item, isFormItem } = getFormItem(data, {
        id,
        name,
        useDynamicItems: data.useDynamicItems
      });
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
      inputs[`${inputIds.SetDisable}_${key}`]?.((val, relOutputs) => {
        item.disabled = true;
        relOutputs[`${`${inputIds.SetDisable}_${key}`}Done`](val);
      });
      //启用
      inputs[`${inputIds.SetEnable}_${key}`]?.((val, relOutputs) => {
        item.disabled = false;
        relOutputs[`${`${inputIds.SetEnable}_${key}`}Done`](val);
      });
      //显示
      inputs[`${inputIds.SetShow}_${key}`]?.((val, relOutputs) => {
        item.visible = true;
        relOutputs[`${`${inputIds.SetShow}_${key}`}Done`](val);
      });
      //隐藏
      inputs[`${inputIds.SetHidden}_${key}`]?.((val, relOutputs) => {
        item.visible = false;
        relOutputs[`${`${inputIds.SetHidden}_${key}`}Done`](val);
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
          {
            childrenInputs,
            formItems: data.items,
            name: key,
            useDynamicItems: data.useDynamicItems
          },
          'setValue',
          formData,
          isLast ? cb : void 0
        );
      });
    } else {
      cb();
    }
  };

  const setFieldsSourceValue = (val, cb?) => {
    const formData = objectFilter(val);
    if (Object.keys(formData).length > 0) {
      const length = Object.keys(formData).length - 1;
      Object.keys(formData).forEach((key, inx) => {
        const isLast = inx === length;
        setFieldSourceForInput(
          {
            childrenInputs,
            formItems: data.items,
            name: key,
            useDynamicItems: data.useDynamicItems
          },
          'setOptions',
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
            {
              childrenInputs,
              formItems: data.items,
              name: key,
              useDynamicItems: data.useDynamicItems
            },
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
        const input = getFromItemInputEvent(item, childrenInputs, {
          useDynamicItems: data.useDynamicItems
        });
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
    data.items.forEach((item, index) => {
      if (!nameList || nameList.includes(item.name)) {
        const input = getFromItemInputEvent(item, childrenInputs, {
          useDynamicItems: data.useDynamicItems
        });
        input?.setDisabled && input?.setDisabled();
      }
    });
  };

  const setEnabled = (nameList?: string[]) => {
    data.items.forEach((item, index) => {
      if (!nameList || nameList.includes(item.name)) {
        const input = getFromItemInputEvent(item, childrenInputs, {
          useDynamicItems: data.useDynamicItems
        });
        input?.setEnabled && input?.setEnabled();
      }
    });
  };

  const setIsEditable = (val, nameList?: string[]) => {
    data.items.forEach((item, index) => {
      if (!nameList || nameList.includes(item.name)) {
        const input = getFromItemInputEvent(item, childrenInputs, {
          useDynamicItems: data.useDynamicItems
        });
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
          const input = getFromItemInputEvent(item, childrenInputs, {
            useDynamicItems: data.useDynamicItems
          });

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
          const input = getFromItemInputEvent(item, childrenInputs, {
            useDynamicItems: data.useDynamicItems
          });

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
            let res = { ...params, ...values };
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

  const templateLable = () => {
    return (
      <>
        <div className={css.infoLabel} style={{ top: 0, left: 0 }}>
          模板
        </div>
        <div className={css.infoLabel} style={{ top: 0, right: 0 }}>
          模板
        </div>
        <div className={css.infoLabel} style={{ bottom: 0, left: 0 }}>
          模板
        </div>
        <div className={css.infoLabel} style={{ bottom: 0, right: 0 }}>
          模板
        </div>
      </>
    );
  };

  return (
    <div
      className={classnames(
        css.wrapper,
        adaptiveMobile && wrapperWidth <= 575 ? css.disableMobileWrapper + ' mobileWarrper' : ''
      )}
      ref={wrapperRef}
    >
      <Fragment>
        {!data.isFormItem ? (
          <Form
            className={`${css.form} ${slots['content'].size === 0 && env.edit && data.actions.visible
              ? css.empty
              : undefined}`
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
              dynamicEnableOrDisabledRef={dynamicEnableOrDisabledRef}
              submit={submitMethod}
            />
          </Form>
        ) : (
          <SlotContent env={env} slots={slots} data={data} childrenInputs={childrenInputs} />
        )}
        {data.useDynamicItems && !env.runtime && templateLable()}
      </Fragment>
    </div>
  );
}

/**
 * @description 获取表单项列表
 */
const getFormItems = (data: Data, childrenInputs) => {
  let formItems = data.items;
  const useDynamicItems = data.useDynamicItems;
  if (useDynamicItems) {
    if (data.items.length !== Object.keys(childrenInputs).length) {
      formItems = formItems.filter((item, index) => {
        if (item.comName) {
          return childrenInputs[item.name];
        }
        return childrenInputs[item.id];
      });
    }
    // 过滤隐藏表单项
    if (!data.submitHiddenFields) {
      formItems = formItems.filter((item) => item.visible);
    }
    return formItems;
  }
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

const setValuesForInput = (
  { childrenInputs, formItems, name, useDynamicItems },
  inputId,
  values,
  cb?
) => {
  const item = formItems.find((item) => item.name === name);
  const inputDoneId = inputId + 'Done';
  if (item) {
    const input = getFromItemInputEvent(item, childrenInputs, { useDynamicItems });

    if (input) {
      if (isObject(values[name])) {
        if (input[inputId]) {
          input?.[inputId]?.({ ...values[name] })[inputDoneId]?.((val) => {
            cb?.();
          });
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

const setFieldSourceForInput = (
  { childrenInputs, formItems, name, useDynamicItems },
  inputId,
  values,
  cb?
) => {
  const item = formItems.find((item) => item.name === name);
  const inputDoneId = inputId + 'Done';
  let optionalId = ['setSource'];
  if (item) {
    const input = getFromItemInputEvent(item, childrenInputs, { useDynamicItems });

    if (input) {
      if (isObject(values[name]) || isArray(values[name])) {
        let flag = false;
        if (input[inputId]) {
          const a = input[inputId](values[name]);
          a?.[inputDoneId]?.((val) => {
            cb?.();
          });
        }
        optionalId.forEach((tryId) => {
          if (input[tryId]) {
            const a = input[tryId](values[name]);
            flag = true;
            a?.[tryId]?.((val) => {
              cb?.();
            });
          }
        });
      } else {
        input[inputId] &&
          input[inputId](values[name])[inputDoneId]?.((val) => {
            cb?.();
          });
      }
    }
  }
};

const getFromItemInputEvent = (
  formItem,
  childrenInputs,
  options?: { useDynamicItems?: boolean }
) => {
  let input;
  if (options?.useDynamicItems) {
    input = childrenInputs[formItem.name];
    return input;
  }

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
