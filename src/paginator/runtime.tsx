import React, { useEffect } from 'react';
import { Pagination } from 'antd';
import ConfigProvider from '../components/ConfigProvider';
import { Data, InputIds, OutputIds, SizeTypeEnum, templateRender } from './constants';
import { checkIfMobile } from '../utils';
import zhCN from 'antd/es/locale/zh_CN';

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
  const isMobile = checkIfMobile(env);
  const setPageNum = (pageNum: number) => {
    if (typeof pageNum === 'number') {
      data.current = pageNum;
    }
  };

  useEffect(() => {
    if (env.runtime) {
      data.total = 0;
      data.current = 1;
      inputs[InputIds.SetTotal]((val: number, relOutputs) => {
        if (typeof val === 'number') {
          data.total = val;
          relOutputs[OutputIds.SetTotalDone](val);
        }
      });
      inputs[InputIds.SetPageNum]((val, relOutputs) => {
        setPageNum(val);
        relOutputs[OutputIds.SetPageNumDone](val);
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
      setPageNum(pageNum);
      outputs[OutputIds.PageChange](data.currentPage);
    }
  };

  const totalText = (total: number, range: number[]) => {
    const content = env.i18n(text);

    return templateRender(content, { total, start: range[0], end: range[1] });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isMobile ? 'center' : align
      }}
      className={disabled ? 'paginationDisable' : undefined}
    >
      <ConfigProvider locale={env.vars?.locale}>
        <Pagination
          total={total}
          showTotal={totalText}
          current={current}
          defaultPageSize={defaultPageSize}
          size={size === SizeTypeEnum.Simple ? SizeTypeEnum.Default : size}
          simple={isMobile || size === SizeTypeEnum.Simple}
          showQuickJumper={showQuickJumper}
          showSizeChanger={showSizeChanger}
          pageSizeOptions={pageSizeOptions}
          hideOnSinglePage={env.edit || showSizeChanger ? false : hideOnSinglePage}
          onChange={onChange}
          disabled={disabled}
        />
      </ConfigProvider>
    </div>
  );
};
