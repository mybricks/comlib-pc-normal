import React, { useEffect, useMemo, useCallback, useLayoutEffect, Fragment, useState } from 'react';
import { Form, Button, Row, Col } from 'antd';
import { Data, FormControlProps, FormControlInputId } from './types';

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, env, outputs, inputs, slots, _inputs } = props;
  const [formRef] = Form.useForm();

  const childrenInputs = useMemo<{
    [id: string]: { [key in FormControlInputId]: (item?: any) => {} };
  }>(() => {
    return {};
  }, [env.edit]);

  useLayoutEffect(() => {
    inputs['setFieldsValue']((val) => {
      setFieldsValue(val);
    });

    inputs['initial']((val) => {
      setFieldsValue(val);
      slots['content'].inputs['onInitial']({ values: val });
    });

    inputs['resetFields']((val, outputRels) => {
      formRef.resetFields();
      outputRels['onResetFinish']();
    });

    inputs['submit']((val, outputRels) => {
      submit(outputRels);
    });

    // For 表单项私有1
    inputs['validate']((val, outputRels) => {
      validate().then((r) => {
        outputRels['returnValidate']({
          validateStatus: 'success'
        });
      });
    });

    inputs['getValue']((val, outputRels) => {
      getValue().then((v) => {
        console.log('getValue', v);
        outputRels['returnValue'](v);
      });
    });

    inputs['setValue']((val) => {
      setFieldsValue(val);
    });
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

  const validate = useCallback(() => {
    return new Promise((resolve, reject) => {
      Promise.all(
        data.items.map((item) => {
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

              console.log(item, value, key);
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
                  name: item.name,
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
              console.log(valItem);
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
    validate()
      .then(() => {
        getValue().then((values) => {
          console.log('提交数据', values, outputRels);
          if (outputRels) {
            outputRels['onFinish'](values);
          } else {
            outputs['onFinish'](values);
          }
        });
      })
      .catch((e) => {
        console.log('校验失败', e);
      });
  };

  const content = useCallback((props?: { field }) => {
    return slots['content'].render({
      wrap(comAray: { id; jsx; def; inputs; outputs }[]) {
        const items = data.items;
        if (data.dataType === 'list') {
          console.log('items', items, comAray, props?.field);
        }

        if (comAray) {
          const jsx = comAray.map((com, idx) => {
            if (com) {
              let item = items.find((item) => item.id === com.id);

              childrenInputs[com.id] = com.inputs;

              return <FormItem com={com} item={item} key={com.id} field={props?.field} />;
            }

            return <div key={idx}>组件错误</div>;
          });

          return jsx;
        }
      },
      inputValues: {},
      key: props?.field.name
    });
  }, []);

  return (
    <Fragment>
      {!data.isFormItem ? (
        <Form form={formRef} layout={data.layout} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          {data.dataType === 'list' ? (
            <FormListItem
              content={content}
              slots={slots}
              env={env}
              isFormItem={data.isFormItem}
              data={data}
            />
          ) : (
            content()
          )}
          <Row style={{ flex: '1 1 100%' }} data-form-actions>
            <Col offset={8}>
              <Form.Item>
                <Button type='primary' onClick={() => submit()}>
                  提交
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ) : data.dataType === 'list' ? (
        <FormListItem
          content={content}
          slots={slots}
          env={env}
          isFormItem={data.isFormItem}
          data={data}
        />
      ) : (
        content()
      )}
    </Fragment>
  );
}

const FormListItem = ({ content, slots, env, isFormItem, data }) => {
  if (env.edit) {
    return content();
  }

  return (
    <Form.List name='item4'>
      {(fields, { add, remove }) => {
        console.log('fields', fields);
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

const FormItem = (props: { com; item; field }) => {
  const { com, item, field } = props;

  return (
    <Form.Item
      {...field}
      label={item?.label}
      name={field ? [field.name, item?.name] : item?.name}
      data-formitem={com.id}
      required={item?.required}
      validateStatus={item?.validateStatus}
      help={item?.help}
    >
      <JSXWrapper com={com} field={field} />
    </Form.Item>
  );
};

const JSXWrapper = (props: FormControlProps) => {
  const { com, value, onChange, field } = props;

  // useLayoutEffect(() => { // 初始化表单项值
  //   com.inputs?.setValue(value) // 需求区分 表单API行为触发 与 用户行为触发 => inputs or _inputs
  // }, [value])

  return com.jsx;
};
