import { Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import css from './runtime.less';

const { Paragraph } = Typography;

export interface Data {
  content: string | undefined;
  expandRows: number | undefined;
}

export default function ({
  env,
  data,
  _inputs,
  inputs,
  _outputs,
  outputs,
  parentSlot,
  id,
  name
}: RuntimeParams<Data>) {
  const [isExpanded, setIsExpanded] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={contentRef}>
      <Paragraph
        ellipsis={
          isExpanded
            ? {
                rows: data.expandRows ?? 3,
                expandable: true,
                symbol: <span></span>,
                suffix: (
                  <a onClick={(e) => {
                    e.preventDefault();
                    setIsExpanded((v) => !v)
                  }}>
                    {isExpanded ? env.i18n('展开') : env.i18n('收起')}
                  </a>
                ) as any as string // 虽然类型只能是string，但是实测一个ReactNode也是可以渲染的
              }
            : false
        }
      >
        {data.content}
        {!isExpanded && <a onClick={(e) => {
          e.preventDefault();
          setIsExpanded((v) => !v)
        }}>{isExpanded ? '展开' : '收起'}</a>}
      </Paragraph>
    </div>
  );
}
