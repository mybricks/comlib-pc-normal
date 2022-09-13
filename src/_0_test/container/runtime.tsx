import { useCallback, useState } from 'react';

export default function ({ env, data, slots }) {
  const [ipts, setInpus] = useState([]);

  const test = useCallback(() => {
    ipts.forEach((inputs, idx) => {
      inputs.test(idx).testOut((val) => {
        //调用所有表单项的 getValue/returnValue
        console.log('val', val);
      });
    });
  }, []);

  return (
    <div style={{ border: '1px solid red', padding: 10 }}>
      <div>
        <button onClick={test}>Test</button>
      </div>
      {env.runtime
        ? slots['content'].render({
            wrap(comAray: { id; jsx; def; inputs; outputs }[]) {
              const item0 = comAray[0];
              ipts.push(item0.inputs);

              return comAray[0].jsx;
            },
            key: '0'
          })
        : slots['content'].render()}
    </div>
  );
}
