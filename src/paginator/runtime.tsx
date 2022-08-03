import React, { CSSProperties, useEffect } from 'react';
import { Pagination } from 'antd';
import { Data } from './constants';

const RuntimeRender = (props: RuntimeParams<Data>) => {
  const { data, inputs, outputs, env } = props;
  const {
    total,
    text,
    current,
    disabled,
    defaultPageSize,
    size,
    align,
    showQuickJumper,
    showSizeChanger,
    pageSizeOptions,
    hideOnSinglePage
  } = data;
  const wrapStyle: CSSProperties = {
    display: 'flex',
    // height: showSizeChanger ? `${pageSizeOptions.length * 32 + 32}px` : '100%',
    justifyContent: align
  };

  const setTotal = (total: number) => {
    data.total = total;
  };
  const setPageNum = (pageNum: number) => {
    data.current = pageNum;
  };
  const setDisable = () => {
    data.disabled = true;
  };
  const setEnable = () => {
    data.disabled = false;
  };
  useEffect(() => {
    if (env.runtime) {
      inputs['total'] && inputs['total'](setTotal);
      inputs['pageNum'] && inputs['pageNum'](setPageNum);
      inputs['disable'] && inputs['disable'](setDisable);
      inputs['enable'] && inputs['enable'](setEnable);
      inputs['currentPage'] && inputs['currentPage']((val, relOutputs) => {
        relOutputs['output'](data.currentPage);
      });
    }
  }, []);

  const onChange = (pageNum: number, pageSize: number) => {
    data.currentPage = {
      pageNum,
      pageSize
    };
    outputs['pageChange'] && outputs['pageChange'](data.currentPage);
    setPageNum(pageNum);
  };

  const totalText = (total: number, range: number[]) => {
    return env.i18n({
      text,
      params: { total, start: range[0], end: range[1] }
    });
  };

  return (
    <div
      style={wrapStyle}
      ref={(node) => {
        // hack
        if (node?.parentElement?.style) {
          node.parentElement.style.overflow = 'unset';
        }
      }}
    >
      <Pagination
        total={total}
        showTotal={totalText}
        current={current}
        defaultPageSize={defaultPageSize}
        size={size === 'simple' ? 'default' : size}
        simple={size === 'simple'}
        showQuickJumper={showQuickJumper}
        showSizeChanger={showSizeChanger}
        pageSizeOptions={pageSizeOptions}
        hideOnSinglePage={showSizeChanger ? false : hideOnSinglePage}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};

export default function (props: RuntimeParams<Data>) {
  return <RuntimeRender {...props} />;
}
