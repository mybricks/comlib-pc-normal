import React, { useCallback, useMemo } from 'react';
import {
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Upload
} from 'antd';
/** 设计器中 shadow dom 导致全局 config 失效，且由于 antd 组件的默认文案是英文，所以需要修改为中文 */
import DebounceSelect from './ccomponents/debouce-select';
import { RuleMap } from './rule';
import { ComponentName, Data, FieldBizType } from './constants';
import { Field } from './type';

import styles from './runtime.less';

export default function ({ env, data }: RuntimeParams<Data>) {
  const { edit, projectId } = env;
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
	      /** 这一行必须要，读取 form 的 disabledForEdit 值才能被收集到依赖，才能对应响应编辑项变化 */
	      field.form.disabledForEdit;
	      /** 编辑时直接隐藏创建者对应的表单项 */
	      if (field.bizType === FieldBizType.SYS_USER_CREATOR) {
		      return false;
		      /** 修改者且 window 上用户信息存在则不展示表单项 */
	      } else if (field.bizType === FieldBizType.SYS_USER_UPDATER) {
		      return !window['LOGIN_USER_INFO'];
	      }
	
	      return !field.form.disabledForEdit;
      }) ?? [];
  const renderCreateFormNode = () => {
    if (data.entity) {
      return (
        <Row gutter={24}>
          {allowRenderCreateItem.map((field) => {
            let defaultValue = undefined;
            const rules: any[] = field.form?.rules?.filter((r) => r.status).map((r) => RuleMap[r.key]?.(field, r)) || [];

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

  return (
	  <div className={`${styles.domainContainer} ${edit ? styles.edit : ''}`}>
		  <Form form={createForm}>{renderCreateFormNode()}</Form>
	  </div>
  );
}
