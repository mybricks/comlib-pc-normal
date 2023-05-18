import React, { useCallback, useMemo, useState } from 'react';
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Upload
} from 'antd';
/** 设计器中 shadow dom 导致全局 config 失效，且由于 antd 组件的默认文案是英文，所以需要修改为中文 */
import DebounceSelect from './components/debouce-select';
import { RuleMap } from './rule';
import { ComponentName, Data, FieldBizType } from './constants';
import { Field } from './type';
import { ajax } from '../domain-table/util';

import styles from './runtime.less';

export default function ({ env, data }: RuntimeParams<Data>) {
  const { edit, projectId } = env;
  const [loading, setLoading] = useState(false);
  const [createForm] = Form.useForm();
  const baseFetchParams = useMemo(() => {
    return {
      serviceId: data.entity?.id,
      fileId: data.domainFileId,
      projectId: projectId || undefined
    };
  }, [data.entity, projectId, data.domainFileId]);

  const renderFormItemNode = useCallback(
    (field: Field, option: { placeholder?: string; onPressEnter?(): void }) => {
      let placeholder = option.placeholder ?? `请输入${field.name}`;
      let item = <Input placeholder={placeholder} onPressEnter={option.onPressEnter} allowClear />;

      if (field.form.formItem === ComponentName.DATE_PICKER) {
        item = (
          <DatePicker
            style={{ width: '100%' }}
            showTime
            placeholder={option.placeholder ?? `请选择${field.name}`}
          />
        );
      } else if (field.form.formItem === ComponentName.TEXTAREA) {
        item = (
          <Input.TextArea
            placeholder={placeholder}
            onPressEnter={option.onPressEnter}
            rows={field.form.rows || 2}
            allowClear
          />
        );
      } else if (field.form.formItem === ComponentName.INPUT_NUMBER) {
        item = (
          <InputNumber
            style={{ width: '100%' }}
            onPressEnter={option.onPressEnter}
            placeholder={placeholder}
          />
        );
      } else if (field.form.formItem === ComponentName.SELECT) {
        item = (
          <Select
            placeholder={option.placeholder ?? `请选择${field.name}`}
            options={field.form?.options ?? []}
          />
        );
      } else if (field.mapping?.entity && field.form.formItem === ComponentName.DEBOUNCE_SELECT) {
        item = (
          <DebounceSelect
            placeholder={option.placeholder ?? '可输入关键词检索'}
            field={field}
            fetchParams={baseFetchParams}
          />
        );
      } else if (
        field.form.formItem === ComponentName.INPUT &&
        field.bizType === FieldBizType.PHONE
      ) {
        item = (
          <Input onPressEnter={option.onPressEnter} addonBefore="+86" placeholder={placeholder} />
        );
      } else if (field.form.formItem === ComponentName.IMAGE_UPLOAD) {
        item = <Upload />;
      } else if (field.form.formItem === ComponentName.RADIO) {
        item = <Radio.Group options={field.form?.options ?? []} />;
      } else if (field.form.formItem === ComponentName.RADIO) {
        item = <Checkbox.Group options={field.form?.options ?? []} />;
      } else if (field.bizType === FieldBizType.APPEND_FILE) {
        item = <Upload />;
      }

      return item;
    },
    []
  );

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
        /** 编辑时直接隐藏创建者对应的表单项 */
        if (
          field.bizType === FieldBizType.SYS_USER_CREATOR ||
          field.bizType === FieldBizType.SYS_USER_UPDATER
        ) {
          return !window['LOGIN_USER_INFO'];
        }

        return true;
      }) ?? [];
  const renderCreateFormNode = () => {
    if (data.entity) {
      return (
        <Row gutter={24}>
          {allowRenderCreateItem.map((field) => {
            let defaultValue = undefined;
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

            return (
              <Col span={24} key={field.id}>
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
                    {renderFormItemNode(field, {})}
                  </Form.Item>
                </div>
              </Col>
            );
          })}
        </Row>
      );
    }

    return null;
  };

  const handleCreate = useCallback(() => {
    if (!data.entity) {
      return;
    }
    setLoading(true);
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

        ajax(
          {
            params: {
              fields: data.entity.fieldAry.filter(
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
              action: 'INSERT'
            },
            ...baseFetchParams
          },
          {
            successTip: '提交成功',
            errorTip: '提交失败'
          }
        ).then(() => createForm.resetFields());
      })
      .catch((error) => console.log('表单校验参数不合法', error))
      .finally(() => setLoading(false));
  }, [data.entity, baseFetchParams]);

  return (
    <div className={`${styles.domainContainer} ${edit ? styles.edit : ''}`}>
      <Form form={createForm}>
        {renderCreateFormNode()}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="primary"
            style={{ width: '100px' }}
            onClick={handleCreate}
            loading={loading}
          >
            提交
          </Button>
        </div>
      </Form>
    </div>
  );
}
