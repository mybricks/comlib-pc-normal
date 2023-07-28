// copy form src/pagination
import React, { useEffect } from 'react';
import { Pagination } from 'antd';
import { Data, InputIds, OutputIds, SizeTypeEnum, templateRender } from './constants';
import { checkIfMobile } from '../../../utils';

interface Props {
  env: Env;
  data: Data;
  inputs: any;
  outputs: any;
  parentSlot: any;
}
export default (props: Props) => {
  const { data, inputs, outputs, env } = props;
  const {
    total,
    text,
    current,
    disabled,
    pageSize,
    defaultPageSize,
    size,
    align,
    showQuickJumper,
    showSizeChanger,
    pageSizeOptions,
    hideOnSinglePage
  } = data;

  const isMobile = checkIfMobile(env);
  const setPageNum = (pageNum: number) => {
    if (typeof pageNum === 'number') {
      data.current = pageNum;
    }
  };
  const setPageSize = (pageSize: number) => {
    if (typeof pageSize === 'number') {
      data.pageSize = pageSize;
    }
  };

  useEffect(() => {
    if (env.runtime) {
      data.total = 0;
      data.current = 1;
      inputs[InputIds.SetTotal]((val: number) => {
        if (typeof val === 'number') {
          data.total = val;
        }
      });
      inputs[InputIds.SetPageNum]((val) => {
        setPageNum(val);
        data.currentPage.pageNum = val;
      });
      inputs[InputIds.GetPageInfo]((val, relOutputs) => {
        relOutputs[OutputIds.GetPageInfo](data.currentPage);
      });

      inputs[InputIds.SetDisable] &&
        inputs[InputIds.SetDisable](() => {
          data.disabled = true;
        });
      inputs[InputIds.SetEnable] &&
        inputs[InputIds.SetEnable](() => {
          data.disabled = false;
        });
    }
  }, []);

  const onChange = (pageNum: number, pageSize: number) => {
    if (env.runtime) {
      data.currentPage = {
        pageNum,
        pageSize
      };
      setPageSize(pageSize);
      setPageNum(pageNum);
      outputs[OutputIds.PageChange](data.currentPage);
      // props.parentSlot?._inputs['onPageChange']?.({ value: data.currentPage });
    }
  };

  const totalText = (total: number, range: number[]) => {
    return templateRender(text, { total, start: range[0], end: range[1] });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isMobile ? 'center' : align
      }}
    >
      <div
        data-table-pagination="pagination"
        style={{
          display: 'inline-block'
        }}
      >
        <Pagination
          total={total}
          showTotal={isMobile ? () => null : totalText}
          current={current}
          pageSize={(env.edit ? 10 : pageSize || defaultPageSize) || 1}
          // defaultPageSize={defaultPageSize}
          size={size === SizeTypeEnum.Simple ? SizeTypeEnum.Default : size}
          simple={isMobile || size === SizeTypeEnum.Simple}
          showQuickJumper={showQuickJumper}
          showSizeChanger={showSizeChanger}
          pageSizeOptions={pageSizeOptions}
          hideOnSinglePage={env.edit || showSizeChanger ? false : hideOnSinglePage}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};
