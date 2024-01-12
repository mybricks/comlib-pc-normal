import React, { useEffect, useRef, useState } from 'react';
import DatePickerRuntime, { Data } from '../date-picker/runtime';
import { SlotIds } from '../date-picker/constant';
import css from './runtime.less';

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, env, id, slots, style } = props;

  const wrapperRef = useRef<HTMLDivElement>(null);

  /**
   * 获取下拉面板的 div DOM
   */
  function getDropDownDiv() {
    let res = document.querySelector(`.drop_down_${id}`) as HTMLDivElement;
    if (res) return res;

    const allDropDown = document
      .querySelector('#_mybricks-geo-webview_')
      ?.shadowRoot?.querySelectorAll(`.drop_down_${id}`) as NodeListOf<HTMLDivElement>;

    if (!allDropDown?.length) return;

    if (!!env.runtime?.debug) {
      for (let i = 0; i < allDropDown.length; i++) {
        const node = allDropDown[i];
        if (node.className.includes('__env_debug')) return node;
      }
    } else {
      for (let i = 0; i < allDropDown.length; i++) {
        const node = allDropDown[i];
        if (node.className.includes('__env_edit')) return node;
      }
    }
  }

  /** 更新日期选择框 wrapper 的高度 */
  const updateWrapperHeight = () => {
    const dropDownDiv = getDropDownDiv();

    const pickerInputHeight =
      wrapperRef.current?.querySelector('.ant-picker')?.getBoundingClientRect().height || 0;

    const dropDownHeight = dropDownDiv?.getBoundingClientRect().height || 0;

    setWrapperHeight(pickerInputHeight + dropDownHeight);
  };

  /**
   * 如果打开了配置「下拉面板宽度撑满」，在打开下拉面板时，将宽度配置为 datePicker 一样的宽度
   */
  useEffect(() => {
    // setTimeout 0 使得逻辑延后一个 tick，保证下拉面板已渲染
    setTimeout(() => {
      const dropDownDiv = getDropDownDiv();
      dropDownDiv?.style.setProperty(
        '--date-picker-width',
        `${wrapperRef.current?.getBoundingClientRect().width}px`
      );
    }, 0);
  }, [
    !!env.edit && style.width,
    !!env.edit && data.useCustomPanelHeader,
    !!env.edit && data.useCustomPanelFooter
  ]);

  /** datePicker 容器高度 */
  const [wrapperHeight, setWrapperHeight] = useState<number | undefined>(void 0);

  /**
   * 如果打开了配置「下拉面板常态展示」，在打开下拉面板时，使 datePicker 容器的高度包含下拉面板
   */
  useEffect(() => {
    setTimeout(() => updateWrapperHeight(), 0);
  }, [
    // 会影响高度的配置都监听一下
    !!env.edit && data.useCustomPanelHeader,
    !!env.edit && data.useCustomPanelFooter,
    !!env.edit && slots?.[SlotIds.DatePanelHeader]?.size,
    !!env.edit && slots?.[SlotIds.DatePanelFooter]?.size,
    !!env.edit && slots[SlotIds.DateCell]?.size,
    !!env.edit && data.showTime,
    !!env.edit && data.useCustomDateCell,
    !!env.edit && data.config.picker
  ]);

  return DatePickerRuntime({
    ...props,
    hyperExtends: {
      wrapperHeight,
      wrapperRef,
      fullOpen: true,
      dropdownClassName: `
        drop_down_${id}
        ${css.datePickerDropDownFullWidth}
        ${css.datePickerDropDownNotClose}
        ${!!env.runtime?.debug ? '__env_debug' : '__env_edit'}
        `
    }
  });
}
