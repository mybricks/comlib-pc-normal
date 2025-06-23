import React, { useEffect, useRef, useState } from 'react';
import { DatePicker } from 'antd-mobile';
import { Data } from '../date-picker/runtime';
import zhCN from 'antd/es/locale/zh_CN';
import css from './runtime.less';

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, env, id, slots, style } = props;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  return (
    <div className={css.wrapper}>
      {data.isEditable ? (
        <div ref={wrapperRef}>
          <div onClick={() => setVisible(true)}>test</div>
          <DatePicker visible={visible} />
        </div>
      ) : (
        <span></span>
      )}
    </div>
  );
}
