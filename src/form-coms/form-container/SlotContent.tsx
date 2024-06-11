import React, { useMemo, useState } from 'react';
import { Col, Row } from 'antd';
import FormItem from './components/FormItem';
import FormActions from './components/FormActions';
import InlineLayout from './layout/InlineLayout';
import HorizontalLayout from './layout/HorizontalLayout';
import VerticalLayout from './layout/VerticalLayout';
import QueryFilter from './layout/QueryFilter';
import { getFormItem, isDynamicChildrenStoreValid } from './utils';
import { checkIfMobile } from '../../utils';

const SlotContent = (props) => {
  const { slots, data, childrenInputs, outputs, submit, env, dynamicEnableOrDisabledRef } = props;
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
    return slots['content']?.render({
      itemWrap(com: { id; jsx; name; scope; index }) {
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
      wrap(comAray: { id; name; jsx; def; inputs; outputs; style; getJsx }[]) {
        const items = data.items;

        let jsx = data.items.map((subItem, iIdex) => {
          let com = comAray.find((item) => item.name === subItem.comName);
          if (com) {
            const { item, isFormItem } = getFormItem(data, { ...com, index: iIdex });
            if (!item) {
              if (items.length === comAray.length) {
                console.warn(`formItem comId ${com.id} formItem not found`);
              }
              return;
            }

            const { widthOption, span, width } = item;
            let comJSX = data.useDynamicItems ? com.getJsx({ index: iIdex, id: item.name }) : com;
            // 表单项的处理
            if (isFormItem) {
              if (!data.useDynamicItems) {
                // 静态表单项，保留原处理逻辑
                if (item.comName) {
                  childrenInputs[com.name] = com.inputs;
                } else {
                  childrenInputs[com.id] = com.inputs;
                }
              } else {
                // 动态设置表单项
                // 新的处理逻辑，使用item.name作为唯一key
                if (item.comName) {
                  childrenInputs[item.name] = comJSX.inputs;
                }
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
              <Col style={{ display: com.style.display, width: flexBasis }} key={subItem.id}>
                {comJSX.jsx}
              </Col>
            );
          }
        });
        if (
          data.useDynamicItems &&
          env.runtime &&
          isDynamicChildrenStoreValid(data, childrenInputs) &&
          dynamicEnableOrDisabledRef
        ) {
          // 动态设置表单项后，childrenInputs收集完成后，再执行表单项设置启用/禁用
          dynamicEnableOrDisabledRef.current?.();
        }

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
