import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Data, Status } from './type';
import { InputIds, OutputIds } from './constants';

export default function ({ env, data, inputs, outputs, slots }: RuntimeParams<Data>) {
  const [value, setValue] = useState(data.useDefaultStatus ? data.statusList[0].value : null);

  useEffect(() => {
    inputs[InputIds.SetValue]((val) => {
      changeValue(val);
    });
    inputs[InputIds.GetValue]((val, relOutput) => {
      relOutput[OutputIds.ReturnValue](value);
    });
  }, []);

  const changeValue = useCallback((val) => {
    setValue(val);
    outputs[OutputIds.OnChange](val);
  }, []);

  /** 搭建态 */
  if (env.edit) {
    return (
      <div
        style={{
          display: 'flex'
        }}
      >
        {data.statusList.map((status) => {
          return status.visible ? (
            <div
              style={{
                flex: 'auto'
              }}
            >
              {slots[status.id].render()}
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
      {slots[showStatus.id].render({
        key: showStatus.id
      })}
    </>
  ) : null;
}
