import React, { useMemo, useState } from 'react';
import FormItem from './components/FormItem';
import FormActions from './components/FormActions';
import InlineLayout from './layout/InlineLayout';
import HorizontalLayout from './layout/HorizontalLayout';
import VerticalLayout from './layout/VerticalLayout';

const SlotContent = (props) => {
  const { slots, data, childrenInputs, outputs, submit } = props;

  const isInlineModel = useMemo(() => {
    return data.layout === 'inline';
  }, [data.layout]);

  const isHorizontalModel = useMemo(() => {
    return data.layout === 'horizontal';
  }, [data.layout]);

  const isVerticalModel = useMemo(() => {
    return data.layout === 'vertical';
  }, [data.layout]);

  const content = useMemo(() => {
    console.log('-----content');
    return slots['content'].render({
      wrap(comAray: { id; jsx; def; inputs; outputs }[]) {
        const items = data.items;
        // if (data.dataType === 'list') {
        //   console.log('items', items, comAray, props?.field);
        // }

        if (comAray) {
          const jsx = comAray.map((com, idx) => {
            if (com) {
              let item = items.find((item) => item.id === com.id);

              childrenInputs[com.id] = com.inputs;
              // console.log('-----items', data.items)
              // console.log('comAray', comAray)
              // console.log('-----com.id', com.id)

              return (
                <FormItem data={data} com={com} item={item} key={com.id} field={props?.field} />
              );
            }

            return <div key={idx}>组件错误</div>;
          });

          return (
            <>
              {isInlineModel && (
                <InlineLayout data={data}>
                  {jsx}
                  <FormActions data={data} outputs={outputs} submit={submit} />
                </InlineLayout>
              )}
              {isHorizontalModel && (
                <HorizontalLayout
                  data={data}
                  actions={<FormActions data={data} outputs={outputs} submit={submit} />}
                >
                  {jsx}
                </HorizontalLayout>
              )}
              {isVerticalModel && (
                <VerticalLayout data={data}>
                  {jsx}
                  <FormActions data={data} outputs={outputs} submit={submit} />
                </VerticalLayout>
              )}
            </>
          );
        }
      },
      inputValues: {}
      // key: props?.field?.name
    });
  }, [data.layout]);

  return content;
};

export default SlotContent;
