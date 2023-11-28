import React from 'react';
import { Form, FormItemProps } from 'antd';
import { Data } from '../types';
import { unitConversion } from '../../../utils';
import { getLabelCol, isShowLabel } from '../utils';
import css from '../styles.less';

interface Props {
  data: Data;
  com: any;
  item: any;
  field: any;
  slots: any;
  env: any;
}

const JSXWrapper = ({ com }) => {
  return com.jsx;
};

const FormItem = (props: Props) => {
  const { com, item, field, data, slots, env } = props;

  const margin = [...item.inlineMargin];

  const style: React.CSSProperties = {
    margin: margin.map(String).map(unitConversion).join(' '),
    flexWrap: 'nowrap'
  };
  // const whiteSpace =
  //   item?.labelAutoWrap === 'default'
  //     ? data.formItemConfig.labelWrap
  //       ? 'pre-wrap'
  //       : 'nowrap'
  //     : item.labelAutoWrap
  //     ? 'pre-wrap'
  //     : 'nowrap';

  const config: FormItemProps = {
    colon: item?.colon === 'default' ? data.formItemConfig?.colon : item.colon,
    labelAlign: item?.labelAlign === 'default' ? data.formItemConfig.labelAlign : item.labelAlign,
    labelCol: getLabelCol(data)
  };
  const showLabel = isShowLabel({ data, com });

  return (
    <>
      <Form.Item
        {...field}
        {...config}
        label={
          showLabel ? (
            <label style={{ ...item?.labelStyle }}>{env.i18n(item?.label)}</label>
          ) : (
            void 0
          )
        }
        name={field ? [field.name, item?.name] : item?.name}
        required={item?.required}
        validateStatus={item?.validateStatus?.[field.name]}
        help={item?.help?.[field.name]}
        tooltip={env.i18n(item?.tooltip)}
        style={style}
      >
        <JSXWrapper com={com} />
      </Form.Item>
      <div className={css.formItemControl}>
        <div className={css.formItemSlotContent}></div>
      </div>

      {item.description && (
        <div className={css.formItemDesc}>
          <Form.Item noStyle>
            <span style={item.descriptionStyle}>{env.i18n(item.description)}</span>
          </Form.Item>
        </div>
      )}
    </>
  );
};

export default FormItem;
