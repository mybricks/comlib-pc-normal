import React, { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
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

  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const tableInputs = useRef<{ [x: string]: any }>({});
  const formInputs = useRef<{ [x: string]: any }>({});
  const editModalFormInputs = useRef<{ [x: string]: any }>({});
  const createModalFormInputs = useRef<{ [x: string]: any }>({});

  const queryParamsRef = useRef({});
  const ordersParamsRef = useRef<OrderParams[]>([]);

  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  // const [curRecordId, setCurRecordId] = useState()

  // console.log(data.entity);

  if (env.runtime) {
    // slots['queryContent']._inputs['onSubmit'](({ name, values }) => {
    //   console.log('表单提交', values, data)
    //   getListData(values)
    // })

    slots['tableContent']._inputs['onPageChange'](({ name, value }) => {
      const { pageNum, pageSize } = value;
      // console.log(pageNum, pageSize)
    });

    slots['tableContent']._inputs['onSorterChange'](({ name, value }) => {
      const { id, order } = value;
      // console.log(value)
    });
  }

  useEffect(() => {
    if (env.runtime) {
      inputs['openEditModal']((val) => {
        console.log(val);
        setIsEdit(true);
        setVisible(true);
        slots['editModalContent'].inputs['dataSource'](val);
      });

      inputs['openCreateModal']((val) => {
        setIsEdit(false);
        setVisible(true);
        slots['createModalContent'].inputs['dataSource'](val);
      });

      inputs['query']((val) => {
        console.log('触发查询', val);
        queryParamsRef.current = val;

        getListData(val, { pageNum: 1, pageSize });
      });

      inputs['pageChange']((val) => {
        setPageNum(val.pageNum);
        setPageSize(val.pageSize);
        getListData(queryParamsRef.current, { pageNum: val.pageNum, pageSize: val.pageSize });
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
        console.log('新建', val);
        createData(
          {
            serviceId: data.entity?.id,
            fileId: data.domainFileId
          },
          { ...val }
        ).then((r) => {
          message.success('创建成功');
          setPageNum(1);
          getListData(queryParamsRef.current, { pageNum: 1, pageSize });

          setVisible(false);
        });
      });

      inputs['editById']((val) => {
        console.log('编辑', val);
        updateData(
          {
            serviceId: data.entity?.id,
            fileId: data.domainFileId
          },
          { ...val }
        ).then((r) => {
          message.success('更新成功');
          setPageNum(1);
          getListData(queryParamsRef.current, { pageNum: 1, pageSize });

          setVisible(false);
        });
      });

      inputs['deleteById']((val) => {
        deleteData(
          {
            serviceId: data.entity?.id,
            fileId: data.domainFileId
          },
          val.id
        ).then((r) => {
          message.success('删除成功');
          setPageNum(1);
          getListData(queryParamsRef.current, { pageNum: 1, pageSize });
        });
      });
    }
  }, [pageNum, pageSize]);

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
    if (isEdit) {
      outputs['onEditConfirm']();
    } else {
      outputs['onCreateConfirm']();
    }
  }, [isEdit]);

  const onCancelMethod = useCallback(() => {
    if (isEdit) {
      outputs['onCancelForEditModal']();
    } else {
      outputs['onCancelForCreateModal']();
    }
    setVisible(false);
  }, [isEdit]);

  const getListData = (params, pageParams) => {
    tableInputs.current['startLoading']();

    const query = {};
    const ordersParams = ordersParamsRef.current;

    Object.keys(params).map((key) => {
      query[key] = {
        operator: 'LIKE', // LIKE、NOT LIKE、IN、NOT IN、=、<>
        value: params[key] ? params[key] : undefined
      };
    });
    // if (tableInputs.current?.getPageInfo) { // Todo 动态添加的 io ，无法感知到

    //   tableInputs.current?.getPageInfo().getPageInfo(v => {
    //     console.log(v)
    //   })
    // }

    console.log('pageParams', pageParams);
    console.log('ordersParams', ordersParams);

    queryData(
      {
        serviceId: data.entity?.id,
        fileId: data.domainFileId,
        fields: flatterEntityField(data.entity).map((item) => ({
          name: item.label
        }))
      },
      {
        query,
        pageParams: {
          pageNum: pageParams.pageNum,
          pageSize: pageParams.pageSize
        },
        ordersParams
      }
    ).then((r) => {
      console.log(r.dataSource);

      tableInputs.current['dataSource']({
        dataSource: r.dataSource,
        total: r.total
      });

      tableInputs.current['endLoading']();
    });
  };

  // console.log(env.canvasElement);

  return (
    <div className={styles.domainContainer}>
      <div className={styles.queryContent}>
        {slots['queryContent']?.render({
          wrap(comAray: { id; name; jsx; def; inputs; outputs; style }[]) {
            const jsx = comAray?.map((com, idx) => {
              formInputs.current = com.inputs;

              return com.jsx;
            });

            return jsx;
          }
        })}
      </div>
      <div className={styles.actionsContent}>
        {slots['actionsContent']?.render()}
        {/* <Button type="primary" icon={<PlusOutlined />} onClick={() => openCreateModal()}>新建</Button> */}
      </div>
      <div className={styles.tableContent}>
        {slots['tableContent']?.render({
          wrap(comAray: { id; name; jsx; def; inputs; outputs; style }[]) {
            const jsx = comAray?.map((com, idx) => {
              tableInputs.current = com.inputs;

              return com.jsx;
            });

            return jsx;
          }
        })}
      </div>

      <Modal
        title={isEdit ? '编辑' : '新建'}
        visible={env.edit ? data.createModalOpen || data.editModalOpen : visible}
        getContainer={env.canvasElement}
        okText="确认"
        cancelText="取消"
        onOk={onOkMethod}
        onCancel={onCancelMethod}
      >
        {isEdit ? (
          <EditModalContent slots={slots} editModalFormInputs={editModalFormInputs} />
        ) : (
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
