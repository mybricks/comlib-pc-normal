import { useEffect } from 'react';

export default (props) => {
  const { env, data, slots, inputs } = props;

  useEffect(() => {
    inputs['setValue']((ds) => {
      data.value = ds;
    });
  }, []);

  return (
    <div>
      123
      {(env.edit ? [1] : data.value)?.map((val, idx) => {
        return (
          <div>
            {slots['content'].render({
              inputValues: {
                value: val
              }
              // key: `test-${idx}`
            })}
          </div>
        );
      })}
    </div>
  );
};
