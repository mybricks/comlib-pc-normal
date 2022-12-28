import { useCallback, useState } from 'react';

export default (props) => {
  const { data, slots, inputs, env, outputs } = props;
  const { title, useExtra, bordered, size, style, bodyStyle, hoverable, useClick, outputContent } =
    data;

  console.log('props.style', props.style);

  return <div>123</div>;
};
