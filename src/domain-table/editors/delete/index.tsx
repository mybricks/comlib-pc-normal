import React, { FC, useCallback } from 'react';

import styles from './index.less';

const Delete: FC = ({ editConfig }: any) => {
  const { value, options } = editConfig;

  const onDelete = useCallback(() => {
    value.set(options.modalAction);
  }, [options.modalAction]);

  return (
    <div className={styles.delete} onClick={onDelete}>
      删除
    </div>
  );
};

export default Delete;
