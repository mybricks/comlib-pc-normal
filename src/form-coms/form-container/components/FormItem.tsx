import React from 'react';
import { Form } from 'antd';
import { Data, FormControlProps } from '../types';
import { unitConversion } from '../../../utils';
import css from '../styles.less';

interface FormItemProps {
  data: Data;
  com: any;
  item: any;
  // field: any;
  slots: any;
  isMobile: boolean;
}

const JSXWrapper = (props: FormControlProps) => {
  const { com, value, onChange, field } = props;

  // useLayoutEffect(() => { // 初始化表单项值
  //   com.inputs?.setValue(value) // 需求区分 表单API行为触发 与 用户行为触发 => inputs or _inputs
  // }, [value])

  return com.jsx;
};

const FormItem = (props) => {
  const { com, item, data, slots, isMobile, env } = props;
  const layout = data.config?.layout || data.layout;
  const formColon = data.config?.colon || data.colon;

  const style: React.CSSProperties = {
    margin:
      layout !== 'horizontal'
        ? item.inlineMargin?.map(String).map(unitConversion).join(' ')
        : void 0
  };

  const colon = item?.colon === 'default' ? formColon : item.colon;

  const labelAlign = item?.labelAlign === 'default' ? data.config.labelAlign : item.labelAlign;
  const labelCol =
    item?.labelWidthType === 'default'
      ? void 0
      : { flex: `0 0 ${item.labelWidth ? item.labelWidth : 98}px` };

  const whiteSpace =
    item?.labelAutoWrap === 'default'
      ? data.config?.labelWrap
        ? 'pre-wrap'
        : 'nowrap'
      : item.labelAutoWrap
      ? 'pre-wrap'
      : 'nowrap';

  return (
    <Form.Item
      style={style}
      label={
        item?.hiddenLabel || (isMobile && item?.label?.trim()?.length === 0) ? (
          void 0
        ) : (
          <label style={{ ...item?.labelStyle, whiteSpace }}>{env.i18n(item?.label)}</label>
        )
      }
      labelCol={labelCol}
      labelAlign={labelAlign}
      name={item?.name}
      required={item?.required}
      validateStatus={item?.validateStatus}
      help={item?.help}
      tooltip={env.i18n(item?.tooltip)}
      colon={!!item?.label && colon}
      hidden={item?.hidden}
    >
      <div className={css.formItemControl}>
        <div className={css.formItemSlotContent}>
          <JSXWrapper com={com} />
        </div>
        {item.slotAfter && (
          <div className={css.formItemSlotAfter}>
            {<Form.Item noStyle>{slots[item.slotAfter]?.render()}</Form.Item>}
          </div>
        )}
      </div>

      {item.description && (
        <div className={css.formItemDesc}>
          <Form.Item noStyle>
            <span style={item.descriptionStyle}>{env.i18n(item.description)}</span>
          </Form.Item>
        </div>
      )}
    </Form.Item>
  );
};

export default FormItem;
