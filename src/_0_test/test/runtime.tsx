import { useEffect } from 'react';
import css from './runtime.less';

export default (props) => {
  const { env, data, slots, inputs } = props;

  useEffect(() => {
    inputs['setValue']((ds) => {
      data.value = ds;
    });
  }, []);

  return (
    <div>
      <div className={`${css.test} test`}>12345</div>
    </div>
  );
};
