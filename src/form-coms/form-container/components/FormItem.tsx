import React from 'react';
import { Form, Button, Row, Col } from 'antd';
import { Data, FormControlProps } from '../types';

interface FormItemProps {
  data: Data;
  com: any;
  item: any;
  field: any;
}

const JSXWrapper = (props: FormControlProps) => {
  const { com, value, onChange, field } = props;

  // useLayoutEffect(() => { // 初始化表单项值
  //   com.inputs?.setValue(value) // 需求区分 表单API行为触发 与 用户行为触发 => inputs or _inputs
  // }, [value])

  return com.jsx;
};

const FormItem = (props: FormItemProps) => {
  const { com, item, field } = props;
  return (
    <Form.Item
      {...field}
      label={item?.label}
      name={field ? [field.name, item?.name] : item?.name}
      required={item?.required}
      validateStatus={item?.validateStatus}
      help={item?.help}
      tooltip={item?.tooltip}
    >
      <JSXWrapper com={com} field={field} />
    </Form.Item>
  );
};

export default FormItem;
