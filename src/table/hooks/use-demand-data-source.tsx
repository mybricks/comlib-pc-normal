import React, { useState, useEffect, useRef } from 'react';

/**
 * 按需加载表格数据源
 * 滚动到底部 300px 时加载新数据
 * @param dataSource 当前完整的表格数据源
 * @param ref 当前表格 div 容器的 ref
 * @returns 当前需要的数据源
 */
function useDemandDataSource<T>(dataSource: T, ref: React.RefObject<HTMLDivElement>): T {
  const [demandDataSource, setDemandDataSource] = useState<any[]>([]);
  const demandDataSourceRef = useRef(demandDataSource);
  demandDataSourceRef.current = demandDataSource;

  const dataSourceRef = useRef<any[]>([]);
  dataSourceRef.current = dataSource as any[];

  /**
   * 初始化
   * 加载前 20 条数据
   */
  useEffect(() => {
    if (!Array.isArray(dataSource)) return;

    setDemandDataSource(dataSource.slice(0, 20));
  }, [dataSource]);

  const isRenderFinish = (ds = demandDataSourceRef.current) => {
    const bodyDiv = ref.current?.querySelector('.ant-table-body');
    if (!bodyDiv) return;

    // 是否渲染完成，即已经渲染出了所有行
    return bodyDiv.querySelectorAll('tbody tr.ant-table-row').length === ds.length;
  };

  /**
   * 更新函数
   * 往后加载 20 条数据
   */
  const update = () => {
    setDemandDataSource((preDataSource) => {
      // 如果上次的数据源还没渲染完成，就不补充新的数据了
      if (!isRenderFinish(preDataSource)) return preDataSource;

      if (!Array.isArray(dataSourceRef.current)) return preDataSource;
      const newData = dataSourceRef.current.slice(preDataSource.length, preDataSource.length + 20);
      if (!newData.length) return preDataSource;
      return [...preDataSource, ...newData];
    });
  };

  /**
   * 监听当前提供的数据源变化
   * 如果提供的数据源不足以填满当前表格可视区域，则自动加载新数据
   */
  useEffect(() => {
    let alreadyUpdate = false;

    // 每隔 300ms 检查一次，判断是否需要加载新数据
    const interval = setInterval(() => {
      const bodyDiv = ref.current?.querySelector('.ant-table-body');
      if (!bodyDiv) return;

      // 是否渲染完成，即已经渲染出了所有行
      const renderFinish = isRenderFinish();
      // 是否有滚动条
      const hasVerticalScrollbar = bodyDiv.scrollHeight > bodyDiv.clientHeight;

      // 如果有滚动条则说明不需要加载新数据了，清空掉计时器
      if (hasVerticalScrollbar) clearInterval(interval);

      // 如果渲染完成却没有滚动条，说明需要加载新数据，并且只加载一次
      if (renderFinish && !hasVerticalScrollbar && !alreadyUpdate) {
        alreadyUpdate = true;
        update();
      }
    }, 300);

    return () => {
      clearInterval(interval);
    };
  }, [demandDataSource]);

  /**
   * 监听滚动事件
   * 滚动条快到底部时自动加载新数据
   */
  useEffect(() => {
    const scrollFn = (e: Event) => {
      if (demandDataSourceRef.current.length >= dataSourceRef.current.length) return;

      const { target } = e;
      if (!target) return;
      // @ts-ignore scrollTop\clientHeight\scrollHeight 这几个属性都是存在的，ts提供的类型有误
      if (target.scrollTop + target.clientHeight > target.scrollHeight - 300) {
        update();
      }
    };

    ref.current?.querySelector('.ant-table-body')?.addEventListener('scroll', scrollFn);
    return () => {
      ref.current?.querySelector('.ant-table-body')?.removeEventListener('scroll', scrollFn);
    };
  }, []);

  return demandDataSource as T;
}

export default useDemandDataSource;
