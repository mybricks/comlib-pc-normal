import { useEffect, useRef, useState } from 'react';
import { runJs, utils } from '@fangzhou/com-utils';
import { Data } from './constants';

export default function (props: RuntimeParams<Data>) {
  const { env, data, slots, inputs } = props;
  const { sourceSlotKey, targetSlotKey, adapterCode } = data;
  const slotRef = useRef<any>({});

  const slotRefFnExce = () => {
    if (slotRef.current.fns && slotRef.current.ready) {
      slotRef.current.fns.forEach((fn) => {
        if (fn && typeof fn === 'function') {
          fn(slotRef.current.value);
        }
      });
    }
  };
  useEffect(() => {
    if (env.runtime) {
      inputs[sourceSlotKey] &&
        inputs[sourceSlotKey]((val) => {
          slotRef.current.ready = true;
          let tempVal = val;
          if (adapterCode) {
            tempVal = runJs(adapterCode, [
              { props: val, context: { utils, callService: env.callService } }
            ],{ env });
            if (typeof tempVal?.then === 'function') {
              tempVal.then((res) => {
                slotRef.current.value = res;
                slotRefFnExce();
              });
              return;
            }
          }
          slotRef.current.value = tempVal;
          slotRefFnExce();
        });
    }
  }, []);

  return (
    slots['item'] &&
    slots['item'].render({
      inputs: {
        [targetSlotKey](fn) {
          if (!slotRef.current.fns) {
            slotRef.current.fns = [];
          }
          if (!slotRef.current.fns.includes(fn)) {
            slotRef.current.fns.push(fn);
          }
          slotRefFnExce();
        }
      }
    })
  );
}
