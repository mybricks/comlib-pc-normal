import React from 'react';
import { Tag, Tooltip } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { IColumn } from '../../types';
import { getParentNodeByTag } from '../../utils';
import css from './style.less';

interface Props {
  value: any;
  columnItem: IColumn;
}
const isNullUndefined = (val: any) => val === null || val === undefined;
const TagRender = (props: Props): JSX.Element => {
  const { value, columnItem } = props;
  const { ellipsisTagConfig } = columnItem;
  const { useEllipsis, maxToEllipsis, onlyShowOver, ...tooltipProps } =
    ellipsisTagConfig || {};

  if (!columnItem.tagEnum) {
    columnItem.tagEnum = {};
  }
  if (!columnItem.mappingEnum) {
    columnItem.mappingEnum = {};
  }

  // 标签渲染
  const ItemRender = ({ item }) => {
    const val = columnItem.mappingEnum[item] || item;
    return (
      <Tag
        color={columnItem.tagEnum[item] || columnItem.tagEnum[val] || ''}
        key={val}
        className={css.tagItem}
      >
        {isNullUndefined(val) ? '' : `${val}`}
      </Tag>
    );
  };
  // 标签列表渲染
  const ListRender = ({ tagList }) => {
    return (
      <>
        {tagList.map((item) => (
          <ItemRender item={item} />
        ))}
      </>
    );
  };
  // Tooltip渲染
  const EllipsisRender = () => {
    // 展示标签内容列表
    const contentList = (value || []).slice(0, maxToEllipsis);
    // 气泡框标签列表
    const titleList = onlyShowOver ? (value || []).slice(maxToEllipsis) : value;
    return (
      <Tooltip
        {...tooltipProps}
        placement="rightTop"
        title={<ListRender tagList={titleList} />}
        overlayClassName={css.ellipsisTooltip}
        color="#fff"
        // 挂载到table上
        getTooltipContainer={(node) => {
          return getParentNodeByTag(node, 'table');
        }}
      >
        <ListRender tagList={contentList} />
        <EllipsisOutlined />
      </Tooltip>
    );
  };

  if (Array.isArray(value)) {
    if (useEllipsis && maxToEllipsis && value.length > maxToEllipsis) {
      return <EllipsisRender />;
    }
    return <ListRender tagList={value} />;
  }
  return <ItemRender item={value} />;
};
export default TagRender;
