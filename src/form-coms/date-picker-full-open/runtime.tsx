import React, { useEffect, useRef, useState } from 'react';
import { ConfigProvider, DatePicker } from 'antd';
import DatePickerRuntime, { Data } from '../date-picker/runtime';
import zhCN from 'antd/es/locale/zh_CN';
import css from './runtime.less';

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, env, id, slots, style } = props;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  return (
    <ConfigProvider locale={zhCN}>
      {data.isEditable ? (
        <div className={css.wrapper} ref={wrapperRef}>
          <div onClick={() => setVisible(true)}>test</div>
          <div style={{ width: 0, height: 0, overflow: 'hidden', opacity: 0 }}>
            <DatePicker
              open={visible}
              className={css.datePicker}
              inputReadOnly
              panelRender={(panel) => <div className={css.datePickerWrapper}>{panel}</div>}
              getPopupContainer={() => document.body}
              transitionName=""
            />
          </div>
        </div>
      ) : (
        <span></span>
      )}
    </ConfigProvider>
  );
}
