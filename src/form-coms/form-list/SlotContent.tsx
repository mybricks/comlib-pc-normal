import React, { ReactElement, useEffect, useMemo } from 'react';
import { Col, FormListFieldData, Row } from 'antd';
import FormItem from './components/FormItem';
import { SlotIds } from './constants';
import { ChildrenStore, Data } from './types';
import { changeValue, isChildrenStoreValid, setValuesForInput } from './utils';

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
    return slots[SlotIds.FormItems].render({
      itemWrap(com: { id; jsx; name }) {
        const item = data.items.find((item) => item.comName === com.name);

        return <FormItem data={data} slots={slots} com={com} item={item} field={field} />;
      },
      wrap(comAray: { id; jsx; name; def; inputs; outputs; style }[]) {
        const jsx = comAray?.map((com, idx) => {
          if (com) {
            let item = data.items.find((item) => item.comName === com.name);
            if (!item) return;
            const visible = com.style.display !== 'none';
            // 收集childrenStore
            if (field) {
              const { key, name } = field;
              if (!childrenStore[key]) {
                childrenStore[key] = {};
              }
              childrenStore[key][com.name] = {
                inputs: com.inputs,
                index: name,
                visible
              };
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

        // childrenStore收集完成后的处理
        if (
          field.key === data.MaxKey &&
          isChildrenStoreValid({ data, childrenStore }) &&
          data.currentAction
        ) {
          switch (data.currentAction) {
            case 'add':
              // 计算新增项默认值
              const initValue = {};
              new Promise((resolve, reject) => {
                data.items.forEach((item) => {
                  const { id, name, comName, label } = item;
                  const { inputs, visible } = childrenStore[field.key][comName];
                  if (!data.submitHiddenFields && !visible) return;
                  inputs.getValue().returnValue((val) => {
                    initValue[name || label] = val;
                  });
                });
                resolve(initValue);
              })
                .then((initValue) => {
                  if (Array.isArray(data.value)) {
                    data.value.push(initValue);
                  } else {
                    data.value = [initValue];
                  }
                  changeValue({ data, id, outputs, parentSlot, name: props.name });
                })
                .catch((e) => {
                  console.error('计算默认值失败: ' + e);
                  if (Array.isArray(data.value)) {
                    data.value.push({});
                  } else {
                    data.value = [{}];
                  }
                  changeValue({ data, id, outputs, parentSlot, name: props.name });
                })
                .finally(() => {
                  data.currentAction = '';
                });
              break;
            default:
              setValuesForInput({ data, childrenStore });
          }
        }

        return (
          <>
            {jsx}
            {actions}
          </>
        );
      },
      inputValues: { ...field },
      style: data.slotStyle,
      key: field.key
    });
  }, [data.slotStyle, data.fields[field.name]]);

  return <Row key={field.key}>{content}</Row>;
};

export default SlotContent;
