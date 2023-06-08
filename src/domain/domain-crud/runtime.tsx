import React, { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Button, message, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import EmptySlot from './components/EmptySlot';
import styles from './runtime.less';
import { Data } from './type';
import queryData from './api/query';
import updateData from './api/update';
import createData from './api/create';
import deleteData from './api/delete';
import { flatterEntityField } from './editors';

interface OrderParams {
  fieldName: string;
  order: string;
}

export default function (props: RuntimeParams<Data>) {
  const { env, data, outputs, inputs, slots, createPortal } = props;
  const { projectId } = env;

  const domainContainerRef = useRef(null);

  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const tableInputs = useRef<{ [x: string]: any }>();
  const formInputs = useRef<{ [x: string]: any }>();
  const editModalFormInputs = useRef<{ [x: string]: any }>();
  const createModalFormInputs = useRef<{ [x: string]: any }>();

  const queryParamsRef = useRef({});
  const ordersParamsRef = useRef<OrderParams[]>([]);

  // const [pageNum, setPageNum] = useState(1);
  const [curRecordId, setCurRecordId] = useState();
  const abilitySet = data.domainModel?.query?.abilitySet;

  useEffect(() => {
    if (env.runtime) {
      inputs['openEditModal']((val) => {
        if (checkDomainModel(abilitySet, 'UPDATE')) {
          setIsEdit(true);
          setVisible(true);

          setCurRecordId(val.id);
          // console.log('getConnections', slots['editModalContent'].inputs['dataSource'].getConnections())
          editModalFormInputs.current?.setInitialValues(val);
          slots['editModalContent'].inputs['dataSource'](val);
        } else {
          message.warn('未支持编辑操作');
        }
      });

      inputs['openCreateModal']((val) => {
        if (checkDomainModel(abilitySet, 'INSERT')) {
          setIsEdit(false);
          setVisible(true);

          slots['createModalContent'].inputs['dataSource'](val);
        } else {
          message.warn('未支持新建操作');
        }
      });

      inputs['query']((val) => {
        // const { values, fieldsRules } = val;
        // const query = getQueryParams({ values, fieldsRules });

        // queryParamsRef.current = query;

        getListData(val, { pageNum: 1, pageSize: data.pageSize }, true);
      });

      inputs['pageChange']((val) => {
        // setPageNum(val.pageNum);
        getListData(queryParamsRef.current, { pageNum: val.pageNum, pageSize: data.pageSize });
      });

      inputs['sorterChange']((val) => {
        // todo
        const orderMap = {
          ascend: 'ASC',
          descend: 'DESC'
        };

        const curOrder = orderMap[val.order];

        let newOrder: OrderParams[] = ordersParamsRef.current;

        if (curOrder) {
          const item = newOrder.find((item) => item.fieldName === val.id);

          if (!item) {
            newOrder.push({
              fieldName: val.id,
              order: orderMap[val.order]
            });
          } else {
            newOrder = newOrder.map((item) => {
              if (item.fieldName === val.id) {
                item.order = orderMap[val.order];
              }
              return item;
            });
          }
        } else {
          newOrder = newOrder.filter((item) => item.fieldName !== val.id);
        }

        ordersParamsRef.current = [...newOrder];

        getListData(queryParamsRef.current, { pageNum: val.pageNum, pageSize: val.pageSize });
      });

      inputs['create']((val) => {
        if (checkDomainModel(abilitySet, 'INSERT')) {
          createData(env.callDomainModel, data.domainModel, { ...val }).then((r) => {
            message.success('创建成功');
            // setPageNum(1);
            getListData(queryParamsRef.current, { pageNum: 1, pageSize: data.pageSize });

            setVisible(false);
          });
        } else {
          message.warn('未支持新建操作');
        }
      });

      inputs['editById']((val) => {
        if (checkDomainModel(abilitySet, 'UPDATE')) {
          updateData(env.callDomainModel, data.domainModel, { id: curRecordId, ...val }).then(
            (r) => {
              message.success('更新成功');
              // setPageNum(1);
              getListData(queryParamsRef.current, { pageNum: 1, pageSize: data.pageSize });

              setVisible(false);
            }
          );
        } else {
          message.warn('未支持编辑操作');
        }
      });

      inputs['deleteById']((val) => {
        if (checkDomainModel(abilitySet, 'DELETE')) {
          deleteData(env.callDomainModel, data.domainModel, val.id).then((r) => {
            message.success('删除成功');
            // setPageNum(1);
            getListData(queryParamsRef.current, { pageNum: 1, pageSize: data.pageSize });
          });
        } else {
          message.warn('未支持删除操作');
        }
      });
    }
  }, [curRecordId, projectId]);

  useEffect(() => {
    if (env.runtime) {
      if (!data.domainModel) {
        return;
      }

      if (data.isImmediate) {
        formInputs.current?.submit().onFinish((val) => {
          getListData(val, { pageNum: 1, pageSize: data.pageSize }, true);
        });
      }
    }
  }, []);

  useEffect(() => {
    if (env.edit) {
      if (data.createModalOpen) {
        setIsEdit(false);
      }

      if (data.editModalOpen) {
        setIsEdit(true);
      }
    }
  }, [data.createModalOpen, data.editModalOpen]);

  const onOkMethod = useCallback(() => {
    if (env.runtime) {
      if (isEdit) {
        if (outputs['onEditConfirm'].getConnections().length === 0) {
          editModalFormInputs.current?.submit().onFinish((val) => {
            updateData(env.callDomainModel, data.domainModel, { id: curRecordId, ...val })
              .then((r) => {
                message.success('更新成功');
                // setPageNum(1);
                getListData(queryParamsRef.current, { pageNum: 1, pageSize: data.pageSize });

                setVisible(false);
              })
              .catch((e) => {
                message.error(e);
              });
          });
        } else {
          outputs['onEditConfirm']();
        }
      } else {
        if (outputs['onCreateConfirm'].getConnections().length === 0) {
          createModalFormInputs.current?.submit().onFinish((val) => {
            createData(env.callDomainModel, data.domainModel, { ...val })
              .then((r) => {
                message.success('创建成功');
                // setPageNum(1);
                getListData(queryParamsRef.current, { pageNum: 1, pageSize: data.pageSize });
                createModalFormInputs.current?.resetFields().onResetFinish(() => {});

                setVisible(false);
              })
              .catch((e) => {
                message.error(e);
              });
          });
        } else {
          outputs['onCreateConfirm']();
        }
      }
    }
  }, [isEdit]);

  const onCancelMethod = useCallback(() => {
    if (env.runtime) {
      if (isEdit) {
        outputs['onCancelForEditModal']();
      } else {
        if (outputs['onCancelForCreateModal'].getConnections().length === 0) {
          createModalFormInputs.current?.resetFields().onResetFinish(() => {});
        } else {
          outputs['onCancelForCreateModal']();
        }
      }
      setVisible(false);
    }
  }, [isEdit]);

  const getListData = (params, pageParams, isSubmit?: boolean) => {
    tableInputs?.current?.startLoading?.();

    let query = params;
    const ordersParams = ordersParamsRef.current;

    if (data.domainModel.type === 'domain' && isSubmit) {
      query = getQueryParamsForDomain(params);
    }

    queryParamsRef.current = query;

    console.log('queryParams', query);
    console.log('pageParams', pageParams);
    console.log('ordersParams', ordersParams);

    queryData(
      env.callDomainModel,
      data.domainModel,
      {
        // serviceId: data.entity?.id,
        // fileId: data.domainFileId,
        fields: flatterEntityField(data.domainModel?.query?.entity).map((item) => ({
          name: item.label
        }))
        // projectId
      },
      {
        query,
        pageParams: {
          pageNum: pageParams.pageNum,
          pageSize: pageParams.pageSize
        },
        ordersParams
      }
    )
      .then((r) => {
        tableInputs?.current?.dataSource?.({
          dataSource: r.dataSource,
          total: r.total
        });

        tableInputs?.current?.endLoading?.();
      })
      .catch((e) => {
        message.error(e);
      });
  };

  const onCreate = () => {
    if (checkDomainModel(abilitySet, 'INSERT')) {
      setIsEdit(false);
      setVisible(true);
      // slots['createModalContent'].inputs['dataSource']();
    } else {
      message.warn('未支持新建操作');
    }
  };

  return (
    <div className={styles.domainContainer} ref={domainContainerRef}>
      {data.domainModel ? (
        <>
          <div className={styles.queryContent}>
            {slots['queryContent'].size === 0 && env.edit ? (
              <EmptySlot slot={slots['queryContent']?.render()} description="请拖拽组件到查询区" />
            ) : (
              slots['queryContent']?.render({
                wrap(comAray: { id; name; jsx; def; inputs; outputs; style }[]) {
                  const jsx = comAray?.map((com, idx) => {
                    formInputs.current = com.inputs;

                    return com.jsx;
                  });

                  return jsx;
                },
                outputs: {
                  onFinish(v) {
                    console.log('拦截查询', v);
                  },
                  onClickSubmit(v) {
                    getListData(v, { pageNum: 1, pageSize: data.pageSize });
                  }
                }
              })
            )}
          </div>
          <div className={styles.actionsContent}>
            {data.actions.useSlot ? (
              slots['actionsContent'].size === 0 && env.edit ? (
                <EmptySlot
                  slot={slots['actionsContent']?.render()}
                  description="请拖拽组件到操作区"
                />
              ) : (
                slots['actionsContent']?.render()
              )
            ) : (
              data.actions.items.map((item) => {
                return (
                  <Button
                    key={item.key}
                    type={item.type}
                    icon={<PlusOutlined />}
                    onClick={onCreate}
                  >
                    {item.title}
                  </Button>
                );
              })
            )}
          </div>
          <div className={styles.tableContent}>
            {slots['tableContent'].size === 0 && env.edit ? (
              <EmptySlot
                slot={slots['tableContent']?.render()}
                description="请拖拽组件到列表展示区"
              />
            ) : (
              slots['tableContent']?.render({
                wrap(comAray: { id; name; jsx; def; inputs; outputs; style }[]) {
                  const jsx = comAray?.map((com, idx) => {
                    tableInputs.current = com.inputs;
                    return com.jsx;
                  });

                  return jsx;
                },
                outputs: {
                  pageChange(val) {
                    // setPageNum(val.pageNum);
                    getListData(queryParamsRef.current, {
                      pageNum: val.pageNum,
                      pageSize: data.pageSize
                    });
                  }
                }
              })
            )}
          </div>
        </>
      ) : (
        <div className={styles.empty}>
          <Empty description="请选择一个领域模型实体" />
        </div>
      )}

      <Modal
        title={isEdit ? '编辑' : '新建'}
        visible={env.edit ? data.createModalOpen || data.editModalOpen : visible}
        getContainer={env.edit ? domainContainerRef.current : env.canvasElement}
        okText="确认"
        cancelText="取消"
        onOk={onOkMethod}
        onCancel={onCancelMethod}
        footer={[
          <Button
            data-actions-id={isEdit ? 'onCancelForEdit' : 'onCancelForCreate'}
            key="cancel"
            onClick={onCancelMethod}
          >
            取消
          </Button>,
          <Button
            data-actions-id={isEdit ? 'onOkForEdit' : 'onOkForCreate'}
            key="ok"
            type="primary"
            onClick={onOkMethod}
          >
            确认
          </Button>
        ]}
      >
        {isEdit
          ? checkDomainModel(abilitySet, 'UPDATE') && (
              <EditModalContent slots={slots} editModalFormInputs={editModalFormInputs} />
            )
          : checkDomainModel(abilitySet, 'INSERT') && (
              <CreateModalContent slots={slots} createModalFormInputs={createModalFormInputs} />
            )}
      </Modal>
    </div>
  );
}

const EditModalContent = (props) => {
  const { slots, editModalFormInputs } = props;

  return (
    <div>
      {slots['editModalContent'].render({
        wrap(comAray: { id; name; jsx; def; inputs; outputs; style }[]) {
          const jsx = comAray?.map((com, idx) => {
            editModalFormInputs.current = com.inputs;

            return com.jsx;
          });

          return jsx;
        }
      })}
    </div>
  );
};

const CreateModalContent = (props) => {
  const { slots, createModalFormInputs } = props;

  return (
    <div>
      {slots['createModalContent'].render({
        wrap(comAray: { id; name; jsx; def; inputs; outputs; style }[]) {
          const jsx = comAray?.map((com, idx) => {
            createModalFormInputs.current = com.inputs;

            return com.jsx;
          });

          return jsx;
        }
      })}
    </div>
  );
};

function getQueryParamsForDomain(val) {
  const { values, fieldsRules } = val;
  const query = {};

  Object.keys(values).forEach((key) => {
    let value = values[key];

    if (typeof value === 'string') {
      value = value.trim();
      value = value ? value : undefined;
    }
    query[key] = {
      operator: fieldsRules[key]?.operator || 'LIKE',
      value
    };
  });

  return query;
}

function checkDomainModel(abilitySet, type) {
  return abilitySet?.includes(type);
}
