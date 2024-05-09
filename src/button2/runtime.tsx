import React, { useCallback } from 'react';

import css from './runtime.less';

export default function ({ env, data, outputs }) {
  const onClick = useCallback(() => {
    if (env.runtime) {
      outputs['click']();
    }
  }, []);

  const onDoubleClick = useCallback(() => {
    if (env.runtime) {
      outputs['dblClick']();
    }
  }, []);

  const handleClick = () => {
    const map = new Map()
      map.set('a', 1)
      console.log('find A', map)
      const myArray = [1, 2, 3];
      myArray.includes(1)
      let obj = { a: 'AAA', b: 'BBB'}
      console.log('Object.values', Object.values(obj))
      const result = [1, 2, 3, 4, 5].copyWithin(0, 3)
      const instance = new Promise((resolve, reject) => {
        resolve(123)
      })
      console.log('result --- ', result)
    
  }

  return (
    <div
      className={css.button}
      style={data.style}
      onClick={onClick}
      onDoubleClick={onDoubleClick}>
      {data.text}
      {data.tip}
      <div className={css.innerBtn} onClick={handleClick}>点击点击</div>
    </div>
  );
}
