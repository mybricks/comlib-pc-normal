import React from 'react';
import { Form, Button, Row, Col } from 'antd';
import { Data, FormControlProps } from '../types';
import { unitConversion } from '../../../utils';
import css from '../styles.less';

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
  const { com, item, field, data } = props;
  const style: React.CSSProperties = {
    margin:
      data.layout !== 'horizontal'
        ? item.inlineMargin?.map(String).map(unitConversion).join(' ')
        : void 0
  };
  const colon = item?.colon === 'default' ? data.colon : item.colon;

  return (
    <Form.Item
      {...field}
      label={<label style={item?.labelStyle}>{item?.label}</label>}
      name={field ? [field.name, item?.name] : item?.name}
      required={item?.required}
      validateStatus={item?.validateStatus}
      help={item?.help}
      tooltip={item?.tooltip}
      style={style}
      colon={!!item?.label && colon}
    >
      <JSXWrapper com={com} field={field} />
      {item.description && (
        <div className={css.formItemDesc}>
          <Form.Item noStyle>
            <span style={item.descriptionStyle}>{item.description}</span>
          </Form.Item>
        </div>
      )}
    </Form.Item>
  );
};

export default FormItem;
