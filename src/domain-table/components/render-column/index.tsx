import React, { FC, useCallback, useEffect, useState } from 'react';
import { Typography } from 'antd';

interface RenderColumnProps {
  item: any;
  value: any;
  columnKey: string;
  columnWidth: number;
  ellipsis: boolean;
  columnWidthMap: Record<string, number>;
}

const { Paragraph } = Typography;
const RenderColumn: FC<RenderColumnProps> = (props) => {
  const { value, columnKey, columnWidth, ellipsis, columnWidthMap } = props;
  const [width, setWidth] = useState(columnWidth);
  const [curEllipsis, setCurEllipsis] = useState(ellipsis);

  const ref = useCallback((ref: HTMLDivElement) => {
    if (ref) {
      columnWidthMap && (columnWidthMap[columnKey] = ref.clientWidth);
      setWidth(ref.clientWidth);
    }
  }, []);

  useEffect(() => {
    setCurEllipsis(ellipsis);
  }, [ellipsis]);

  return !width ? (
    <div style={{ width: '100%' }} ref={ref}></div>
  ) : (
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
        <span style={{ color: '#1890ff', marginLeft: '4px' }} onClick={() => setCurEllipsis(true)}>
          收起
        </span>
      ) : null}
    </Paragraph>
  );
};

export default RenderColumn;
