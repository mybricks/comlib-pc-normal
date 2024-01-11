import React, { useState } from 'react';
import { Form, Col, Button, Space } from 'antd';
import { Data } from '../../types';
import styles from '../../styles.less';
import { unitConversion } from '../../../../utils';
import { getFormItem } from '../../utils';
import CollapseButton from './CollapseButton';
import { outputIds } from '../../constants';

interface QueryFilterProps {
  data: Data;
  comAray: { id; name; jsx; def; inputs; outputs; style }[];
  children?: React.ReactNode;
  isEmpty: boolean;
  isVerticalModel: boolean;
  childrenInputs: any;
  env: any;
  submit: (outputId: string, outputRels?: any) => void;
  outputs: any;
}

const QueryFilter = (props: QueryFilterProps) => {
  const { data, isEmpty, isVerticalModel, comAray, childrenInputs, env, submit, outputs } = props;
  const { align, inlinePadding } = data.actions;

  const [collapsed, setCollapsed] = useState(env.edit ? false : data.defaultCollapsed);

  const span = data.span || 8;

  const actionStyle: React.CSSProperties = {
    textAlign: 'right',
    padding: inlinePadding?.map(String).map(unitConversion).join(' ')
  };

  const onClick = (item) => {
    if (env?.edit) return;
    if (item.outputId === outputIds.ON_CLICK_SUBMIT) {
      submit(item.outputId);
    } else {
      outputs[item.outputId]();
    }
  };

  let firstRowFull = false;
  // let totalSpan = 0
  // let itemLength = 0
  // let currentSpan = 0

  // const processedList = data.items.map(formItem => {
  //   const span = data.span || 8
  //   let index
  //   let hidden = false

  //   if (formItem.comName) {
  //     index = comAray.find(item => item.name === formItem.comName)
  //   } else {
  //     index = comAray.find(item => item.id === formItem.id)
  //   }

  //   if (index === 0) {
  //     firstRowFull = span === 24
  //   }

  //   if (collapsed) {
  //     hidden = (firstRowFull || index >= (24 / span - 1)) && !!index
  //   }

  //   formItem['hidden'] = hidden

  //   return formItem
  // })

  // console.log(processedList)

  let idx = -1;
  const doms = comAray?.map((com) => {
    const items = data.items;

    if (com) {
      const { item, isFormItem } = getFormItem(data, com);

      if (!item) {
        if (items.length === comAray.length) {
          console.warn(`formItem comId ${com.id} formItem not found`);
        }
        return;
      }

      // const { widthOption, width } = item;

      let hidden = false;

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
      if (item['visible']) {
        idx++;
      }
      if (idx === 0) {
        firstRowFull = span === 24;
      }

      if (collapsed) {
        hidden = (firstRowFull || idx >= 24 / span - 1) && !!idx;
      }

      item['hidden'] = hidden;

      if (env.edit || env.runtime?.debug || data.submitHiddenFields) {
        let display = com.style.display;

        if (display !== 'none') {
          display = item?.hidden ? 'none' : 'block';
        }

        return (
          <Col style={{ display: display }} span={span} key={com.id}>
            {com.jsx}
          </Col>
        );
      }

      return (
        item?.visible && (
          <Col style={{ display: item?.hidden ? 'none' : 'block' }} key={com.id} span={span}>
            {com.jsx}
          </Col>
        )
      );
    }
  });
  // 表单项总宽度超出一行时显示展开/收起按钮
  const showCollapseButton = (idx + 1) * span >= 24;

  return (
    <div className={styles.slotInlineWrapper}>
      {doms}

      {data.actions.visible && (
        <Col
          className={
            isEmpty
              ? isVerticalModel
                ? styles.emptyVerActions
                : styles.emptyHorActions
              : undefined
          }
          flex={1}
          style={actionStyle}
        >
          <Form.Item
            style={{ marginRight: 0 }}
            label={data.config?.layout === 'vertical' ? ' ' : ''}
          >
            <Space wrap data-form-actions>
              {showCollapseButton && (
                <CollapseButton
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                  outputs={outputs}
                />
              )}
              {data.actions.items.map((item) => {
                if (env?.runtime && item.permission?.id) {
                  if (env.hasPermission(item.permission?.id)) {
                    return null;
                  }
                }

                if (typeof item.visible !== 'undefined' && !item.visible) {
                  return null;
                }

                return (
                  <Button
                    data-form-actions-item={item.key}
                    key={item.key}
                    type={item.type}
                    loading={item.loading}
                    danger={item?.danger}
                    disabled={item.disabled || data.config.disabled}
                    onClick={() => onClick(item)}
                  >
                    {item.title}
                  </Button>
                );
              })}
            </Space>
          </Form.Item>
        </Col>
      )}
    </div>
  );
};

export default QueryFilter;
