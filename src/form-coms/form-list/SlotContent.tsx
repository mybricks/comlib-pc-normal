import React, { ReactElement, useEffect, useMemo } from 'react';
import { Col, FormListFieldData, Row } from 'antd';
import { deepCopy } from '../../utils';
import FormItem from './components/FormItem';
import { SlotIds } from './constants';
import { ChildrenStore, Data } from './types';
import {
  changeValue,
  getFormItem,
  isChildrenStoreValid,
  setValuesForInput,
  setValuesOfChild
} from './utils';

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
        const { item, isFormItem } = getFormItem(data, com);

        return isFormItem ? (
          <FormItem data={data} slots={slots} com={com} item={item} field={field} env={env} />
        ) : (
          <>{com.jsx}</>
        );
      },
      wrap(comAray: { id; jsx; name; def; inputs; outputs; style }[]) {
        let comCount = comAray?.length;
        const jsx = comAray?.map((com, idx) => {
          if (com) {
            let { item, isFormItem } = getFormItem(data, com);
            if (!item) return;
            const visible = com.style.display !== 'none';
            // 非表单项不收集childrenStore
            if (!isFormItem) {
              comCount--;
            }
            // 表单项收集childrenStore
            if (field && isFormItem) {
              const { key } = field;
              const name = data.fields.find((f) => f.key === key)?.name;
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

            return (
              <Col style={{ display: com.style.display, width: flexBasis }} key={com.id}>
                {com.jsx}
              </Col>
            );
          }

          console.error(com, comAray);
          return <div key={idx}>组件错误</div>;
        });

        // childrenStore收集完成后的处理
        if (
          env.runtime &&
          isChildrenStoreValid({ data, childrenStore, comCount }) &&
          data.userAction.type
        ) {
          const actionType = data.userAction.type;
          switch (data.userAction.type) {
            case 'add':
            case 'init':
              if (data.userAction.key !== field.key) return;
              data.userAction.type = '';
              const temp = deepCopy(data.userAction.value);
              const key = data.userAction.key;

              if (Array.isArray(data.value)) {
                const index = data.userAction.index;
                data.value.splice(index, 0, temp || {});
              } else {
                data.value = [temp || {}];
              }
              const cb = () => {
                changeValue({ data, id, outputs, parentSlot, name: props.name });
                data.userAction.index = -1;
                data.userAction.key = -1;
                data.userAction.value = undefined;
              };
              if (temp) {
                setValuesOfChild({ data, childrenStore, key, value: temp || {}, actionType }, cb);
              } else {
                cb();
              }
              break;
            default:
              setValuesForInput({ data, childrenStore });
          }
        }

        return (
          <>
            {jsx}
            {env.edit && actions}
          </>
        );
      },
      inputValues: { ...field },
      style: data.slotStyle,
      key: field.key
    });
  }, [data.slotStyle, field.name, field.key]);
  /**
   * , [data.slotStyle, data.value?.[field.name], field.name, field.key]);
   */

  return (
    <Row key={field.key} className="form-list-item">
      {content}
      {!env.edit && actions}
    </Row>
  );
};

export default SlotContent;
