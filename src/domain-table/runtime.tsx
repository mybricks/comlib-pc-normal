import React, { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Checkbox,
  Col,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Table,
  Upload
} from 'antd';
import moment from 'moment';
import { ColumnsType } from 'antd/es/table';
/** 设计器中 shadow dom 导致全局 config 失效，且由于 antd 组件的默认文案是英文，所以需要修改为中文 */
// import zhCN from 'antd/es/locale/zh_CN';
import DebounceSelect from './components/debouce-select';
import UserProfile from './components/user-profile';
import RenderColumn from './components/render-column';
import { RuleMap } from './rule';
import { ajax } from './util';
import { ComponentName, Data, DefaultOperatorMap, FieldBizType, ModalAction } from './constants';
import { Field } from './type';

import styles from './runtime.less';

const INIT_PAGE = 1;
const INIT_PAGE_SIZE = 20;
export default function ({ env, data }: RuntimeParams<Data>) {
  const { edit, runtime, projectId } = env;
  const debug = !!(runtime && runtime.debug);
  if (debug || runtime) {
    data.showActionModalForEdit = '';
  }
  // const currentCreatePortal = edit || debug ? createPortal : (a => a);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModalAction, setShowModalAction] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();
  const currentData = useRef<Record<string, unknown>>({});
  const containerRef = useRef(null);
  const domainContainerRef = useRef(null);
  const searchFormValue = useRef({});
  const [pageIndex, setPageIndex] = useState(INIT_PAGE);
  const [pageSize, setPageSize] = useState<number>(data.pagination?.pageSize || INIT_PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const baseFetchParams = useMemo(() => {
    return {
      serviceId: data.entity?.id,
      fileId: data.domainFileId,
      projectId: projectId || undefined
    };
  }, [data.entity, projectId, data.domainFileId]);
  const modalWidth = useRef(520);

  const handleData = useCallback(
    (query, pageInfo?: Record<string, unknown>) => {
      setLoading(true);
      const pageParams = pageInfo || { pageIndex, pageSize: edit ? 5 : pageSize };
      pageParams.pagination = data.pagination?.show;
      const primaryField = data.entity?.fieldAry.find((field) => field.isPrimaryKey);
      const orderFields = data.fieldAry
        .filter((field) => field.bizType !== FieldBizType.FRONT_CUSTOM && field.sorter)
        .map((field) => field.sorter);
      /** 已有按主键排序 */
      const hasPrimaryFieldOrder = orderFields.find((f) => f.fieldId === primaryField);

      ajax({
        params: {
          query,
          fields: [
            { name: 'id' },
            ...data.fieldAry
              .filter((field) => field.bizType !== FieldBizType.FRONT_CUSTOM)
              .map((f) => ({ name: f.name }))
          ],
          orders: [
            ...orderFields,
            hasPrimaryFieldOrder ? undefined : { fieldId: primaryField.id, order: 'DESC' }
          ].filter(Boolean),
          page: pageParams,
          action: 'SELECT'
        },
        ...baseFetchParams
      })
        .then((res) => {
          if (data.pagination.show) {
            setDataSource(res.list || []);
            setTotal(res.total || 0);
          } else {
            setDataSource(res || []);
          }
        })
        .finally(() => setLoading(false));
    },
    [data.fieldAry, data.pagination.show, data.entity, baseFetchParams, edit, pageIndex, pageSize]
  );

  const onDelete = useCallback(
    (id: number) => {
      Modal.confirm({
        title: '确认删除',
        onOk: () => {
          ajax(
            { params: { query: { id }, action: 'DELETE' }, ...baseFetchParams },
            { successTip: '删除成功', errorTip: '删除失败' }
          ).then(() => {
            handleData(searchFormValue.current);
          });
        }
      });
    },
    [handleData, baseFetchParams]
  );
  const onEdit = useCallback(
    (item: Record<string, unknown>) => {
      setShowModalAction(ModalAction.EDIT);
      currentData.current = item;
      const value = {};
      if (data.entity) {
        data.entity.fieldAry
          .filter(
            (field) =>
              field.bizType !== FieldBizType.MAPPING &&
              !field.isPrimaryKey &&
              !field.isPrivate &&
              !field.defaultValueWhenCreate
          )
          .forEach((field) => {
            if (field.bizType === FieldBizType.DATETIME && field.showFormat) {
              value[field.name] = item[field.name] ? moment(item[field.name] as any) : null;
            } else if (field.mapping?.entity) {
              value[field.name] = (item[field.name] as { id: number })?.id ?? null;
            } else {
              value[field.name] = item[field.name];
            }
          });

        createForm.setFieldsValue(value);
      }
    },
    [data.entity]
  );

  let scrollXWidth = 0;
  const columnWidthMap = {};
  const renderColumns: ColumnsType<any> = data.fieldAry
    ? data.fieldAry?.map((field) => {
        /** 提前读取值，防止不响应 */
        field.tableInfo?.ellipsis;

        const title =
          field.tableInfo?.label ||
          (field.mappingField ? `${field.name}.${field.mappingField.name}` : field.name);
        let parseWidth = parseInt(field.tableInfo?.width || '124px');
        if (Object.is(parseWidth, NaN) || parseWidth <= 0) {
          parseWidth = 124;
        }
        scrollXWidth += parseWidth;

        return field.bizType === FieldBizType.FRONT_CUSTOM
          ? {
              title: field.tableInfo?.label || field.name,
              key: field.id,
              align: field.tableInfo?.align || 'left',
              width: `${parseWidth}px`,
              render(_, data) {
                return (
                  <>
                    <Button
                      style={{ marginRight: '12px' }}
                      size="small"
                      onClick={() => onEdit(data)}
                    >
                      编辑
                    </Button>
                    <Button danger type="primary" size="small" onClick={() => onDelete(data.id)}>
                      删除
                    </Button>
                  </>
                );
              }
            }
          : {
              title: title,
              dataIndex: field.mappingField ? [field.name, field.mappingField.name] : field.name,
              key: title,
              align: field.tableInfo?.align || 'left',
              width: `${parseWidth}px`,
              render(value, data) {
                return (
                  <RenderColumn
                    columnKey={title}
                    columnWidthMap={columnWidthMap}
                    value={value}
                    item={data}
                    ellipsis={field.tableInfo?.ellipsis}
                    columnWidth={columnWidthMap[title]}
                  />
                );
              },
              sorter: field.tableInfo?.sort
            };
      })
    : [];

  useEffect(() => {
    if (!data.entity || !data.fieldAry?.length) {
      return;
    }
    handleData({});
  }, [data.entity, data.fieldAry, data.pagination.show]);

  const search = useCallback(() => {
    form
      .validateFields()
      .then((value) => {
        const curValue = {};

        Object.keys(value).forEach((key) => {
          const field = data.formFieldAry.find((field) => field.name === key);
          let item: Record<string, unknown> = {
            operator: field?.form?.operator ?? DefaultOperatorMap[field.form.formItem] ?? '=',
            value: value[key]
          };
          try {
            if (item.isAfter) {
              item.value = item.valueOf();
            }
          } catch {}

          curValue[key] = item;
        });

        setPageIndex(1);
        setPageSize(data.pagination?.pageSize || INIT_PAGE_SIZE);
        searchFormValue.current = curValue;
        handleData(curValue, {
          pageIndex: 1,
          pageSize: data.pagination?.pageSize || INIT_PAGE_SIZE
        });
      })
      .catch((_) => _);
  }, [handleData, data.formFieldAry, data.pagination?.pageSize]);

  const renderFormItemNode = useCallback(
    (
      field: Field,
      option: { placeholder?: string; onPressEnter?(): void; formItem?: ComponentName }
    ) => {
      let placeholder = option.placeholder ?? `请输入${field.name}`;
      const curFormItem = option.formItem || field.form.formItem;
      let item = <Input placeholder={placeholder} onPressEnter={option.onPressEnter} allowClear />;

      if (curFormItem === ComponentName.DATE_PICKER) {
        item = (
          <DatePicker
            style={{ width: '100%' }}
            showTime
            placeholder={option.placeholder ?? `请选择${field.name}`}
          />
        );
      } else if (curFormItem === ComponentName.USER_PROFILE) {
        item = <UserProfile />;
      } else if (curFormItem === ComponentName.TEXTAREA) {
        item = (
          <Input.TextArea
            placeholder={placeholder}
            onPressEnter={option.onPressEnter}
            rows={field.form.rows || 2}
            allowClear
          />
        );
      } else if (curFormItem === ComponentName.INPUT_NUMBER) {
        item = (
          <InputNumber
            style={{ width: '100%' }}
            onPressEnter={option.onPressEnter}
            placeholder={placeholder}
          />
        );
      } else if (curFormItem === ComponentName.SELECT) {
        item = (
          <Select
            placeholder={option.placeholder ?? `请选择${field.name}`}
            options={field.form?.options ?? []}
          />
        );
      } else if (field.mapping?.entity && curFormItem === ComponentName.DEBOUNCE_SELECT) {
        item = (
          <DebounceSelect
            placeholder={option.placeholder ?? '可输入关键词检索'}
            field={field}
            fetchParams={baseFetchParams}
          />
        );
      } else if (curFormItem === ComponentName.INPUT && field.bizType === FieldBizType.PHONE) {
        item = (
          <Input onPressEnter={option.onPressEnter} addonBefore="+86" placeholder={placeholder} />
        );
      } else if (curFormItem === ComponentName.IMAGE_UPLOAD) {
        item = <Upload />;
      } else if (curFormItem === ComponentName.RADIO) {
        item = <Radio.Group options={field.form?.options ?? []} />;
      } else if (curFormItem === ComponentName.CHECKBOX) {
        item = <Checkbox.Group options={field.form?.options ?? []} />;
      } else if (field.bizType === FieldBizType.APPEND_FILE) {
        item = <Upload />;
      }

      return item;
    },
    []
  );

  const renderSearchFormNode = () => {
    if (data.formFieldAry?.length) {
      return (
        <Form form={form} layout="inline" className={`${styles.form} search-form`}>
          {data.formFieldAry.map((field) => {
            let placeholder: string | undefined = undefined;
            let defaultValue = undefined;

            if (
              field.form.formItem === ComponentName.INPUT ||
              field.form.formItem === ComponentName.INPUT_NUMBER
            ) {
              placeholder = `可输入${field.name}检索`;
            } else if (field.form.formItem === ComponentName.SELECT) {
              placeholder = `可选择${field.name}检索`;
            } else if (
              [ComponentName.RADIO, ComponentName.CHECKBOX, ComponentName.SELECT].includes(
                field.form.formItem
              )
            ) {
              defaultValue = field.form?.options?.find((opt) => opt.checked)?.value;
            }

            return (
              <div className="ant-form-item-search" data-field-id={field.id}>
                <Form.Item
                  style={{ minWidth: '280px' }}
                  initialValue={defaultValue}
                  key={field.id}
                  name={field.name}
                  label={field.form?.label ?? field.name}
                >
                  {renderFormItemNode(field, { placeholder, onPressEnter: search })}
                </Form.Item>
              </div>
            );
          })}
          <Button type="primary" onClick={search}>
            查询
          </Button>
          <Button data-add-button="1" className={styles.addBtn} onClick={openCreateModal}>
            {data.addBtn?.title ?? '新增'}
          </Button>
        </Form>
      );
    }

    return (
      <div className={styles.operateRow}>
        <Button data-add-button="1" onClick={openCreateModal}>
          {data.addBtn?.title ?? '新增'}
        </Button>
      </div>
    );
  };
  const openCreateModal = useCallback(() => {
    setShowModalAction(ModalAction.CREATE);
    createForm.resetFields();
  }, []);
  const closeCreateModal = useCallback(() => {
    setShowModalAction('');
    data.showActionModalForEdit = '';
  }, []);
  const handleCreate = useCallback(() => {
    if (!data.entity) {
      return;
    }
    setCreateLoading(true);
    createForm
      .validateFields()
      .then((value) => {
        const curValue: Record<string, unknown> = {};

        Object.keys(value).forEach((key) => {
          let item = value[key];
          try {
            if (item.isAfter) {
              item = (item as any).valueOf();
            }
          } catch {}

          curValue[key] = item;
        });

        if (showModalAction === ModalAction.EDIT) {
          const fields = data.entity.fieldAry.filter(
            (field) =>
              [FieldBizType.SYS_USER_UPDATER].includes(field.bizType) &&
              !field.isPrimaryKey &&
              !field.isPrivate &&
              !field.defaultValueWhenCreate
          );

          /** 创建者默认读 window 上用户信息 */
          if (fields.length && window['LOGIN_USER_INFO']) {
            fields.forEach((field) => (curValue[field.name] = window['LOGIN_USER_INFO'].id));
          }

          curValue.id = currentData.current?.id;
        } else {
          const fields = data.entity.fieldAry.filter(
            (field) =>
              [FieldBizType.SYS_USER_CREATOR, FieldBizType.SYS_USER_UPDATER].includes(
                field.bizType
              ) &&
              !field.isPrimaryKey &&
              !field.isPrivate &&
              !field.defaultValueWhenCreate
          );

          /** 创建者默认读 window 上用户信息 */
          if (fields.length && window['LOGIN_USER_INFO']) {
            fields.forEach((field) => (curValue[field.name] = window['LOGIN_USER_INFO'].id));
          }
        }

        ajax({
          params: {
            fields:
              showModalAction === ModalAction.CREATE
                ? undefined
                : data.entity.fieldAry.filter(
                    (field) =>
                      ![
                        FieldBizType.MAPPING,
                        FieldBizType.SYS_USER_CREATOR,
                        FieldBizType.SYS_USER_UPDATER
                      ].includes(field.bizType) &&
                      !field.isPrimaryKey &&
                      !field.isPrivate &&
                      !field.defaultValueWhenCreate &&
                      !field.form.disabledForEdit
                  ),
            query: curValue,
            action: showModalAction === ModalAction.CREATE ? 'INSERT' : 'UPDATE'
          },
          ...baseFetchParams
        }).then(() => {
          setShowModalAction('');
          handleData(searchFormValue.current);
        });
      })
      .catch((error) => console.log('表单校验参数不合法', error))
      .finally(() => setCreateLoading(false));
  }, [showModalAction, data.entity, baseFetchParams]);
  const allowRenderCreateItem =
    data.entity?.fieldAry
      .filter(
        (field) =>
          field.bizType !== FieldBizType.MAPPING &&
          !field.isPrimaryKey &&
          !field.isPrivate &&
          !field.defaultValueWhenCreate
      )
      .filter((field) => {
        /** 这一行必须要，读取 form 的 disabledForEdit 值才能被收集到依赖，才能对应响应编辑项变化 */
        field.form.disabledForEdit;
        field.form.hiddenForCreate;
        field.form.hiddenForEdit;
        if (
          showModalAction === ModalAction.EDIT ||
          data.showActionModalForEdit === ModalAction.EDIT
        ) {
          /** 编辑时直接隐藏创建者对应的表单项 */
          if (field.bizType === FieldBizType.SYS_USER_CREATOR) {
            return false;
          }

          return !field.form.disabledForEdit;
        }

        return true;
      }) ?? [];
  /** 真实会显示的表单项，运行态会筛选掉配置隐藏属性的表单项 */
  const currentShowAllowRenderCreateItem = allowRenderCreateItem.filter((field) => {
    if (
      data.showActionModalForEdit === ModalAction.CREATE ||
      data.showActionModalForEdit === ModalAction.EDIT
    ) {
      return true;
    } else if (showModalAction === ModalAction.CREATE) {
      return !field.form.hiddenForCreate;
    } else if (showModalAction === ModalAction.EDIT) {
      return !field.form.hiddenForEdit;
    }

    return true;
  });
  modalWidth.current =
    !!showModalAction || (edit && data.showActionModalForEdit)
      ? currentShowAllowRenderCreateItem.length > 5
        ? 800
        : 520
      : modalWidth.current;
  const renderCreateFormNode = () => {
    if (data.entity) {
      return (
        <Row gutter={24}>
          {allowRenderCreateItem.map((field) => {
            let defaultValue = undefined;
            let formItem: ComponentName = field.form.formItem;
            const rules: any[] =
              field.form?.rules?.filter((r) => r.status).map((r) => RuleMap[r.key]?.(field, r)) ||
              [];

            if (
              [ComponentName.RADIO, ComponentName.CHECKBOX, ComponentName.SELECT].includes(
                field.form.formItem
              )
            ) {
              defaultValue = field.form?.options?.find((opt) => opt.checked)?.value;
            }
            const style: CSSProperties = {};

            if (
              (showModalAction === ModalAction.EDIT && field.form.hiddenForEdit) ||
              (showModalAction === ModalAction.CREATE && field.form.hiddenForCreate)
            ) {
              style.display = 'none';
            }

            let showTip = false;
            if (
              (data.showActionModalForEdit === ModalAction.EDIT && field.form.hiddenForEdit) ||
              (data.showActionModalForEdit === ModalAction.CREATE && field.form.hiddenForCreate)
            ) {
              showTip = true;
              style.background = 'rgba(0, 0, 0, .1)';
              style.opacity = '0.4';
            }
            /**
             *  1. 创建弹框，创建者、修改者且 window 上用户信息存在
             *  2. 编辑弹框，修改者且 window 上用户信息存在
             */
            if (
              (showModalAction === ModalAction.CREATE &&
                (field.bizType === FieldBizType.SYS_USER_CREATOR ||
                  field.bizType === FieldBizType.SYS_USER_UPDATER) &&
                window['LOGIN_USER_INFO']) ||
              (showModalAction === ModalAction.EDIT &&
                field.bizType === FieldBizType.SYS_USER_UPDATER &&
                window['LOGIN_USER_INFO'])
            ) {
              defaultValue = window['LOGIN_USER_INFO'].id;
              formItem = ComponentName.USER_PROFILE;
            }

            return (
              <Col
                style={style}
                span={currentShowAllowRenderCreateItem.length > 5 ? 12 : 24}
                key={field.id}
              >
                <div
                  className="ant-form-item-area"
                  style={{ width: '100%' }}
                  data-field-id={field.id}
                >
                  <Form.Item
                    initialValue={defaultValue}
                    labelCol={{ span: 6 }}
                    required={field.form?.required}
                    name={field.name}
                    label={field.form?.label ?? field.name}
                    rules={rules}
                  >
                    {renderFormItemNode(field, { formItem })}
                  </Form.Item>
                </div>
                {showTip ? <div className={styles.tipForHidden}>运行时隐藏</div> : null}
              </Col>
            );
          })}
        </Row>
      );
    }

    return null;
  };

  const onPageChange = (pageIndex: number, size: number) => {
    setPageIndex(pageIndex);
    setPageSize(size);
    handleData(searchFormValue.current, { pageIndex, pageSize: size });
  };
  /** 排序 */
  const onTableChange = (_, __, sorter) => {
    const fieldNames = Array.isArray(sorter.field) ? sorter.field : [sorter.field];
    let field = data.fieldAry.find(
      (f) =>
        f.name === fieldNames[0] && (fieldNames[1] ? f.mappingField.name === fieldNames[1] : true)
    );
    const orderMap = { ascend: 'ASC', descend: 'DESC' };

    if (field) {
      field.sorter = sorter.order
        ? {
            entityId: fieldNames.length > 1 ? field.mappingField.relationEntityId : data.entity.id,
            fieldId: fieldNames.length > 1 ? field.mappingField.id : field.id,
            order: orderMap[sorter.order]
          }
        : undefined;

      setPageIndex(1);
      setPageSize(data.pagination?.pageSize || INIT_PAGE_SIZE);
      handleData(searchFormValue.current, {
        pageIndex: 1,
        pageSize: data.pagination?.pageSize || INIT_PAGE_SIZE
      });
    }
  };

  return (
    <div>
      <div
        className={`${styles.domainContainer} ${edit ? styles.edit : ''}`}
        style={data.showActionModalForEdit ? { transform: 'translateZ(0)' } : undefined}
        ref={domainContainerRef}
      >
        {renderSearchFormNode()}
        <Table
          key={env.edit ? String(scrollXWidth) : undefined}
          size={data.table?.size || 'middle'}
          loading={loading}
          columns={renderColumns}
          dataSource={dataSource}
          onChange={onTableChange}
          scroll={{ x: scrollXWidth }}
          pagination={
            data.pagination?.show
              ? {
                  showSizeChanger: true,
                  total,
                  current: pageIndex,
                  pageSize,
                  onChange: onPageChange
                }
              : false
          }
        />
      </div>
      {/*{currentCreatePortal(*/}
      {/*  <div className={styles.container} ref={containerRef}>*/}
      {/*    <Modal*/}
      {/*	    destroyOnClose*/}
      {/*	    width={800}*/}
      {/*	    getContainer={containerRef.current && (edit || debug) ? containerRef.current : undefined}*/}
      {/*	    className={styles.createModal}*/}
      {/*	    visible={!!showModalAction || (edit && data.showActionModalForEdit)}*/}
      {/*	    title={showModalAction === ModalAction.EDIT ? '编辑' : '新增'}*/}
      {/*	    maskClosable*/}
      {/*	    closable*/}
      {/*	    onCancel={closeCreateModal}*/}
      {/*	    onOk={handleCreate}*/}
      {/*	    centered*/}
      {/*	    okText="确定"*/}
      {/*	    cancelText="取消"*/}
      {/*	    confirmLoading={createLoading}*/}
      {/*	    okButtonProps={{ loading: createLoading }}*/}
      {/*    >*/}
      {/*	    <Form form={createForm}>*/}
      {/*		    {createFormNode}*/}
      {/*	    </Form>*/}
      {/*    </Modal>*/}
      {/*  </div>*/}
      {/*)}*/}
      <div className={styles.container} ref={containerRef}>
        <Modal
          destroyOnClose
          width={modalWidth.current}
          getContainer={
            (edit || debug
              ? data.showActionModalForEdit && !showModalAction
                ? domainContainerRef.current
                : document
                    .querySelector('#_mybricks-geo-webview_')
                    ?.shadowRoot?.querySelector('div > div')
              : undefined) as any
          }
          className={styles.createModal}
          visible={!!showModalAction || (edit && data.showActionModalForEdit)}
          title={
            showModalAction === ModalAction.EDIT || data.showActionModalForEdit === ModalAction.EDIT
              ? '编辑'
              : '新增'
          }
          maskClosable
          closable
          onCancel={closeCreateModal}
          onOk={handleCreate}
          centered
          okText="确定"
          cancelText="取消"
          confirmLoading={createLoading}
          okButtonProps={{ loading: createLoading }}
        >
          <Form form={createForm}>{renderCreateFormNode()}</Form>
        </Modal>
      </div>
    </div>
  );
}
