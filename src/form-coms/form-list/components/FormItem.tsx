import React from 'react';
import { Form, Button, Row, Col } from 'antd';
import { Data } from '../types';
import { unitConversion } from '../../../utils';
import css from '../styles.less';

interface FormItemProps {
  data: Data;
  com: any;
  item: any;
  field: any;
  slots: any;
}

const JSXWrapper = ({ com }) => {
  return com.jsx;
};

const FormItem = (props: FormItemProps) => {
  const { com, item, field, data, slots } = props;
  const formColon = data.colon;
  const style: React.CSSProperties = {
    margin: item.inlineMargin?.map(String).map(unitConversion).join(' ')
  };
  const colon = item?.colon === 'default' ? formColon : item.colon;
  const labelAlign =
    item?.labelAlign === 'default' ? data.formItemConfig.labelAlign : item.labelAlign;
  const whiteSpace =
    item?.labelAutoWrap === 'default'
      ? data.formItemConfig.labelWrap
        ? 'pre-wrap'
        : 'nowrap'
      : item.labelAutoWrap
      ? 'pre-wrap'
      : 'nowrap';

  return (
    <>
      <Form.Item
        {...field}
        label={
          item?.hiddenLabel ? (
            void 0
          ) : (
            <label style={{ ...item?.labelStyle, whiteSpace }}>{item?.label}</label>
          )
        }
        {...data.config}
        name={field ? [field.name, item?.name] : item?.name}
        required={item?.required}
        validateStatus={item?.validateStatus?.[field.name]}
        help={item?.help?.[field.name]}
        tooltip={item?.tooltip}
        style={style}
        colon={!!item?.label && colon}
      >
        <JSXWrapper com={com} />
      </Form.Item>
      <div className={css.formItemControl}>
        <div className={css.formItemSlotContent}></div>
      </div>

      {item.description && (
        <div className={css.formItemDesc}>
          <Form.Item noStyle>
            <span style={item.descriptionStyle}>{item.description}</span>
          </Form.Item>
        </div>
      )}
    </>
  );
};

export default FormItem;
