import React, { FC, useCallback, useEffect, useState } from 'react';
import { Typography, Image } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';
import { Field } from '../../type';
import { FieldBizType, TableRenderType } from '../../constants';
import { safeParse } from '../../util';
import { InputIds } from '../../constants';

interface RenderColumnProps {
  item: any;
  value: any;
  columnKey: string;
  columnWidth: number;
  ellipsis: boolean;
  field: Field;
  columnWidthMap: Record<string, number>;
  slots: any;
  colIndex: number;
}

const { Paragraph } = Typography;
const RenderColumn: FC<RenderColumnProps> = (props) => {
  const { item, value, columnKey, columnWidth, ellipsis, columnWidthMap, field, colIndex, slots } =
    props;
  const [width, setWidth] = useState(columnWidth);
  const [curEllipsis, setCurEllipsis] = useState(ellipsis);

  const ref = useCallback((ref: HTMLDivElement) => {
    if (ref) {
      columnWidthMap && (columnWidthMap[columnKey] = ref.clientWidth);
      setWidth(ref.clientWidth);
    }
  }, []);

  const renderColumn = () => {
    if (!field.tableInfo.renderType || field.tableInfo.renderType === TableRenderType.NORMAL) {
      if (field.bizType === FieldBizType.IMAGE) {
        const list = value ? safeParse(value, []) : [];
        return list.map((item, index) => {
          const url = item?.url || (String(item).startsWith('http') ? item : '');

          return (
            <Image
              key={index}
              height={100}
              src={url}
              fallback="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHZlcnNpb249IjEuMSIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik05NDIgOTE2LjZIODMuOWE3OS4xIDc5LjEgMCAwIDEtNzktNzlWMTg2YTc5LjEgNzkuMSAwIDAgMSA3OS03OUg5NDJhNzkuMSA3OS4xIDAgMCAxIDc5IDc5djY1MS42YTc5LjEgNzkuMSAwIDAgMS03OSA3OXpNODMuOSAxNjguNjVBMTcuNTcgMTcuNTcgMCAwIDAgNjYuNTYgMTg2djY1MS42YTE3LjU3IDE3LjU3IDAgMCAwIDE3LjM0IDE3LjMzSDk0MmExNy41NyAxNy41NyAwIDAgMCAxNy4zNC0xNy4zNFYxODZBMTcuNTcgMTcuNTcgMCAwIDAgOTQyIDE2OC42NXoiIGZpbGw9IiM1NTU1NTUiLz48cGF0aCBkPSJNMjEyLjcyIDQxMi43M2E5MiA5MiAwIDEgMSA5Mi05MiA5Mi4xIDkyLjEgMCAwIDEtOTIgOTJ6IG0wLTEyMGEyOCAyOCAwIDEgMCAyOCAyOCAyOCAyOCAwIDAgMC0yOC0yOHpNNDQuNjkgNzQxLjIzQTMyIDMyIDAgMCAxIDI1IDY4NGwyMzYuMjMtMTg0LjU5YzM0LjQ0LTI2LjkyIDg1Ljk0LTI0LjEgMTE3LjI0IDYuNDJMNTIwLjcgNjQ0LjUxYTMyIDMyIDAgMSAxLTQ0LjcgNDUuODJMMzMzLjc5IDU1MS42NmMtOC4yNi04LjA2LTI0LjA2LTguOTMtMzMuMTYtMS44Mkw2NC4zNyA3MzQuNDVhMzEuODQgMzEuODQgMCAwIDEtMTkuNjggNi43OHoiIGZpbGw9IiM1NTU1NTUiLz48cGF0aCBkPSJNOTg2LjMyIDgxMi4xMmEzMiAzMiAwIDAgMS0yOC40Ny0xNy4zNkw3ODIuNDEgNDU0LjE4bC0wLjE3LTAuMzZhMjIgMjIgMCAwIDAtMzQuMi03LjA3bC0yMjYuMjkgMjQyLjVBMzIgMzIgMCAxIDEgNDc1IDY0NS41OWwyMjcuOS0yNDQuMjcgMC44LTAuNzVhODYgODYgMCAwIDEgMTM1Ljk1IDI1bDE3NS4wOSAzMzkuOTJhMzIgMzIgMCAwIDEtMjguNDIgNDYuNjZ6IiBmaWxsPSIjNTU1NTU1Ii8+PC9zdmc+"
            />
          );
        });
      } else if (field.bizType === FieldBizType.APPEND_FILE) {
        const list = value ? safeParse(value, []) : [];
        return list.map((item, index) => {
          const url = item?.url || (String(item).startsWith('http') ? item : '');
          const name = item?.name || `附件${index + 1}`;

          return (
            <div
              key={index}
              onClick={url ? () => window.open(url, '_blank') : undefined}
              style={{
                width,
                wordBreak: 'break-all',
                color: '#1890ff',
                cursor: 'pointer'
              }}
            >
              <PaperClipOutlined style={{ marginRight: '2px' }} />
              {name}
            </div>
          );
        });
      } else {
        return (
          <Paragraph
            style={{ width }}
            key={String(curEllipsis)}
            ellipsis={
              curEllipsis
                ? {
                    expandable: true,
                    symbol: '展开',
                    onExpand: () => setCurEllipsis(false)
                  }
                : false
            }
          >
            {value}
            {ellipsis && !curEllipsis ? (
              <span
                style={{ color: '#1890ff', marginLeft: '4px' }}
                onClick={() => setCurEllipsis(true)}
              >
                收起
              </span>
            ) : null}
          </Paragraph>
        );
      }
    } else {
      const slotId = field.tableInfo.slotId;

      if (!slotId || !slots[slotId]?.render) {
        return null;
      } else {
        return slots[slotId]?.render({
          inputValues: {
            [InputIds.SLOT_ROW_RECORD]: { ...item },
            [InputIds.INDEX]: colIndex
          },
          key: `${InputIds.SLOT_ROW_RECORD}-${colIndex}-${columnKey}`
        });
      }
    }
  };

  useEffect(() => {
    setCurEllipsis(ellipsis);
  }, [ellipsis]);

  return !width ? <div style={{ width: '100%' }} ref={ref}></div> : renderColumn();
};

export default RenderColumn;
