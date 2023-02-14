import React from 'react';
import { useCallback, useState } from 'react';

export default function ({ env, data, slots, inputs, outputs }) {
  return (
    <div style={{ border: '1px solid red', padding: 10 }}>
      {slots['content'].render({
        inputValues: {
          curDS: 'aaa'
        },
        key: 1
      })}
    </div>
  );
}
