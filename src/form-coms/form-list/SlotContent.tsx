import React, { useMemo } from 'react';
import { Col } from 'antd';
import FormItem from './components/FormItem';
import { SlotIds } from './constants';

const SlotContent = (props) => {
  const { slots, data, childrenInputs, env, actions } = props;

  const content = useMemo(() => {
    return slots[SlotIds.FormItems].render({
      itemWrap(com: { id; jsx }) {
        const item = data.items.find((item) => item.id === com.id);
        return <FormItem data={data} slots={slots} com={com} item={item} field={props?.field} />;
      },
      wrap(comAray: { id; jsx; def; inputs; outputs; style }[]) {
        const items = data.items;

        const jsx = comAray?.map((com, idx) => {
          if (com) {
            let item = items.find((item) => item.id === com.id);
            if (!item) return;
            const { widthOption, span, width } = item;
            childrenInputs[com.id] = com.inputs;

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
      inputValues: {},
      style: data.slotStyle
      // key: props?.field?.name
    });
  }, [data.slotStyle]);

  return (
    <>
      {content}
      {actions}
    </>
  );
};

export default SlotContent;
