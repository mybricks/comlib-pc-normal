import React, { CSSProperties, ReactNode, useMemo } from 'react';
import { Input, Image, Tooltip, TreeNodeProps, Popover, Spin } from 'antd';
import * as Icons from '@ant-design/icons';
import { ExpressionSandbox } from '../../../../package/com-utils';
import { deepCopy } from '../../../utils';
import { ColorType, Data, IconType, MODIFY_BTN_ID } from '../../types';
import { InputIds, OutputIds } from '../../constants';
import { getFieldNames } from '../../utils';
import ActionBtns from './ActionBtn';
import css from './style.less';

/**
 * 树节点标题渲染
 * @param item 树节点数据
 * @returns JSX
 */
export const renderTitle = (
  props: RuntimeParams<Data>,
  item,
  outputItem,
  isRoot,
  { disableHoverPop, runtimeVisible }
) => {
  const { onError, outputs, data, env, slots } = props;
  const { keyFieldName, titleFieldName, childrenFieldName } = getFieldNames({ data, env });
  const visibleEditProps = env.edit && data.showEditPopupPanel && isRoot ? { visible: true } : {};

  const onMouseEnter = (e, item) => {
    if (env.edit) {
      return;
    }
    if (disableHoverPop !== true) {
      data.popUpVisibleProps = {
        key: outputItem[keyFieldName],
        visible: true
      };
      slots['popContent']?.inputs['hoverNode']?.(item);
    }
  };
  /**
   * 计算动态显示表达式
   * @param item 节点数据
   * @param icon 动态数据数据
   */
  const getDynamicDisplay = (item: TreeNodeProps, data: IconType | ColorType): boolean => {
    let dynamicDisplay = true;

    if (data.displayRule === 'dynamic' && data.displayExpression) {
      const context = {
        ...item
      };
      const sandbox: ExpressionSandbox = new ExpressionSandbox({ context, prefix: 'node' });
      try {
        dynamicDisplay = sandbox.executeWithTemplate(data.displayExpression);
      } catch (error: any) {
        onError?.(`树[${data.title}]: ${error}`);
      }
    }
    return dynamicDisplay;
  };

  /**
   * 树节点图标渲染
   * @param item 节点数据
   * @returns JSX
   */
  const getNodeIcon = (item) => {
    const icon = data.icons?.find((i) => getDynamicDisplay(item, i));
    const Icon: { gutter: number; jsx?: ReactNode } = {
      gutter: 0
    };
    if (item.icon || (icon?.src === 'custom' && icon?.customIcon)) {
      Icon.gutter = icon?.gutter?.[0] || 8;
      Icon.jsx = (
        <Image
          width={icon?.size[1] || 14}
          height={icon?.size[0] || 14}
          src={item.icon || icon?.customIcon}
          preview={false}
        />
      );
    }
    if (icon?.src === 'inner') {
      Icon.gutter = icon?.gutter?.[0] || 8;
      Icon.jsx = Icons && (
        <span style={{ fontSize: Math.max(...icon?.size) }}>
          {Icons[icon?.innerIcon || ('FolderOpenOutlined' as string)]?.render()}
        </span>
      );
    }
    return Icon;
  };

  /**
   * 树节点颜色渲染
   * @param item 节点数据
   * @returns Object
   */
  const getNodeColor = (item) => {
    const colors = data.colors?.find((i) => getDynamicDisplay(item, i));
    const color = colors?.color
    return color ? { color } : {};
  };

  const title = env.i18n(item[titleFieldName] || '');

  const Icon = getNodeIcon(outputItem);
  const colorObj = getNodeColor(outputItem);

  // 搜索
  const index = title?.indexOf(data.searchValue);
  const beforeStr = title.substr(0, index);
  const afterStr = title.substr(index + data?.searchValue?.length);
  // 修改
  const titleStyle: CSSProperties = {
      display: data.isEditing === item[keyFieldName] ? 'none' : void 0
    },
    inputStyle = {
      display: data.isEditing === item[keyFieldName] ? 'block' : 'none'
    };

  /**只读态 */
  const titleConent = (
    <div
      style={titleStyle}
      className={`${data.titleEllipsis ? css.ellipsisWrap : css.normalWrap} title`}
    >
      <span style={{ marginRight: Icon.gutter }}>{Icon.jsx}</span>
      {index > -1 ? (
        <div className={data.titleEllipsis ? css.ellipsisWrap : css.normalWrap}>
          {beforeStr}
          <span style={{ color: '#f00' }}>{data.searchValue}</span>
          {afterStr}
        </div>
      ) : (
        title
      )}
    </div>
  );
  // 开启hover 浮层，和标题超出省略互斥，这里额外处理一下
  const Title =
    data.titleEllipsis && !data.useHoverPanel ? (
      <Tooltip title={title}>{titleConent}</Tooltip>
    ) : (
      titleConent
    );

  /**编辑态 */
  const editInput = (
      <Input
        style={inputStyle}
        bordered={false}
        defaultValue={title}
        size={data.useCompactTheme ? 'small' : 'middle'}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onPressEnter={({ target }) => {
          item[titleFieldName] = target.value;
          outputItem[titleFieldName] = target.value;
          data.isEditing = '';
          const { [childrenFieldName]: children, ...res } = outputItem;
          outputs[MODIFY_BTN_ID](res);
          outputs[OutputIds.OnChange](deepCopy(data.treeData));
        }}
      />
    ),
    actionBtns =
      data.isEditing !== item[keyFieldName] &&
      data.useActions &&
      ActionBtns({ data, record: item, outputItem, env, outputs, onError });
  if (!disableHoverPop) {
    return (
      <Popover
        key={outputItem[keyFieldName]}
        trigger={['hover']}
        placement={data.popPlacement ?? 'top'}
        defaultVisible={env.edit ? visibleEditProps.visible : runtimeVisible.visible}
        getPopupContainer={(triggerNode: HTMLElement) =>
          env.runtime ? triggerNode : env?.canvasElement || document.body
        }
        overlayStyle={{ minWidth: '300px' }}
        {...(env.edit ? visibleEditProps : {})}
        zIndex={10010}
        // {...runtimeVisible}
        content={slots['popContent']?.render({
          key: outputItem[keyFieldName],
          inputValues: {
            hoverNode: item
          }
        })}
      >
        <div
          className={`${css.wrapper} ${data.useCompactTheme ? css.singleCompact : ''}`}
          style={colorObj}
          onMouseEnter={(e) => onMouseEnter(e, item)}
        >
          {Title}
          {editInput}
          {actionBtns}
        </div>
      </Popover>
    );
  }
  return (
    <div className={`${css.wrapper} ${data.useCompactTheme ? css.singleCompact : ''}`} style={colorObj}>
      {Title}
      {editInput}
      {actionBtns}
    </div>
  );
};
