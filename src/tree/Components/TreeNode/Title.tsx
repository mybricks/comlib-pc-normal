import React, { CSSProperties, ReactNode } from 'react';
import { Input, Image, Tooltip, TreeNodeProps } from 'antd';
import * as Icons from '@ant-design/icons';
import { ExpressionSandbox } from '../../../../package/com-utils';
import { deepCopy } from '../../../utils';
import { Data, IconType, MODIFY_BTN_ID } from '../../types';
import { InputIds, OutputIds } from '../../constants';
import ActionBtns from './ActionBtn';
import css from './style.less';

/**
 * 树节点标题渲染
 * @param item 树节点数据
 * @returns JSX
 */
export const renderTitle = (props: RuntimeParams<Data>, item, outputItem, isRoot) => {
  const { onError, outputs, data, env } = props;
  const keyFieldName = env.edit ? 'key' : data.keyFieldName || 'key';
  const titleFieldName = env.edit ? 'title' : data.titleFieldName || 'title';
  const childrenFieldName = env.edit ? 'children' : data.childrenFieldName || 'children';

  /**
   * 计算图标动态显示表达式
   * @param item 节点数据
   * @param icon 图标数据
   */
  const getDynamicDisplay = (item: TreeNodeProps, icon: IconType): boolean => {
    let dynamicDisplay = true;

    if (icon.displayRule === 'dynamic' && icon.displayExpression) {
      const context = {
        ...item
      };
      const sandbox: ExpressionSandbox = new ExpressionSandbox({ context, prefix: 'node' });
      try {
        dynamicDisplay = sandbox.executeWithTemplate(icon.displayExpression);
      } catch (error: any) {
        onError?.(`树[${icon.title}]图标: ${error}`);
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

  const title = env.i18n(item[titleFieldName] || '');

  const Icon = getNodeIcon(outputItem);

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
  const Title = data.titleEllipsis ? <Tooltip title={title}>{titleConent}</Tooltip> : titleConent;

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
  return (
    <div className={`${css.wrapper} ${data.useCompactTheme ? css.singleCompact : ''}`}>
      {Title}
      {editInput}
      {actionBtns}
    </div>
  );
};
