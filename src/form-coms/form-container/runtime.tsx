import React, { useEffect, useMemo, useCallback, useLayoutEffect, Fragment, useState } from 'react';
import { Form, Button, Row, Col } from 'antd';
import { Data, FormControlInputId } from './types';
import SlotContent from './SlotContent';
import { getLabelCol } from './utils';
import { slotInputIds, inputIds, outputIds } from './constants';

type FormControlInputRels = {
  validate: (val?: any) => {
    returnValidate: (val) => {};
  };
  getValue: (val?: any) => {
    returnValue: (val) => {};
  };
  [key: string]: (val?: any) => void;
};

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, env, outputs, inputs, slots, _inputs } = props;
  const [formRef] = Form.useForm();

  const childrenInputs = useMemo<{
    [id: string]: {
      [key in FormControlInputId]: FormControlInputRels[key];
    };
  }>(() => {
    return {};
  }, [env.edit]);

  useLayoutEffect(() => {
    inputs[inputIds.SET_FIELDS_VALUE]((val) => {
      resetFields();
      setFieldsValue(val);
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
      if (Object.prototype.toString.call(val) === '[object Object]') {
        submitMethod(outputIds.ON_MERGE_FINISH, outputRels, val);
      } else {
        submitMethod(outputIds.ON_MERGE_FINISH, outputRels);
      }
    });

    // For 表单项私有
    _inputs['validate']((val, outputRels) => {
      validate().then((r) => {
        outputRels['returnValidate']({
          validateStatus: 'success'
        });
      });
    });

    _inputs['getValue']((val, outputRels) => {
      getValue().then((v) => {
        outputRels['returnValue'](v);
      });
    });

    _inputs['setValue']((val) => {
      setFieldsValue(val);
    });

    // slots['content']._inputs['validateTrigger'](id=>{
    //   const item = data.items.find(item => item.id === id)

    //   console.log('validateTrigger', item)
    // });
  }, []);

  const setFieldsValue = (val) => {
    if (val) {
      Object.keys(val).forEach((key) => {
        const item = data.items.find((item) => item.name === key);
        if (item) {
          const input = childrenInputs[item.id];
          if (Object.prototype.toString.call(val[key]) === '[Object Object]') {
            input?.setValue({ ...val[key] });
          } else {
            input?.setValue(val[key]);
          }
        }
      });
    }
  };

  const resetFields = () => {
    data.items.forEach((item) => {
      const id = item.id;
      const input = childrenInputs[id];
      input?.resetValue();
    });
  };

  const validate = useCallback(() => {
    return new Promise((resolve, reject) => {
      Promise.all(
        data.items.map((item) => {
          // 隐藏的表单项，不再校验
          if (!item.visible) return { validateStatus: 'success' };

          const id = item.id;
          const input = childrenInputs[id];

          return new Promise((resolve, reject) => {
            input?.validate({ ...item }).returnValidate((validateInfo) => {
              //调用所有表单项的校验
              item.validateStatus = validateInfo?.validateStatus;
              item.help = validateInfo?.help;
              resolve(validateInfo);
            });
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
      Promise.all(
        data.items.map((item) => {
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
                /** 隐藏的表单项，不收集数据 **/
                if (item.visible) {
                  value = {
                    name: item.name,
                    value: val
                  };
                }

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
            values.forEach((item) => {
              rtn[item.name] = item.value;
            });
            resolve(rtn);
          }
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
        getValue().then((values: any) => {
          const res = { ...values, ...params };
          if (outputRels) {
            outputRels[outputId](res);
          } else {
            outputs[outputId](res);
          }
        });
      })
      .catch((e) => {
        console.log('校验失败', e);
      });
  };

  return (
    <Fragment>
      {!data.isFormItem ? (
        <Form
          form={formRef}
          layout={data.layout}
          labelCol={data.layout === 'horizontal' ? getLabelCol(data) : undefined}
          // wrapperCol={{ span: 16 }}
        >
          <SlotContent
            slots={slots}
            data={data}
            childrenInputs={childrenInputs}
            outputs={outputs}
            submit={submitMethod}
          />
        </Form>
      ) : (
        <SlotContent slots={slots} data={data} childrenInputs={childrenInputs} />
      )}
    </Fragment>
  );
}

/**
 * @description 列表类型表单容器，暂不开放
 */
const FormListItem = ({ content, slots, env, isFormItem, data }) => {
  if (env.edit) {
    return content();
  }

  return (
    <Form.List name="item4">
      {(fields, { add, remove }) => {
        data.fieldsLength = fields.length;

        return (
          <>
            {fields.map((field, index) => {
              return <div key={field.key}>{content({ field })}</div>;
            })}
            {isFormItem ? (
              <Button
                onClick={() => {
                  add();
                }}
              >
                添加
              </Button>
            ) : (
              <Row style={{ flex: '1 1 100%' }} data-form-actions>
                <Col offset={8}>
                  <Form.Item>
                    <Button
                      onClick={() => {
                        add();
                      }}
                    >
                      添加
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            )}
          </>
        );
      }}
    </Form.List>
  );
};
