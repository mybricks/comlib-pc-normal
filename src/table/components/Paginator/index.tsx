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
  containerRef?: React.RefObject<HTMLDivElement>;
  config: any;
}
export default (props: Props) => {
  const { data, inputs, outputs, env, containerRef, config } = props;
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

  const target = containerRef?.current?.querySelector?.('div.ant-table-body') as HTMLDivElement;

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

  // IO串行处理
  const handleOutputFn = (relOutputs: { [x: string]: any }, OutputId: string, val: any) => {
    const outputFn = relOutputs?.[OutputId] || outputs[OutputId];
    if (outputFn) {
      outputFn(val);
    }
  };

  useEffect(() => {
    if (env.runtime) {
      data.total = 0;
      data.current = 1;
      inputs[InputIds.SetTotal]((val: number, relOutputs: any) => {
        if (typeof val === 'number') {
          data.total = val;
        }
        handleOutputFn(relOutputs, OutputIds.SetTotal, val);
      });
      inputs[InputIds.SetPageNum]((val: number, relOutputs: any) => {
        setPageNum(val);
        data.currentPage.pageNum = val;
        relOutputs[OutputIds.SetPageNumFinish]?.(val);
      });
      inputs[InputIds.GetPageInfo]((val: any, relOutputs: any) => {
        relOutputs[OutputIds.GetPageInfo](data.currentPage);
      });

      inputs[InputIds.SetDisable] &&
        inputs[InputIds.SetDisable]((val: any, relOutputs: any) => {
          data.disabled = true;
          handleOutputFn(relOutputs, OutputIds.SetDisable, val);
        });
      inputs[InputIds.SetEnable] &&
        inputs[InputIds.SetEnable]((val: any, relOutputs: any) => {
          data.disabled = false;
          handleOutputFn(relOutputs, OutputIds.SetEnable, val);
        });
    }
  }, []);

  const onChange = (pageNum: number, pageSize: number) => {
    if (env.runtime) {
      data.currentPage = {
        pageNum,
        pageSize
      };
      if (config.scrollToFirstRowOnChange && containerRef) {
        target.scrollTop = 0;
      }
      setPageSize(pageSize);
      setPageNum(pageNum);
      outputs[OutputIds.PageChange](data.currentPage);
      // props.parentSlot?._inputs['onPageChange']?.({ value: data.currentPage });
    }
  };

  const totalText = (total: number, range: number[]) => {
    const content = env.i18n(text)
    return templateRender(content, { total, start: range[0], end: range[1] })
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
        className={disabled ? 'paginationDisable' : undefined}
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
