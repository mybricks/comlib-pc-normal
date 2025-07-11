import React, { memo, useMemo } from 'react';
import { DefaultRowKey, OutputIds } from '../constants';
import { ContentTypeEnum, IColumn } from '../types';
import SlotRender from './Slot';
import { genFormatting } from '../../utils/dataFormatter';
import { Tooltip, Image, Switch } from 'antd';
import css from './style.less';
import { TableContext } from '../runtime';

interface ColumnRenderProps {
  columnItem: IColumn;
  value: any;
  record: any;
  index: number;
  colKey: string;
  data: any;
  env: any;
  outputs: any;
}

/* 递归查找列 */
const findColumnByKey = (columns: Array<IColumn>, colKey: string) => {
  for (const item of columns) {
    if (item.key === colKey) {
      return item;
    }
    if (Array.isArray(item.children) && item.children.length > 0) {
      const child = findColumnByKey(item.children, colKey);
      if (child) return child;
    }
  }
  return null;
};

function ColumnRender(props: ColumnRenderProps) {
  const { colKey, record, index, env, data , outputs} = props;
  const columnItem = useMemo(() => {
    // 根据key找到对应的column 是分组类型从children找
    return findColumnByKey(data.columns, colKey);
  }, [data.columns, colKey]);

  const value = useMemo(() => {
    let oriValue = props.value;

    if (columnItem?.formatData && !env.edit) {
      // 格式化数据时，如果是表达式传入index、行数据、当前cell数据
      const valueToBeFormat = ['EXPRESSION', 'CUSTOMSCRIPT'].includes(
        columnItem?.formatData?.formatterName
      )
        ? {
          index,
          rowRecord: record,
          value: oriValue
        }
        : oriValue;
      if (columnItem?.formatData?.formatterName === 'KEYMAP') {
        oriValue = env.i18n(genFormatting(columnItem.formatData)(valueToBeFormat));
      } else {
        oriValue = genFormatting(columnItem.formatData)(valueToBeFormat);
      }
    }

    // 如果是插槽，则不转成字符串
    if (columnItem?.contentType === ContentTypeEnum.SlotItem) {
      return oriValue;
    }

    let value = oriValue;

    try {
      value =
        value !== null && ['object', 'function', 'boolean'].includes(typeof value)
          ? JSON.stringify(value)
          : value;
    } catch (e) {
      console.error('JSON.stringify失败', value, e);
      return value;
    }
    return value;
  }, [props.value, columnItem?.formatData, columnItem?.contentType, record, index, env.edit]);

  switch (columnItem?.contentType) {
    case ContentTypeEnum.Text:
      if (columnItem.ellipsis && String(value)?.trim()?.length > 0) {
        return (
          <span className={css.ellipsisWrap} title={value}>{value}</span>
        );
        // return (
        //   <Tooltip placement="topLeft" title={value}>
        //     <span className={css.ellipsisWrap}>{value}</span>
        //   </Tooltip>
        // );
      } else {
        return value ?? null;
      }
    case ContentTypeEnum.Image:
      if (value) {
        let normalizedValue = value
        try {
          if (typeof value === 'string') {
            normalizedValue = JSON.parse(value)
          }
        } catch (e) {}
        if (Array.isArray(normalizedValue)) {
          return (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap',
            }}>
              {
                normalizedValue.map((item, index) => {
                  const url = item?.url || item;
                  return (
                    <Image
                      height={80}
                      width={80}
                      src={url}
                      key={index}
                    />
                  );
                })
              }
            </div>
          );
        }
        return (
          <Image
            height={80}
            width={80}
            src={normalizedValue}
          />
        );
      } else {
        return value ?? null;
      }
    case ContentTypeEnum.Link:
      if (value) {
        let normalizedValue = value
        try {
          if (typeof value === 'string') {
            normalizedValue = JSON.parse(value)
          }
        } catch (e) {}
        if (Array.isArray(normalizedValue)) {
          return (
            <div className={columnItem.ellipsis ? css.ellipsisWrap : ''}>
              {
                normalizedValue.map((item, index) => {
                  const url = item?.url || item;
                  return (
                    <a href={url} target="_blank" key={index}>{url}</a>
                  );
                })
              }
            </div>
          );
        }
        if (columnItem.ellipsis && String(normalizedValue)?.trim()?.length > 0) {
          return (
            <a href={normalizedValue} target="_blank" className={css.ellipsisWrap}>{normalizedValue}</a>
          );
        }
        return (
          <a href={normalizedValue} target="_blank">{normalizedValue}</a>
        );
      } else {
        return value ?? null;
      }
    case ContentTypeEnum.Switch:
      console.log('swtich', value)
      return <Switch 
      defaultChecked={value}  
      onChange={(checked: boolean) => {
        outputs[`${OutputIds.CELL_SWITCH_CLICK}_${colKey}`]({ 
          record, 
          index, 
          dataIndex: columnItem?.dataIndex, 
          checked 
        });
      }}/>
    case ContentTypeEnum.SlotItem:
      return (
        <TableContext.Consumer>
          {({ slots }) => {
            return (
              <SlotRender
                rowKey={data.rowKey || DefaultRowKey}
                value={value}
                record={record}
                slotId={columnItem.slotId}
                keepDataIndex={columnItem.keepDataIndex}
                colKey={colKey}
                colIndex={index}
                slots={slots}
                isEdit={env.edit}
              />
            );
          }}
        </TableContext.Consumer>
      );
    default:
      return value ?? null;
  }
}

export default ColumnRender;
