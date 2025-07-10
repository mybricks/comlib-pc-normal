import React, { useMemo, useState } from 'react';
import { Form, Col, Button, Space } from 'antd';
import { Data } from '../../types';
import styles from '../../styles.less';
import { unitConversion } from '../../../../utils';
import { getFormItem } from '../../utils';
import CollapseButton from './CollapseButton';
import { outputIds } from '../../constants';
import { getWhatToDoWithoutPermission } from '../../../../utils/permission';

const getGapedAfterColFlex = (data) => {
  let columnNum = data.enable24Grid ? 24 / (data.span || 8) : data.formItemColumn;
  let gapWidthPerRow = (data.columnGap || 0) * (columnNum - 1);
  return `0 0 calc((100% - ${gapWidthPerRow}px) / ${columnNum})`;
};

interface QueryFilterProps {
  data: Data;
  comAray: {
    index?: number;
    id;
    name;
    jsx;
    def;
    inputs;
    outputs;
    style;
  }[];
  children?: React.ReactNode;
  isEmpty: boolean;
  isVerticalModel: boolean;
  childrenInputs: any;
  env: any;
  submit: (outputId: string, outputRels?: any) => void;
  outputs: any;
  dynamicEnableOrDisabledRef: any;
}

const QueryFilter = (props: QueryFilterProps) => {
  const {
    data,
    isEmpty,
    isVerticalModel,
    comAray,
    childrenInputs,
    env,
    submit,
    outputs,
    dynamicEnableOrDisabledRef
  } = props;
  const { align, inlinePadding } = data.actions;

  const [collapsed, setCollapsed] = useState(env.edit ? false : data.defaultCollapsed);

  // 查询表单，有列间距的条件: 每行列数> 1 & 列间距大于0
  const hasGutter = useMemo(() => {
    let columnNum = data.enable24Grid ? 24 / (data.span || 8) : data.formItemColumn;
    const layout = data.config?.layout || data.layout;
    if (!data.columnGap || layout === 'inline') {
      return false;
    }
    return columnNum > 1 && data.columnGap > 1;
  }, [data.formItemColumn, data.span, data.enable24Grid, data.columnGap]);

  const [span, colProps] = useMemo(() => {
    if (data.enable24Grid) {
      let spanVal = data.span || 8;
      return !hasGutter
        ? [spanVal, { span: spanVal }]
        : [spanVal, { flex: getGapedAfterColFlex(data) }];
    }
    return !hasGutter
      ? [24 / data.formItemColumn, { flex: `0 1 ${100 / data.formItemColumn}%` }]
      : [24 / data.formItemColumn, { flex: getGapedAfterColFlex(data) }];
  }, [data.formItemColumn, data.span, data.enable24Grid, hasGutter]);

  const actionStyle: React.CSSProperties = {
    textAlign: 'right',
    padding: inlinePadding?.map(String).map(unitConversion).join(' ')
    // width: `${100 / data.formItemColumn}%`
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
  let doms;
  if (env.edit || !data.useDynamicItems || (env.runtime && !data.useDynamicItems)) {
    doms = comAray?.map((com) => {
      const items = data.items;

      if (com) {
        const { item, isFormItem } = getFormItem(data, { name: com.name, id: com.id });

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
            <Col style={{ display: display }} {...colProps} key={com.id}>
              {com.jsx}
            </Col>
          );
        }

        return (
          <Col style={{ display: (item?.hidden || item?.visible) ? 'none' : 'block' }} key={com.id} {...colProps}>
            {com.jsx}
          </Col>
        );
      }
    });
  }
  if (env.runtime && data.useDynamicItems) {
    // 动态设置表单项渲染逻辑
    doms = data.items?.map((subItem, index) => {
      const items = data.items;
      let com = comAray.find((item) => item.name === subItem.comName);
      if (com) {
        // com.index= index
        const { item, isFormItem } = getFormItem(data, { ...com, index });
        if (!item) {
          if (items.length === comAray.length) {
            console.warn(`formItem comId ${com.id} formItem not found`);
          }
          return;
        }

        let hidden = false;
        let id = com.name + '::' + item.id;
        let comJSX = data.useDynamicItems ? com.getJsx({ index: index, id: id }) : com;

        // 表单项的处理
        if (isFormItem) {
          if (!data.useDynamicItems) {
            if (item.comName) {
              childrenInputs[com.name] = com.inputs;
            } else {
              childrenInputs[com.id] = com.inputs;
            }
          } else {
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
            <Col style={{ display: display }} {...colProps} key={com.id}>
              {comJSX.jsx}
            </Col>
          );
        }

        return (
          item?.visible && (
            <Col style={{ display: item?.hidden ? 'none' : 'block' }} key={com.id} {...colProps}>
              {comJSX.jsx}
            </Col>
          )
        );
      }
    });
    if (dynamicEnableOrDisabledRef.current) {
      dynamicEnableOrDisabledRef?.current?.();
      dynamicEnableOrDisabledRef.current = null;
    }
  }
  // 表单项总宽度超出一行时显示展开/收起按钮
  const showCollapseButton = (idx + 1) * span >= 24;
  return (
    <div
      className={styles.slotInlineWrapper}
      style={{ ...(hasGutter ? { columnGap: data.columnGap } : {}) }}
    >
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
              {showCollapseButton && !data.actions.isRight && (
                <CollapseButton
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                  outputs={outputs}
                  env={env}
                  data={data}
                />
              )}
              {data.actions.items.map((item) => {
                if (env?.runtime && item.permission?.id) {
                  if (getWhatToDoWithoutPermission(item.permission, env).type !== 'none') {
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
                    {env.i18n(item.title)}
                  </Button>
                );
              })}
               {showCollapseButton && data.actions.isRight && (
                <CollapseButton
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                  outputs={outputs}
                  env={env}
                  data={data}
                />
              )}
            </Space>
          </Form.Item>
        </Col>
      )}
    </div>
  );
};

export default QueryFilter;
