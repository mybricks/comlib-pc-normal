import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Data, Status } from './type';
import { InputIds, OutputIds } from './constants';

export default function ({ env, data, inputs, outputs, slots }: RuntimeParams<Data>) {
  const [value, setValue] = useState(data.useDefaultStatus ? data.statusList[0].value : null);
  const valueRef = useRef(value);

  useEffect(() => {
    inputs[InputIds.SetValue]((val, relOutput) => {
      changeValue(val);
      relOutput[OutputIds.SetValueDone](val);
    });
    inputs[InputIds.GetValue]((val, relOutput) => {
      relOutput[OutputIds.ReturnValue](valueRef.current);
    });
  }, []);

  const changeValue = useCallback((val) => {
    valueRef.current = val;
    setValue(val);
    outputs[OutputIds.OnChange](val);
  }, []);
  useEffect(() => {
    if(!data._editSelectId_ || !(data.statusList || []).some(i => i.id === data._editSelectId_)) {
      data._editSelectId_ = data.statusList[0]?.id
    }
  }, [data.statusList, data._editSelectId_])
  /** 搭建态选中 */
  const isEditActive = (item ) => {
    return  data._editSelectId_ === item.id || data._editSelectId_ === item._id
  }

  /** 搭建态 */
  if (env.edit) {
    return (
      <div
        style={{
          display: 'flex'
        }}
      >
        {data.statusList.map((status) => {
          return status.visible && isEditActive(status) ? (
            <div
              style={{
                flex: 'auto'
              }}
            >
              {slots[status.id]?.render()}
            </div>
          ) : null;
        })}
      </div>
    );
  }

  /** 运行时 */
  const showStatus = data.statusList.find((i) => i.value === value);
  return showStatus ? (
    <>
      {slots[showStatus.id]?.render({
        key: showStatus.id
      })}
    </>
  ) : null;
}
