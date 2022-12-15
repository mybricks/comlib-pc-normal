import React, { useMemo, useState } from 'react';
import { Col, Row } from 'antd';
import FormItem from './components/FormItem';
import FormActions from './components/FormActions';
import InlineLayout from './layout/InlineLayout';
import HorizontalLayout from './layout/HorizontalLayout';
import VerticalLayout from './layout/VerticalLayout';

const SlotContent = (props) => {
  const { slots, data, childrenInputs, outputs, submit, env } = props;

  const isInlineModel = useMemo(() => {
    return data.layout === 'inline';
  }, [data.layout]);

  const isHorizontalModel = useMemo(() => {
    return data.layout === 'horizontal';
  }, [data.layout]);

  const isVerticalModel = useMemo(() => {
    return data.layout === 'vertical';
  }, [data.layout]);

  const FormActionsWrapper = () => {
    return <FormActions data={data} outputs={outputs} submit={submit} />;
  };

  const content = useMemo(() => {
    return slots['content'].render({
      itemWrap(com: { id; jsx }) {
        const item = data.items.find((item) => item.id === com.id);

        return <FormItem data={data} com={com} item={item} field={props?.field} />;
      },
      wrap(comAray: { id; jsx; def; inputs; outputs; style }[]) {
        const items = data.items;
        // if (data.dataType === 'list') {
        //   console.log('items', items, comAray, props?.field);
        // }

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

            if (env.edit || data.submitHiddenFields) {
              return (
                <Col style={{ display: com.style.display }} key={com.id} flex={`0 0 ${flexBasis}`}>
                  {com.jsx}
                </Col>
              );
            }

            return (
              item?.visible && (
                <Col key={com.id} flex={`0 0 ${flexBasis}`}>
                  {com.jsx}
                </Col>
              )
            );
          }

          console.error(com, comAray);
          return <div key={idx}>组件错误</div>;
        });

        return (
          <Row gutter={isVerticalModel ? { xs: 8, sm: 16, md: 24 } : {}}>
            {isInlineModel && (
              <InlineLayout data={data} actions={<FormActionsWrapper />}>
                {jsx}
              </InlineLayout>
            )}
            {isHorizontalModel && (
              <HorizontalLayout data={data} actions={<FormActionsWrapper />}>
                {jsx}
              </HorizontalLayout>
            )}
            {isVerticalModel && (
              <VerticalLayout data={data} actions={<FormActionsWrapper />}>
                {jsx}
              </VerticalLayout>
            )}
          </Row>
        );
      },
      inputValues: {}
      // key: props?.field?.name
    });
  }, [data.layout]);

  return content;
};

export default SlotContent;
