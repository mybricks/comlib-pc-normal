import { useCallback, useState } from 'react';

export default function ({ env, data, slots }) {
  return (
    <div style={{ border: '1px solid red', padding: 10 }}>
      {/*<div>*/}
      {/*  <button onClick={test}>Test</button>*/}
      {/*</div>*/}
      {slots['content'].render({
        inputs: {
          test(fn) {
            console.log(fn);
            debugger;
          }
        }
      })}
    </div>
  );
}
