import React, { useMemo, useState } from 'react';
import { Col, Row } from 'antd';
import FormItem from './components/FormItem';
import FormActions from './components/FormActions';
import InlineLayout from './layout/InlineLayout';
import HorizontalLayout from './layout/HorizontalLayout';
import VerticalLayout from './layout/VerticalLayout';
import QueryFilter from './layout/QueryFilter';
import { getFormItem } from './utils';
import { checkIfMobile } from '../../utils';

const SlotContent = (props) => {
  const { slots, data, childrenInputs, outputs, submit, env } = props;
  const layoutType = data.layoutType;

  const layout = data.config?.layout || data.layout;

  const isEmpty = slots['content'].size === 0 && env.edit;

  const isMobile = checkIfMobile(env);

  const isInlineModel = useMemo(() => {
    return layout === 'inline';
  }, [layout]);

  const isHorizontalModel = useMemo(() => {
    return layout === 'horizontal';
  }, [layout]);

  const isVerticalModel = useMemo(() => {
    return layout === 'vertical';
  }, [layout]);

  const FormActionsWrapper = () => {
    return (
      <FormActions data={data} env={env} outputs={outputs} submit={submit} isMobile={isMobile} />
    );
  };

  const content = useMemo(() => {
    return slots['content'].render({
      itemWrap(com: { id; jsx; name; scope }) {
        // todo name
        const { item, isFormItem } = getFormItem(data, com);
        return isFormItem ? (
          <FormItem
            data={data}
            slots={slots}
            com={com}
            item={item}
            isMobile={isMobile}
            env={env}
            // field={props?.field}
          />
        ) : (
          <>{com.jsx}</>
        );
      },
      wrap(comAray: { id; name; jsx; def; inputs; outputs; style }[]) {
        const items = data.items;

        const jsx = comAray?.map((com, idx) => {
          if (com) {
            const { item, isFormItem } = getFormItem(data, com);

            if (!item) {
              if (items.length === comAray.length) {
                console.warn(`formItem comId ${com.id} formItem not found`);
              }
              return;
            }

            const { widthOption, span, width } = item;

            // 表单项的处理
            if (isFormItem) {
              if (item.comName) {
                childrenInputs[com.name] = com.inputs;
              } else {
                childrenInputs[com.id] = com.inputs;
              }
            }

            if (typeof item?.visible !== 'undefined') {
              item.visible = com.style.display !== 'none';
            } else {
              item['visible'] = true;
            }

            const flexBasis = isMobile
              ? '100%'
              : widthOption === 'px'
              ? `${width}px`
              : `${(span * 100) / 24}%`;

            return (
              <Col style={{ display: com.style.display, width: flexBasis }} key={com.id}>
                {com.jsx}
              </Col>
            );
          }

          console.error(com, comAray);
          return <div key={idx}>组件错误</div>;
        });

        if (layoutType === 'QueryFilter') {
          // 查询表单，支持展开/收起
          return (
            <QueryFilter
              env={env}
              data={data}
              isEmpty={isEmpty}
              isVerticalModel={isVerticalModel}
              comAray={comAray}
              outputs={outputs}
              submit={submit}
              childrenInputs={childrenInputs}
            ></QueryFilter>
          );
        } else {
          return (
            <Row style={{ width: '100%' }}>
              {isInlineModel && (
                <InlineLayout data={data} isEmpty={isEmpty} actions={<FormActionsWrapper />}>
                  {jsx}
                </InlineLayout>
              )}
              {isHorizontalModel && (
                <HorizontalLayout
                  data={data}
                  isEmpty={isEmpty}
                  isMobile={isMobile}
                  actions={<FormActionsWrapper />}
                >
                  {jsx}
                </HorizontalLayout>
              )}
              {isVerticalModel && (
                <VerticalLayout
                  data={data}
                  isEmpty={isEmpty}
                  isMobile={isMobile}
                  actions={<FormActionsWrapper />}
                >
                  {jsx}
                </VerticalLayout>
              )}
            </Row>
          );
        }
      }
      // inputValues: {}
      // key: props?.field?.name
    });
  }, [layout, slots, isMobile, layoutType]);

  return content;
};

export default SlotContent;
