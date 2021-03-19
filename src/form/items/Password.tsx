import {Form, Input} from "antd";

export default function ItemPassword(formItem: T_FormItemPassword) {
  return (
    <Form.Item
      label={formItem.label}
      name={formItem.name}
      rules={formItem.rules}>
      <Input.Password/>
    </Form.Item>
  )
}