import { useEffect } from 'react';

export default (props) => {
  const { data, slots, inputs } = props;

  useEffect(() => {
    inputs['setValue']((ds) => {
      data.value = ds;
    });
  }, []);

  return (
    <div>
      123
      {slots['content'].render({
        inputValues: {
          value: data.value
        }
      })}
    </div>
  );
};
