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
    // 作用域输出
    const inputValues = {
      curValue: data.value?.[field.name],
      curIndex: field.name,
      curKey: field.key
    };

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
            const visible = com.style.display !== 'none';
            // 收集childrenInputs
            if (field) {
              const { key, name } = field;
              if (!childrenStore[key]) {
                childrenStore[key] = {};
              }
              childrenStore[key][com.id] = {
                inputs: com.inputs,
                index: name,
                visible
              };
            }

            // 收集完成后的处理
            if (
              field.key === data.MaxKey &&
              isChildrenInputsValid({ data, childrenStore }) &&
              data.currentInputId
            ) {
              setValuesForInput({ data, childrenStore });
            }

            const { widthOption, span, width } = item;
            const flexBasis = widthOption === 'px' ? `${width}px` : `${(span * 100) / 24}%`;

            if (env.edit || env.runtime?.debug || data.submitHiddenFields) {
              return (
                <Col style={{ display: com.style.display, width: flexBasis }} key={com.id}>
                  {com.jsx}
                </Col>
              );
            }

            return (
              visible && (
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
      inputValues,
      style: data.slotStyle,
      key: field.key
    });
  }, [data.slotStyle, data.fields.length, data.value?.[field.name]]);

  return (
    <Row key={field.key}>
      {content}
      {actions}
    </Row>
  );
};

export default SlotContent;
