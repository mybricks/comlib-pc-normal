import { useCallback, useState } from 'react';

export default function ({ env, data, slots }) {
  const [other, setOther] = useState(Math.random);

  return (
    <div style={{ border: '1px solid red', padding: 10 }}>
      <div>
        <button
          onClick={(e) => {
            setOther(Math.random);
          }}
        >
          Test
        </button>
      </div>
      <Test slots={slots} other={other} />
    </div>
  );
}

function Test({ slots, other }) {
  console.log('other', other);

  const [ipts, setInpus] = useState([]);

  const test = useCallback(() => {
    ipts.forEach((inputs, idx) => {
      inputs.test(idx).testOut((val) => {
        //调用所有表单项的 getValue/returnValue
        console.log('val', val);
      });
    });
  }, []);

  return slots['content'].render({
    wrap(comAray: { id; jsx; def; inputs; outputs }[]) {
      const item0 = comAray[0];
      ipts.push(item0.inputs);

      console.log(comAray.length);

      return comAray.map(({ id, jsx }, idx) => {
        return <div key={id}>{jsx}</div>;
      });
    },
    key: Math.random()
  });
}
