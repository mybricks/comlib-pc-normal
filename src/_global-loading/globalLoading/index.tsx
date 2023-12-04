import React from 'react';
import { Container, render } from 'react-dom';
import { Spin, SpinProps } from 'antd';
import css from './style.less';
import { getGlobalLoading } from '../runtime';

let divEle: Container | null;
const divEleID = 'global-loading';

/**
 * 全局loading
 * @function open 显示全局loading
 * @function close 关闭全局loading
 */
export const GlobalLoading = {
  /** 显示全局loading
   *  @param ladingText loading文案
   *  @param spinProps spin属性
   *  @returns 关闭全局loading回调
   */
  open: (ladingText?: string, spinProps?: SpinProps, targetDOM: HTMLElement = document.body) => {
    let globalLoading = getGlobalLoading(targetDOM);
    if (!!globalLoading) {
      return;
    }
    const { wrapperClassName, ...resProps } = spinProps || {};
    divEle = document.createElement('div');
    divEle.setAttribute('id', divEleID);
    const classList = [css.globalLoading];
    if (wrapperClassName) {
      classList.push(wrapperClassName);
    }
    divEle.setAttribute('class', classList.join(' '));
    targetDOM?.appendChild(divEle);
    render(<Spin tip={ladingText} size="large" {...(resProps || {})} />, divEle);
    return GlobalLoading.close;
  },
  /** 关闭全局loading */
  close: (canvasElement: HTMLElement) => {
    let globalLoading = getGlobalLoading(canvasElement);
    if (!!globalLoading) {
      globalLoading?.remove();
      divEle = null;
    }
  }
};
