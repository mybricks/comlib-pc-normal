import React, { FC, useCallback, useState } from 'react';
import { ajax } from '../../util';

import styles from './index.less';

const Refresh: FC = ({ editConfig }: any) => {
  const { value, options } = editConfig;
  const [tip, setTip] = useState({
    type: 'alert',
    message: '模型存在更新时，可刷新对应实体信息'
  });

  const refresh = useCallback(() => {
    options.domainFileId &&
      ajax(
        {},
        { url: `/paas/api/domain/bundle?fileId=${options.domainFileId}`, method: 'get' }
      ).then((res) => {
        const newEntity = res.entityAry.find(
          (entity) => entity.id === options.entityId && entity.isOpen
        );

        if (!newEntity) {
          setTip({
            type: 'error',
            message: '对应模型中实体已删除，请前往模型编辑页确认~'
          });
        }

        value.set(newEntity);
        setTip({
          type: 'warning',
          message: '刷新成功，可能存在字段冲突，请调试确认~'
        });
      });
  }, [options.domainFileId, options.entityId]);

  return (
    <div className={styles.refresh}>
      <div className={styles[tip.type]}>{tip.message}</div>
      <button className={styles.button} onClick={refresh}>
        刷新实体
      </button>
    </div>
  );
};

export default Refresh;
