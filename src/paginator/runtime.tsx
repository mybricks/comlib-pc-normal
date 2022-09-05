import React, { useEffect } from 'react';
import { Pagination } from 'antd';
import { Data, InputIds, OutputIds, SizeTypeEnum, templateRender } from './constants';

export default (props: RuntimeParams<Data>) => {
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

  const setTotal = (total: number) => {
    if (typeof total === 'number') {
      data.total = total;
    }
  };
  const setPageNum = (pageNum: number) => {
    if (typeof pageNum === 'number') {
      data.current = pageNum;
    }
  };
  const setDisable = () => {
    data.disabled = true;
  };
  const setEnable = () => {
    data.disabled = false;
  };

  useEffect(() => {
    if (env.runtime) {
      inputs[InputIds.SetTotal](setTotal);
      inputs[InputIds.SetPageNum](setPageNum);
      inputs[InputIds.GetPageInfo]((val, relOutputs) => {
        relOutputs[OutputIds.GetPageInfo](data.currentPage);
      });

      inputs[InputIds.SetDisable] && inputs[InputIds.SetDisable](setDisable);
      inputs[InputIds.SetEnable] && inputs[InputIds.SetEnable](setEnable);
    }
  }, []);

  const onChange = (pageNum: number, pageSize: number) => {
    data.currentPage = {
      pageNum,
      pageSize
    };
    setPageNum(pageNum);
    outputs[OutputIds.PageChange](data.currentPage);
  };

  const totalText = (total: number, range: number[]) => {
    return templateRender(text, { total, start: range[0], end: range[1] });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: align
      }}
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
        size={size === SizeTypeEnum.Simple ? SizeTypeEnum.Default : size}
        simple={size === SizeTypeEnum.Simple}
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
