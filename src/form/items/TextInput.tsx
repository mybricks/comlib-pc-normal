import {Form, Input} from "antd";

export default function ItemInput(formItem: T_FormItemText) {
  return (
    <Form.Item
      label={formItem.label}
      name={formItem.name}
      rules={formItem.rules}>
      <Input/>
    </Form.Item>
  )
}
