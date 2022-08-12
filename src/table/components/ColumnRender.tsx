import React, { useState } from 'react';
import { Badge, Input, message, Switch } from 'antd';
import copy from 'copy-to-clipboard';
import { getTemplateRenderScript } from '../utils';
import { IColumn, MappingEnumOption } from '../types';
import ActionBtns from './ActionBtns';
import TagRender from './Tag';
import LinkRender from './Link';
import ImageRender from './Image';
import InputRender from './Input';
import DateRender from './Date';
import css from '../runtime.less';
import { typeCheck } from '../../utils';
import { setPath } from '../../utils/path';
import { OutputIds } from '../constants';
import { SystemEditLine } from '@ant-design/icons';

interface ColumnRenderProps {
  columnItem: IColumn;
  value: any;
  record: any;
  index: number;
  colIndex: number;
  env: Env;
  slots: any;
  outputs: any;
  tableContent: any;
  data: any;
}

export default function ColumnRender({
  columnItem,
  value,
  record,
  index,
  colIndex,
  env,
  slots,
  outputs,
  tableContent,
  data
}: ColumnRenderProps) {

  // 模板字符串处理
  const templateMap = {};
  if (columnItem.contentTemplate) {
    data.columns.forEach((col) => {
      if (Array.isArray(col.dataIndex)) {
        const dataIndex = col.dataIndex.join('.');
        let val = col.dataIndex.reduce((prev, next) => prev[next], record);
        // 列内容使用字段映射后的值生成
        // if (col.isMapping && col.mappingEnum) {
        //   val = col.mappingEnum[val] || val;
        // }
        templateMap[dataIndex] = typeCheck(val, ['ARRAY', 'OBJECT']) ? JSON.stringify(val) : (val == null ? '' : value);
      } else {
        const { dataIndex } = col;
        let val = record[dataIndex];
        // 列内容使用字段映射后的值生成
        // if (col.isMapping && col.mappingEnum) {
        //   val = col.mappingEnum[val] || val;
        // }
        templateMap[dataIndex] = typeCheck(val, ['ARRAY', 'OBJECT']) ? JSON.stringify(val) : (val == null ? '' : value);
      }
    });
    const processRecod = (obj, prefix = '') => {
      Object.entries(obj).forEach(([dataIndex, value]) => {
        if (typeCheck(value, 'OBJECT')) {
          processRecod(value, prefix + dataIndex + '.');
        } else {
          templateMap[`${prefix}${dataIndex}`] = value == null ? '' : value;
        }
      })
    }
    processRecod(record);
    if (columnItem.contentType !== 'date') {
      value = Object.keys(templateMap).reduce((prev, next) => prev.replace(new RegExp('{' + next + '}', 'g'), templateMap[next]), columnItem.contentTemplate);
    }
  }

  const oriValue = value;

  if (columnItem.isMapping && columnItem.mappingEnum) {
    if (value === undefined) {
      value = columnItem.mappingEnum[MappingEnumOption.NOT_EXIST];
    } else if (value === '') {
      value = columnItem.mappingEnum[MappingEnumOption.EMPTY_STRING];
    } else {
      value = columnItem.mappingEnum[value] === undefined ? value : columnItem.mappingEnum[value];
    }
  }
  try {
    value =
      value && ['object', 'function'].includes(typeof value)
        ? JSON.stringify(value)
        : value;
  } catch (e) {
    console.error('JSON.stringify失败', value, e);
  }
  const handleCopy = () => {
    copy(value);
    message.success('复制成功');
  };

  // const SlotItemRender = slots && slots[columnItem?.slotId]?.render;

  const [inputValue, setInputValue] = useState(value);
  switch (columnItem.contentType) {
    case 'text':
      const {
        supportCopy,
        supportEdit,
        ellipsis,
        keepWordWrap
      } = columnItem;

      // 单元格编辑
      const { uuid } = record;
      const { key } = columnItem;
      const isEditing = data.isEditing === `${uuid}-${key}`;
      const editDone = ({ target }) => {
        if (data.isEditing) {
          record = setPath(record, key, target.value);
          data.isEditing = '';
          env.runtime && outputs[OutputIds.MODIFY_CELL](record);
        }
      };
      const EditInput = keepWordWrap ? Input.TextArea : Input;
      const editInput = <EditInput
        style={{
          display: isEditing ? void 0 : 'none',
        }}
        size='small'
        value={inputValue}
        autoSize={keepWordWrap}
        onPressEnter={(e) => {
          const { metaKey, ctrlKey, shiftKey, target } = e;
          if (!keepWordWrap || (!metaKey && !ctrlKey && !shiftKey)) {
            editDone(e);
          } else {
            !shiftKey && (target.value = target.value + '\n');
            setInputValue(target.value);
          }
        }}
        onChange={({ target }) => {
          setInputValue(target.value);
        }}
        onBlur={editDone}
      />;
      const editIcon = <SystemEditLine
        style={{
          marginLeft: '8px',
          color: '#b5b5b5',
        }}
        onClick={(e) => {
          // e.stopPropagation();
          if (env.runtime) {
            data.isEditing = `${uuid}-${key}`;
          }
        }}
      />;

      const wrapperStyle: React.CSSProperties = {
        display: !isEditing ? 'inline-flex' : 'none',
        alignItems: 'center',
        width: '100%'
      },
        textProps = {
          style: {
            display: !isEditing ? void 0 : 'none',
            wordBreak: 'break-all' as any,
            whiteSpace: keepWordWrap ? 'pre-wrap' as any : void 0
          }
        };
      if (ellipsis) {
        textProps['className'] = css.ellipsisWrap;
      }
      return (supportCopy || supportEdit) ? (
        <>
          {editInput}
          <div style={wrapperStyle}>
            <span {...textProps}>{value}</span>
            {supportCopy && <span onClick={handleCopy} className={css.copyStyle} />}
            {supportEdit && editIcon}
          </div>
        </>
      ) : keepWordWrap ? (
        <span style={{ whiteSpace: 'pre-wrap' }}>{value}</span>
      ) : (
        <span className={ellipsis ? css.ellipsisWrap : null}>{value}</span>
      );
    case 'color':
      if (!columnItem.colorEnum) {
        columnItem.colorEnum = {};
      }
      return (
        <span
          style={{
            color: columnItem.colorEnum[oriValue] || '#333'
          }}
        >
          {value}
        </span>
      );
    case 'badge':
      if (!columnItem.colorEnum) {
        columnItem.colorEnum = {};
      }
      return (
        <Badge color={columnItem.colorEnum[oriValue] || '#333'} text={value} />
      );
    case 'link':
      return (
        <LinkRender
          value={value}
          columnItem={columnItem}
          record={record}
          tableContent={tableContent}
        />
      );
    case 'image':
      return (
        <ImageRender value={value} columnItem={columnItem} record={record} />
      );
    case 'tag':
      return <TagRender value={oriValue} columnItem={columnItem} />;
    case 'input':
      return (
        <InputRender
          value={value}
          columnItem={columnItem}
          record={record}
          env={env}
        />
      );
    case 'date':
      return (
        <DateRender
          value={oriValue}
          columnItem={columnItem}
          record={record}
          env={env}
          templateMap={columnItem.contentTemplate ? templateMap : void 0}
        />
      );
    case 'slotItem':
      return slots && slots[columnItem?.slotId]?.render
        ? slots[columnItem?.slotId]?.render({
          inputs: {
            slotProps(fn) {
              fn({
                value: oriValue,
                record
              });
            },
            install(fn) {
              fn({
                // TODO：过渡方案，后续只传递value, record
                ...record,
                value: oriValue,
                record
              });
            }
          },
          outputs: {
            onChange(val) { }
          }
        })
        : null;
    case 'action':
      const { maxToEllipsis, useEllipsis, ...dropdownProps } =
        columnItem.ellipsisActionBtnsConfig || {};
      let ellipsisActionBtns;
      let actionBtns = columnItem.actionBtns;
      if (env.runtime && useEllipsis) {
        let maxToEllipsisIdx = 0,
          tempMaxToEllipsis = 0;
        (columnItem.actionBtns || []).forEach((btn) => {
          const { isHiddenScript } = btn;
          try {
            let isHidden;
            if (isHiddenScript && env.runtime) {
              isHidden = eval(getTemplateRenderScript(isHiddenScript))(record);
            }
            if (tempMaxToEllipsis < maxToEllipsis) {
              maxToEllipsisIdx += 1;
              if (!isHidden) {
                tempMaxToEllipsis += 1;
              }
            }
          } catch (e) {
            // console.log(e);
          }
        });
        ellipsisActionBtns = (columnItem.actionBtns || []).slice(
          maxToEllipsisIdx
        );
        actionBtns = (columnItem.actionBtns || []).slice(0, maxToEllipsisIdx);
      }
      return (
        <ActionBtns
          isRowBtn={true}
          colIndex={colIndex}
          actionBtns={actionBtns}
          record={record}
          ellipsisActionBtns={ellipsisActionBtns}
          dropdownProps={dropdownProps}
          tableContent={tableContent}
        />
      );
    case 'switch':
      const cfg = {
        size: columnItem.switchConfig?.size,
        defaultChecked: false
      };
      if (env.runtime) {
        const { checkedScript } = columnItem?.switchConfig;
        if (checkedScript) {
          try {
            cfg.defaultChecked = eval(getTemplateRenderScript(checkedScript))(record);
          } catch (e) {
            // console.log(e);
          }
        }
      } else {
        cfg['disabled'] = true;
      }
      return (
        <Switch
          {...cfg}
          onChange={(checked) => {
            if (env.runtime) {
              outputs[columnItem?.switchConfig?.id]({ checked, record });
            }
          }}
        />
      );
    default:
      return value;
  }
}
