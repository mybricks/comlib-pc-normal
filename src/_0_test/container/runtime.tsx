import { useCallback, useState, useMemo } from 'react';

export default function ({ env, data, slots }) {
  const [other, setOther] = useState(Math.random);
  const [formList, setFormList] = useState([{ key: 0 }, { key: 1 }]);
  const childrenInputs = useMemo<any>(() => {
    return {};
  }, [env.edit]);
  const ids = ['u_jOkE5', 'u_qw6Jn'];

  return (
    <div style={{ border: '1px solid red', padding: 10 }}>
      <div>
        <button
          onClick={(e) => {
            // setOther(Math.random);
            const valueAry = [];
            Object.keys(childrenInputs).forEach((filedKey) => {
              ids.forEach((id) => {
                const input = childrenInputs[filedKey][id];
                input?.getValue().returnValue((val) => {
                  if (valueAry[filedKey]) {
                    valueAry[filedKey][id] = val;
                  } else {
                    valueAry[filedKey] = { [id]: val };
                  }
                  console.log(val, filedKey);
                  console.log(valueAry);
                });
              });
            });
          }}
        >
          Test
        </button>
      </div>
      {formList.map((item) => {
        return (
          <div style={{ marginBottom: '10px' }} key={item.key}>
            <Test slots={slots} other={other} filedKey={item.key} childrenInputs={childrenInputs} />
          </div>
        );
      })}
    </div>
  );
}

function Test({ slots, other, filedKey, childrenInputs }) {
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

  const onChange = () => {
    slots['content']._inputs['onChange'](({ id, value }) => {
      console.log(value, filedKey);
    });
    // console.log(val, key)
  };

  return slots['content'].render({
    wrap(comAray: { id; jsx; def; inputs; outputs }[]) {
      // const item = comAray[filedKey];
      comAray.map((item) => {
        console.log(item);
        if (!childrenInputs[filedKey]) {
          childrenInputs[filedKey] = {
            [item.id]: item.inputs
          };
        }
        childrenInputs[filedKey][item.id] = item.inputs;
      });
      // ipts.push(item0.inputs);
      // slots['content']._inputs['onChange'](({ id, value }) => {
      //   console.log(value, filedKey) ;
      // });

      console.log(comAray, filedKey);

      return comAray?.map(({ id, jsx }, idx) => {
        return <div key={id}>{jsx}</div>;
      });
    }
    // key: filedKey
  });
}
