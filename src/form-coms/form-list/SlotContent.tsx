import React, { ReactElement, useEffect, useMemo } from 'react';
import { Col, FormListFieldData, Row } from 'antd';
import FormItem from './components/FormItem';
import { SlotIds } from './constants';
import { ChildrenInputs, Data } from './types';

const SlotContent = (
  props: RuntimeParams<Data> & {
    childrenInputs: ChildrenInputs;
    actions: ReactElement;
    field?: FormListFieldData;
  }
) => {
  const { slots, data, env, actions, field, childrenInputs, outputs, id, parentSlot, logger } =
    props;

  const content = useMemo(() => {
    return slots[SlotIds.FormItems].render({
      itemWrap(com: { id; jsx }) {
        const item = data.items.find((item) => item.id === com.id);

        return <FormItem data={data} slots={slots} com={com} item={item} field={field} />;
      },
      wrap(comAray: { id; jsx; def; inputs; outputs; style }[]) {
        const items = data.items;
        const jsx = comAray?.map((com, idx) => {
          if (com) {
            let item = items.find((item) => item.id === com.id);
            if (!item) return;
            // 收集childrenInputs
            if (field) {
              const { key, name } = field;
              if (!childrenInputs[key]) {
                childrenInputs[key] = {};
              }
              childrenInputs[key][com.id] = {
                inputs: com.inputs,
                index: name
              };
            }

            console.log(childrenInputs, 'wrap-----收集childrenInputs');

            const { widthOption, span, width } = item;
            const flexBasis = widthOption === 'px' ? `${width}px` : `${(span * 100) / 24}%`;

            if (typeof item?.visible !== 'undefined') {
              item.visible = com.style.display !== 'none';
            } else {
              item['visible'] = true;
            }

            if (env.edit || env.runtime?.debug || data.submitHiddenFields) {
              return (
                <Col style={{ display: com.style.display, width: flexBasis }} key={com.id}>
                  {com.jsx}
                </Col>
              );
            }

            return (
              item?.visible && (
                <Col key={com.id} style={{ width: flexBasis }}>
                  {com.jsx}
                </Col>
              )
            );
          }

          console.error(com, comAray);
          return <div key={idx}>组件错误</div>;
        });
        return jsx;
      },
      inputValues: {
        // curIndex: field?.name,
        curKey: field?.key
      },
      style: data.slotStyle,
      key: field?.key
    });
  }, [data.slotStyle, data.fields.length]);

  // useEffect(() => {
  //   if (field?.name === 0) {
  //     console.log(data.fieldsLength, '--------------here-----SlotContent-----------');
  //     // 值变化
  //     getValue({ data, childrenInputs })
  //       .then(() => {
  //         changeValue({ data, id, outputs, parentSlot });
  //       })
  //       .catch((e) => logger.error(e));
  //   }
  // }, [data.fieldsLength]);

  return (
    <Row key={field?.key}>
      {content}
      {actions}
    </Row>
  );
};

export default SlotContent;
