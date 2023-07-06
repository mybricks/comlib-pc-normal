import React from 'react';
import { slotKeys } from './const';

export default function ({ env, data, slots, inputs, outputs }) {
  return (
    <div style={{ border: '1px solid red', padding: 10 }}>
      <div>不遍历：</div>
      <div>{slots[slotKeys['无key_无参数']].render()}</div>
      <div>{slots[slotKeys['无key_参数']].render()}</div>
      <div>{slots[slotKeys['key_无参数']].render()}</div>
      <div>{slots[slotKeys['key_参数']].render()}</div>
    </div>
  );
}
