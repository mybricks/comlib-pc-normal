import React, { ReactElement, useEffect, useMemo } from 'react';
import { Col, Form, FormListFieldData, Row } from 'antd';
import { deepCopy } from '../../utils';
import isObject from 'lodash/isObject';
import FormItem from './components/FormItem';
import { SlotIds } from './constants';
import { ChildrenStore, Data, ListItemPropsStore } from './types';
import {
  changeValue,
  getFormItem,
  isChildrenStoreValid,
  setValuesForInput,
  setValuesOfChild
} from './utils';
import { inputIds } from '../form-container/constants';

const SlotContent = (
  props: RuntimeParams<Data> & {
    childrenStore: ChildrenStore;
    listItemPropsStore: ListItemPropsStore;
    actions: ReactElement;
    field: FormListFieldData;
    callbacks?: any;
    suffixKey?: number;
  }
) => {
  const {
    slots,
    data,
    env,
    actions,
    field,
    childrenStore,
    listItemPropsStore = {},
    outputs,
    id,
    parentSlot,
    logger,
    callbacks,
    suffixKey
  } = props;

  const content = useMemo(() => {
    return slots[SlotIds.FormItems]?.render({
      itemWrap(com: { id; jsx; name }) {
        const { item, isFormItem } = getFormItem(data, com);
        const { key } = field;
        let index = data.fields.findIndex((f) => f.key === key);
        // 因为name更新后不会重新渲染，所以这里根据key自己更新下name
        const name = data.fields.find((f) => f.key === key)?.name;
        // @ts-ignore
        field.name = name;
        let finItem = item;

        if (env.runtime) {
          try {
            const config = data.listItemProps?.[index]?.[item.name] || {};
            // 没有修改一项，不会走到下面的逻辑
            if (Object.keys(config).length) {
              finItem = {
                ...item,
                ...config,
                validateStatus: item?.validateStatus,
                help: item?.help
              };
              if (!listItemPropsStore[index]) {
                listItemPropsStore[index] = {};
              }
              listItemPropsStore[index][item.name] = config;
            }
          } catch (error) {}
        }
        return isFormItem ? (
          <FormItem data={data} slots={slots} com={com} item={finItem} field={field} env={env} />
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
                changeValue({
                  data,
                  id,
                  outputs,
                  parentSlot,
                  name: props.name,
                  prevAction: actionType
                });
                data.userAction.index = -1;
                data.userAction.key = -1;
                // callback 里面把 data.userAction.startIndex重置
                data.userAction.startIndex = -1;
                data.userAction.value = undefined;
                Object.entries(callbacks).forEach(([key, cb]) => {
                  if (typeof cb === 'function') {
                    cb();
                    callbacks[key] = null;
                  }
                });
              };
              if (actionType === 'add' && data.userAction.index < data.fields.length - 1) {
                // 增加一项的情况下，添加位置为数据最后一个位置之前，这个位置之后的都要重新设置表单项值
                data.userAction.type = inputIds.setInitialValue;
                setValuesForInput({ data, childrenStore });
              }
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
      key: suffixKey ? `${field.key}-${suffixKey}` : field.key
    });
  }, [data.slotStyle, field.name, field.key, suffixKey]);
  /**
   * , [data.slotStyle, data.value?.[field.name], field.name, field.key]);
   */

  return (
    <Form layout={data?.layoutType || 'horizontal'} disabled={data?.disabled}>
      <Row key={field.key} className="form-list-item">
        {content}
        {!env.edit && actions}
      </Row>
    </Form>
  );
};

export default SlotContent;
