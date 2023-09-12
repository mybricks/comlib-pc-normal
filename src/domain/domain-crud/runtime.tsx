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
import { createOutputCbIfNoConnect } from '../../utils/io';
import { OutputIds } from './constants';

interface OrderParams {
  fieldName: string;
  order: string;
}

export default function (props: RuntimeParams<Data>) {
  const { env, data, outputs, inputs, slots, createPortal } = props;

  const domainContainerRef = useRef(null);

  // const [visible, setVisible] = useState(false);
  // const [isEdit, setIsEdit] = useState(false);
  const tableInputs = useRef<{ [x: string]: any }>();
  const tableOutputs = useRef<{ [x: string]: any }>();
  const formInputs = useRef<{ [x: string]: any }>();
  const formOutputs = useRef<{ [x: string]: any }>();
  // const editModalFormInputs = useRef<{ [x: string]: any }>();
  // const createModalFormInputs = useRef<{ [x: string]: any }>();

  const pageNumRef = useRef(1);
  const queryParamsRef = useRef({});
  const ordersParamsRef = useRef<OrderParams[]>([]);

  // const [pageNum, setPageNum] = useState(1);
  // const [curRecordId, setCurRecordId] = useState();
  const abilitySet = data.domainModel?.query?.abilitySet;

  // console.log(data.domainModel)

  useEffect(() => {
    if (env.runtime) {
      // inputs['openEditModal']((val) => {
      //   if (checkDomainModel(abilitySet, 'UPDATE')) {
      //     setIsEdit(true);
      //     setVisible(true);
      //     setCurRecordId(val.id);
      //     // console.log('getConnections', slots['editModalContent'].inputs['dataSource'].getConnections())

      //     // if (slots['editModalContent'].inputs['dataSource'].getConnections().length === 0) {
      //     //   console.log(editModalFormInputs.current)
      //     //   editModalFormInputs.current?.setInitialValues(val);
      //     // } else {
      //     //   slots['editModalContent'].inputs['dataSource'](val);
      //     // }
      //     slots['editModalContent'].inputs['dataSource'](val);
      //   } else {
      //     message.warn('未支持编辑操作');
      //   }
      // });

      // inputs['openCreateModal']((val) => {
      //   if (checkDomainModel(abilitySet, 'INSERT')) {
      //     setIsEdit(false);
      //     setVisible(true);

      //     slots['createModalContent'].inputs['dataSource'](val);
      //   } else {
      //     message.warn('未支持新建操作');
      //   }
      // });

      inputs['query']((val, relOutputs) => {
        pageNumRef.current = 1;
        getListData(val, { pageNum: 1, pageSize: data.pageSize }, true, relOutputs);
      });

      inputs['pageChange']((val, relOutputs) => {
        pageNumRef.current = val.pageNum;
        getListData(
          queryParamsRef.current,
          { pageNum: val.pageNum, pageSize: data.pageSize },
          false,
          relOutputs
        );
      });

      // inputs['sorterChange']((val) => {
      //   // todo
      //   const orderMap = {
      //     ascend: 'ASC',
      //     descend: 'DESC'
      //   };

      //   const curOrder = orderMap[val.order];

      //   let newOrder: OrderParams[] = ordersParamsRef.current;

      //   if (curOrder) {
      //     const item = newOrder.find((item) => item.fieldName === val.id);

      //     if (!item) {
      //       newOrder.push({
      //         fieldName: val.id,
      //         order: orderMap[val.order]
      //       });
      //     } else {
      //       newOrder = newOrder.map((item) => {
      //         if (item.fieldName === val.id) {
      //           item.order = orderMap[val.order];
      //         }
      //         return item;
      //       });
      //     }
      //   } else {
      //     newOrder = newOrder.filter((item) => item.fieldName !== val.id);
      //   }

      //   ordersParamsRef.current = [...newOrder];

      //   getListData(queryParamsRef.current, { pageNum: val.pageNum, pageSize: val.pageSize });
      // });

      inputs['create']((val, relOutputs) => {
        if (checkDomainModel(abilitySet, 'INSERT')) {
          createData(env.callDomainModel, data.domainModel, { ...val })
            .then((r) => {
              relOutputs[OutputIds.INSERT.THEN](r?.response);
              message.success('创建成功');
              getListData(queryParamsRef.current, {
                pageNum: pageNumRef.current,
                pageSize: data.pageSize
              });
            })
            .catch((msg) => {
              relOutputs[OutputIds.INSERT.CATCH](msg);
              message.error(msg);
            });
        } else {
          message.warn('未支持新建操作');
        }
      });

      inputs['editById']((val, relOutputs) => {
        // todo 需要感知主键的存在
        if (checkDomainModel(abilitySet, 'UPDATE')) {
          updateData(env.callDomainModel, data.domainModel, { ...val })
            .then((r) => {
              message.success('更新成功');
              relOutputs[OutputIds.EDIT.THEN](r?.response);
              getListData(queryParamsRef.current, {
                pageNum: pageNumRef.current,
                pageSize: data.pageSize
              });
            })
            .catch((msg) => {
              relOutputs[OutputIds.EDIT.CATCH](msg);
              message.error(msg);
            });
        } else {
          message.warn('未支持编辑操作');
        }
      });

      inputs['deleteById']((val, relOutputs) => {
        if (checkDomainModel(abilitySet, 'DELETE')) {
          deleteData(env.callDomainModel, data.domainModel, { ...val })
            .then((r) => {
              message.success('删除成功');
              relOutputs[OutputIds.DELETE.THEN](r?.response);
              getListData(queryParamsRef.current, {
                pageNum: pageNumRef.current,
                pageSize: data.pageSize
              });
            })
            .catch((msg) => {
              relOutputs[OutputIds.DELETE.CATCH](msg);
              message.error(msg);
            });
        } else {
          message.warn('未支持删除操作');
        }
      });
    }
  }, []);

  useEffect(() => {
    if (env.runtime) {
      if (!data.domainModel) {
        return;
      }

      if (data.isImmediate) {
        if (formInputs.current) {
          // 存在没有表单的情况
          formInputs.current?.submit().onFinish((val) => {
            getListData(val, { pageNum: 1, pageSize: data.pageSize }, true);
          });
        } else {
          getListData({}, { pageNum: 1, pageSize: data.pageSize }, true);
        }
      }
    }
  }, []);

  // useEffect(() => {
  //   if (env.edit) {
  //     if (data.createModalOpen) {
  //       setIsEdit(false);
  //     }

  //     if (data.editModalOpen) {
  //       setIsEdit(true);
  //     }
  //   }
  // }, [data.createModalOpen, data.editModalOpen]);

  // const onOkMethod = useCallback(() => {
  //   if (env.runtime) {
  //     if (isEdit) {
  //       if (outputs['onEditConfirm'].getConnections().length === 0) {
  //         editModalFormInputs.current?.submit().onFinish((val) => {
  //           updateData(env.callDomainModel, data.domainModel, { id: curRecordId, ...val })
  //             .then((r) => {
  //               message.success('更新成功');
  //               getListData(queryParamsRef.current, { pageNum: 1, pageSize: data.pageSize });

  //               setVisible(false);
  //             })
  //             .catch((e) => {
  //               message.error(e);
  //             });
  //         });
  //       } else {
  //         outputs['onEditConfirm']();
  //       }
  //     } else {
  //       if (outputs['onCreateConfirm'].getConnections().length === 0) {
  //         createModalFormInputs.current?.submit().onFinish((val) => {
  //           createData(env.callDomainModel, data.domainModel, { ...val })
  //             .then((r) => {
  //               message.success('创建成功');
  //               // setPageNum(1);
  //               getListData(queryParamsRef.current, { pageNum: 1, pageSize: data.pageSize });
  //               createModalFormInputs.current?.resetFields().onResetFinish(() => {});

  //               setVisible(false);
  //             })
  //             .catch((e) => {
  //               message.error(e);
  //             });
  //         });
  //       } else {
  //         outputs['onCreateConfirm']();
  //       }
  //     }
  //   }
  // }, [isEdit]);

  // const onCancelMethod = useCallback(() => {
  //   if (env.runtime) {
  //     if (isEdit) {
  //       outputs['onCancelForEditModal']();
  //     } else {
  //       if (outputs['onCancelForCreateModal'].getConnections().length === 0) {
  //         createModalFormInputs.current?.resetFields().onResetFinish(() => {});
  //       } else {
  //         outputs['onCancelForCreateModal']();
  //       }
  //     }
  //     setVisible(false);
  //   }
  // }, [isEdit]);

  const onActionClick = useCallback((item) => {
    if (env.runtime) {
      if (item.key === 'submit') {
        formInputs.current?.submit().onFinish((val) => {
          pageNumRef.current = 1;
          getListData(val, { pageNum: 1, pageSize: data.pageSize }, true);
        });
      }
    }
  }, []);

  const getListData = (params, pageParams, isSubmit?: boolean, relOutputs?) => {
    return new Promise((resolve, reject) => {
      tableInputs?.current?.startLoading?.();

      let query = params;
      const ordersParams = ordersParamsRef.current;

      if (data.domainModel.type === 'domain' && isSubmit) {
        query = getQueryParamsForDomain(params);
      }

      queryParamsRef.current = query;

      const usePagination = !!data.domainModel?.query?.abilitySet?.includes('PAGE');

      queryData(
        env.callDomainModel,
        data.domainModel,
        {
          fields: flatterEntityField(data.domainModel?.query?.entity).map((item) => ({
            name: item.label
          }))
        },
        {
          query,
          pageParams: {
            pageNum: pageParams.pageNum,
            pageSize: pageParams.pageSize,
            usePagination
          },
          ordersParams: ordersParams.length ? ordersParams : [{ fieldName: 'id', order: 'DESC' }]
        }
      )
        .then((r: any) => {
          let dataSource = usePagination
            ? {
                dataSource: r.dataSource,
                total: r.total,
                pageNum: pageParams.pageNum
              }
            : r.dataSource;

          tableInputs?.current?.['dataSource']?.(dataSource);
          relOutputs &&
            (isSubmit
              ? relOutputs[OutputIds.QUERY.THEN](dataSource)
              : relOutputs[OutputIds.PAGE_CHANGE.THEN](dataSource));
          resolve(dataSource);
        })
        .catch((e) => {
          message.error(e);
          relOutputs &&
            (isSubmit
              ? relOutputs[OutputIds.QUERY.CATCH](e)
              : relOutputs[OutputIds.PAGE_CHANGE.CATCH](e));
          reject(e);
        })
        .finally(() => {
          tableInputs?.current?.['endLoading']?.();
        });
    });
  };

  // const onCreate = () => {
  //   if (checkDomainModel(abilitySet, 'INSERT')) {
  //     setIsEdit(false);
  //     setVisible(true);
  //     // slots['createModalContent'].inputs['dataSource']();
  //   } else {
  //     message.warn('未支持新建操作');
  //   }
  // };

  return (
    <div className={styles.domainContainer} ref={domainContainerRef}>
      {data.domainModel ? (
        <>
          {(typeof data?.queryContent?.visible === 'undefined'
            ? true
            : data?.queryContent?.visible) && (
            <QueryContent
              slots={slots}
              data={data}
              env={env}
              formInputs={formInputs}
              formOutputs={formOutputs}
              getListData={getListData}
              onActionClick={onActionClick}
            />
          )}
          <ActionsContent env={env} actions={data.actions} slots={slots} />
          {/* {env.edit ? (
            <ActionsContent
              env={env}
              actions={data.actions}
              slots={slots}
              abilitySet={abilitySet}
              onCreate={onCreate}
            />
          ) : (
            checkDomainModel(abilitySet, 'INSERT') && (
              <ActionsContent
                env={env}
                actions={data.actions}
                slots={slots}
                abilitySet={abilitySet}
                onCreate={onCreate}
              />
            )
          )} */}
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
                    tableOutputs.current = com.outputs;
                    return com.jsx;
                  });

                  return jsx;
                },
                outputs: {
                  pageChange: createOutputCbIfNoConnect({
                    eventName: 'pageChange',
                    getOutputs: () => tableOutputs.current,
                    cb: (val) => {
                      pageNumRef.current = val.pageNum;
                      getListData(queryParamsRef.current, {
                        pageNum: val.pageNum,
                        pageSize: data.pageSize
                      });
                    }
                  })
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

      {/* <Modal
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
              <EditModalContent slots={slots} editModalFormInputs={editModalFormInputs} env={env} />
            )
          : checkDomainModel(abilitySet, 'INSERT') && (
              <CreateModalContent
                slots={slots}
                createModalFormInputs={createModalFormInputs}
                env={env}
              />
            )}
      </Modal> */}
    </div>
  );
}

const QueryContent = (props) => {
  const { formInputs, formOutputs, slots, env, data, getListData, onActionClick } = props;

  return (
    <>
      {slots['queryContent'].size === 0 && env.edit ? (
        <div style={{ position: 'relative' }}>
          <EmptySlot slot={slots['queryContent']?.render()} description="请拖拽组件到查询区" />
        </div>
      ) : (
        slots['queryContent'].size !== 0 && (
          <div className={styles.queryContent}>
            <div className={styles.queryContentLeft}>
              {slots['queryContent']?.render({
                wrap(comAray: { id; name; jsx; def; inputs; outputs; style }[]) {
                  const jsx = comAray?.map((com, idx) => {
                    formInputs.current = com.inputs;
                    formOutputs.current = com.outputs;

                    return com.jsx;
                  });

                  return jsx;
                },
                outputs: {
                  onClickSubmit: createOutputCbIfNoConnect({
                    eventName: 'onClickSubmit',
                    getOutputs: () => formOutputs.current,
                    cb: (val) => {
                      getListData(val, { pageNum: 1, pageSize: data.pageSize }, true);
                    }
                  })
                }
              })}
            </div>
            <div className={styles.queryContentRight}>
              {data.queryActions.items.map((item) => {
                return (
                  <Button
                    data-query-action={item.key}
                    type={item.type}
                    key={item.key}
                    loading={item.loading}
                    onClick={() => onActionClick(item)}
                  >
                    {item.title}
                  </Button>
                );
              })}
            </div>
          </div>
        )
      )}
    </>
  );
};

const ActionsContent = (props) => {
  const { env, actions, slots, abilitySet, onActionClick } = props;

  return (
    <>
      {actions.useSlot &&
        (slots['actionsContent'].size === 0 && env.edit ? (
          <div className={styles.actionsContent}>
            <EmptySlot
              slot={slots['actionsContent']?.render()}
              description="请拖拽组件到操作区（新建按钮或者其他操作）"
            />
          </div>
        ) : (
          slots['actionsContent'].size > 0 && (
            <div className={styles.actionsContent}>{slots['actionsContent']?.render()}</div>
          )
        ))}
    </>
    // <div className={styles.actionsContent}>
    //   {actions.useSlot ? (
    //     slots['actionsContent'].size === 0 && env.edit ? (
    //       <EmptySlot slot={slots['actionsContent']?.render()} description="请拖拽组件到操作区" />
    //     ) : (
    //       slots['actionsContent']?.render()
    //     )
    //   ) : (
    //     checkDomainModel(abilitySet, 'INSERT') &&
    //     actions.items.map((item) => {
    //       return (
    //         <Button key={item.key} type={item.type} icon={<PlusOutlined />} onClick={() => onActionClick(item)}>
    //           {item.title}
    //         </Button>
    //       );
    //     })
    //   )}
    // </div>
  );
};

// const EditModalContent = (props) => {
//   const { slots, editModalFormInputs, env } = props;

//   return (
//     <div style={{ position: 'relative' }}>
//       {slots['editModalContent'].size === 0 && env.edit ? (
//         <EmptySlot
//           slot={slots['editModalContent']?.render()}
//           description="请拖拽组件到编辑对话框内"
//         />
//       ) : (
//         slots['editModalContent'].render({
//           wrap(comAray: { id; name; jsx; def; inputs; outputs; style }[]) {
//             const jsx = comAray?.map((com, idx) => {
//               editModalFormInputs.current = com.inputs;

//               return com.jsx;
//             });

//             return jsx;
//           }
//         })
//       )}
//     </div>
//   );
// };

// const CreateModalContent = (props) => {
//   const { slots, createModalFormInputs, env } = props;

//   return (
//     <div style={{ position: 'relative' }}>
//       {slots['createModalContent'].size === 0 && env.edit ? (
//         <EmptySlot
//           slot={slots['createModalContent']?.render()}
//           description="请拖拽组件到新建对话框内"
//         />
//       ) : (
//         slots['createModalContent'].render({
//           wrap(comAray: { id; name; jsx; def; inputs; outputs; style }[]) {
//             const jsx = comAray?.map((com, idx) => {
//               createModalFormInputs.current = com.inputs;

//               return com.jsx;
//             });

//             return jsx;
//           }
//         })
//       )}
//     </div>
//   );
// };

function getQueryParamsForDomain(val) {
  const { values, fieldsRules } = val;
  const query = {};

  if (values) {
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
  }

  return query;
}

function checkDomainModel(abilitySet, type) {
  return abilitySet?.includes(type);
}
