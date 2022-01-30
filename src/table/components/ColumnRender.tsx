import React from 'react';
import { Badge, message } from 'antd';
import copy from 'copy-to-clipboard';
import { getTemplateRenderScript } from '../utils';
import { IColumn } from '../types';
import ActionBtns from './ActionBtns';
import TagRender from './Tag';
import LinkRender from './Link';
import ImageRender from './Image';
import InputRender from './Input';
import css from '../runtime.less';

interface ColumnRenderProps {
  columnItem: IColumn;
  value: any;
  record: any;
  index: number;
  colIndex: number;
  env: Env;
  slots: any;
  outputs: any;
}

export default function ColumnRender({
  columnItem,
  value,
  record,
  index,
  colIndex,
  env,
  slots,
  outputs
}: ColumnRenderProps) {
  if (columnItem.isMapping && columnItem.mappingEnum) {
    value = columnItem.mappingEnum[value] || value;
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

  const SlotItemRender = slots && slots[columnItem?.slotId]?.render;

  switch (columnItem.contentType) {
    case 'text':
      return columnItem.supportCopy ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '8px' }}>{value}</span>
          <span onClick={handleCopy} className={css.copyStyle} />
        </div>
      ) : columnItem.keepWordWrap ? (
        <span style={{ whiteSpace: 'pre-wrap' }}>{value}</span>
      ) : (
        value
      );
    case 'color':
      if (!columnItem.colorEnum) {
        columnItem.colorEnum = {};
      }
      return (
        <span
          style={{
            color: columnItem.colorEnum[record[columnItem.dataIndex]] || '#333'
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
        <Badge
          color={columnItem.colorEnum[record[columnItem.dataIndex]] || '#333'}
          text={value}
        />
      );
    case 'link':
      return (
        <LinkRender value={value} columnItem={columnItem} record={record} />
      );
    case 'image':
      return (
        <ImageRender value={value} columnItem={columnItem} record={record} />
      );
    case 'tag':
      return <TagRender value={value} columnItem={columnItem} />;
    case 'input':
      return (
        <InputRender
          value={value}
          columnItem={columnItem}
          record={record}
          env={env}
        />
      );
    case 'slotItem':
      return (
        <div key={record.uuid}>
          {SlotItemRender ? (
            <SlotItemRender
              inputs={{
                slotProps(fn) {
                  fn({
                    value,
                    record
                  });
                },
                install(fn) {
                  fn({
                    // TODO：过渡方案，后续只传递value, record
                    ...record,
                    value,
                    record
                  });
                }
              }}
              outputs={{
                onChange(val) {}
              }}
            />
          ) : null}
        </div>
      );
    // case 'progress':
    //   let percent = value
    //   if (typeof value !== 'number') {
    //     percent = 0
    //   }
    //   const status = columnItem.progressConfig?.statusKeyName ? record[columnItem.progressConfig.statusKeyName] : void 0
    //   return <Progress percent={percent} status={status} />
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
            if (isHiddenScript) {
              isHidden = eval(getTemplateRenderScript(isHiddenScript))(record);
            }
            if (tempMaxToEllipsis < maxToEllipsis) {
              maxToEllipsisIdx += 1;
              if (!isHidden) {
                tempMaxToEllipsis += 1;
              }
            }
          } catch (e) {
            console.log(e);
          }
        });
        ellipsisActionBtns = (columnItem.actionBtns || []).slice(
          maxToEllipsisIdx
        );
        actionBtns = (columnItem.actionBtns || []).slice(0, maxToEllipsisIdx);
      }
      return (
        <ActionBtns
          useBtnMargin={true}
          colIndex={colIndex}
          actionBtns={actionBtns}
          record={record}
          ellipsisActionBtns={ellipsisActionBtns}
          dropdownProps={dropdownProps}
        />
      );
    // case 'custom':
      // try {
      //   const script = decodeURIComponent(columnItem.customRenderCode).replace(
      //     /export.*default.*function/,
      //     'function _RT_ '
      //   );
      //   const output = Babel.transform(
      //     `(${script})`,
      //     {
      //       presets: ['es2015', 'react'],
      //     }
      //   ).code;
      //   const fn = eval(output);
      //   if (fn) {
      //     return (
      //       <ErrorBoundary>
      //         {fn({ value, record, context: { callService: env.callService, utils }, uiLibs: MUI })}
      //       </ErrorBoundary>
      //     );
      //   }
      // } catch (e) {
      //   console.error('自定义渲染错误', e);
      // }
    // if (tableContent.outputs && columnItem.fns) {
    //   let res;
    //   const script = columnItem.fns.script || '';
    //   if (!script) {
    //     return value;
    //   }
    //   try {
    //     const evalScript = getScratchScript(columnItem.fns);
    //     const validatorFn = eval(evalScript);
    //     const rowInput = {
    //       value,
    //       record,
    //       index
    //     };
    //     const scratchBlocks = validatorFn(rowInput) || [];
    //     res = (
    //       <ColumnCustom
    //         scratchBlocks={[...scratchBlocks]}
    //         record={record}
    //         env={tableContent.env}
    //         outputs={tableContent.outputs}
    //         direction={columnItem.columnDirection}
    //       />
    //     );
    //   } catch (e) {
    //     res = 'Scratch错误，请检查';
    //     console.error(e);
    //   }
    //   return res;
    // }
    default:
      return value;
  }
}
