import React, { useCallback, useEffect, useMemo } from 'react';
import { inputIds, slotKeys } from './const';
import css from './runtime.less';
import { Button } from 'antd';

export default function ({ env, data, slots, inputs, outputs }) {
  useEffect(() => {
    inputs[inputIds.更新数据]((ds) => {
      data.ds = ds;
    });
  }, []);
  const getRandomColor = useCallback(() => {
    return '#' + ('00000' + ((Math.random() * 0x1000000) << 0).toString(16)).substr(-6);
  }, []);
  const borderColors = useMemo(() => {
    return new Array(4).fill(null).map((i) => getRandomColor());
  }, []);
  return (
    <div style={{ border: '2px solid red', padding: 10 }}>
      <Button
        onClick={() => {
          const ds = new Array(3).fill(null).map((i) => Math.random().toFixed(2));
          data.ds = ds;
        }}
        type="primary"
      >
        更新数据
      </Button>
      <h1>不遍历：</h1>
      <div
        className={css.box}
        style={{
          borderColor: borderColors[0]
        }}
      >
        {slots[slotKeys['无key_无参数']].render()}
      </div>
      <div
        className={css.box}
        style={{
          borderColor: borderColors[1]
        }}
      >
        {slots[slotKeys['无key_参数']].render({
          inputValues: {
            index: data.ds?.[0] || Math.random().toFixed(2)
          }
        })}
      </div>
      <div
        className={css.box}
        style={{
          borderColor: borderColors[2]
        }}
      >
        {slots[slotKeys['key_无参数']].render({
          key: slotKeys['key_无参数']
        })}
      </div>
      <div
        className={css.box}
        style={{
          borderColor: borderColors[3]
        }}
      >
        {slots[slotKeys['key_参数']].render({
          key: slotKeys['key_参数'],
          inputValues: {
            index: data.ds?.[0] || Math.random().toFixed(2)
          }
        })}
      </div>
      <h1>遍历：</h1>
      <div
        className={css.wrapper}
        style={{
          borderColor: borderColors[0]
        }}
      >
        {(data.ds || new Array(3).fill(null)).map((item, i) => {
          return (
            <div className={css.item} key={i}>
              {slots[slotKeys['无key_无参数']].render()}
            </div>
          );
        })}
      </div>
      <div
        className={css.wrapper}
        style={{
          borderColor: borderColors[1]
        }}
      >
        {(data.ds || new Array(3).fill(null)).map((item, i) => {
          return (
            <div className={css.item} key={i}>
              {slots[slotKeys['无key_参数']].render({
                inputValues: {
                  index: item || i
                }
              })}
            </div>
          );
        })}
      </div>
      <div
        className={css.wrapper}
        style={{
          borderColor: borderColors[2]
        }}
      >
        {(data.ds || new Array(3).fill(null)).map((item, i) => {
          return (
            <div className={css.item} key={i}>
              {slots[slotKeys['key_无参数']].render({
                key: i
              })}
            </div>
          );
        })}
      </div>
      <div
        className={css.wrapper}
        style={{
          borderColor: borderColors[3]
        }}
      >
        {(data.ds || new Array(3).fill(null)).map((item, i) => {
          return (
            <div className={css.item} key={i}>
              {slots[slotKeys['key_参数']].render({
                key: i,
                inputValues: {
                  index: item || i
                }
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
