import React from 'react';
import { useObservable, observe } from '@mybricks/rxui';

class FormContext {
  data: any;
  outputs: any;
  inputs: any;
  env: any;
  slots: any;
}

function Child() {
  const formContext = observe(FormContext, { from: 'parents' });
  console.log(formContext.data, 'formContext.data is undefined');
  return <div>Child</div>;
}

export default function (props) {
  const { env, data, inputs, outputs } = props;

  useObservable(
    FormContext,
    (next) =>
      next({
        data,
        inputs,
        outputs,
        env
      }),
    { to: 'children' }
  );

  return (
    <>
      {/* can observe without props */}
      <Child />

      {/* can not observe */}
      <Child {...props} />
    </>
  );
}
