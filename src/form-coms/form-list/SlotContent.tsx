import React, { ReactElement, useEffect, useMemo } from 'react';
import { Col, FormListFieldData, Row } from 'antd';
import FormItem from './components/FormItem';
import { SlotIds } from './constants';
import { ChildrenStore, Data } from './types';
import { isChildrenInputsValid, setValuesForInput } from './utils';
import { deepCopy } from '../../utils';

const SlotContent = (
  props: RuntimeParams<Data> & {
    childrenStore: ChildrenStore;
    actions: ReactElement;
    field: FormListFieldData;
  }
) => {
  const { slots, data, env, actions, field, childrenStore, outputs, id, parentSlot, logger } =
    props;

  const content = useMemo(() => {
    const slotRenderProps = {
      inputValues: {
        curValue: data.value?.[field.name],
        curIndex: field?.name,
        curKey: field?.key
      },
      style: data.slotStyle,
      key: field?.key
    };
    console.log(deepCopy(data.value), slotRenderProps, '-------slotRenderProps-------');
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
              if (!childrenStore[key]) {
                childrenStore[key] = {};
              }
              childrenStore[key][com.id] = {
                inputs: com.inputs,
                index: name,
                visible: com.style.display !== 'none'
              };
            }

            console.log(deepCopy(childrenStore), 'wrap-----收集childrenInputs');

            // 收集完成后的处理
            if (isChildrenInputsValid({ data, childrenStore }) && data.currentInputId) {
              console.log('----------收集完成后的处理-----------', data.currentInputId);
              setValuesForInput({ data, childrenStore });
            }

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
      ...slotRenderProps
    });
  }, [data.slotStyle, data.fields.length]);

  return (
    <Row key={field?.key}>
      {content}
      {actions}
    </Row>
  );
};

export default SlotContent;
