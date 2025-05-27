import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Data, InputIds, OutputIds, TabItem } from './constants';
import css from './runtime.less';
import { getWhatToDoWithoutPermission } from '../utils/permission';
import cx from 'classnames';
import { isNumber } from '../utils/types';

export default function ({
  env,
  data,
  slots,
  inputs,
  outputs,
  onError,
  logger
}: RuntimeParams<Data>) {
  const [showTabs, setShowTabs] = useState<string[]>(
    () => data.tabList?.map((item) => item.id) || []
  );

  useEffect(() => {
    setShowTabs(() => (data.tabList ?? []).map((item) => item.id));
  }, [data.tabList]);

  function isHasPermission(permission?: ConfigPermission) {
    return !permission || getWhatToDoWithoutPermission(permission, env).type === 'none';
  }

  const findIndexByKey = useCallback(
    (target) => {
      return data.tabList.findIndex(
        ({ id, permission, key }) =>
          isHasPermission(permission) && showTabs?.includes(id as string) && key === target
      );
    },
    [showTabs]
  );

  useEffect(() => {
    if (env.runtime) {
      //支持动态通知
      data.tabList.forEach((item) => {
        item.dynamic &&
          inputs[item.key] &&
          inputs[item.key]((ds, relOutputs) => {
            if (typeof ds === 'string' || typeof ds === 'number') {
              item.num = ds;
            } else {
              item.num = undefined;
              const errorMessage = '只支持类型为string或者number的作为tab的name';
              onError(errorMessage);
              logger.error(errorMessage);
            }
            relOutputs[`${item.key}Done`](ds);
          });
      });

      inputs[InputIds.SetTabs]((tabs: Array<TabItem>, relOutputs) => {
        if (!Array.isArray(tabs)) {
          onError('arguments must be tab list');
          return;
        }
        if (tabs.length && tabs.some((tab) => !tab.id || !tab.key)) {
          onError('tab data type error');
          return;
        }
        const keys: Array<string> = [];
        const ds = tabs.map((tab) => {
          console.log(tab);
          if (!('closable' in tab)) {
            tab.closable = data.closable;
          }
          keys.push(tab.key?.toString());
          return tab;
        });
        data.tabList = ds;
        relOutputs[OutputIds.SetTabsDone](ds);
      });

      inputs[InputIds.GetTabs]!((_, relOutputs) => {
        relOutputs[OutputIds.GetTabsDone](data.tabList);
      });

      inputs['removeTab']?.((val) => {
        let index;

        if (val.key) {
          index = findIndexByKey(val.key);
        } else if (val.index) {
          index = val.index;
        }

        if (!isNumber(index) || index < 0 || index >= data.tabList.length) {
          return;
        }

        data.tabList.splice(index, 1);
      });
    }
  }, [showTabs]);

  const onEdit = (targetKey, action) => {
    const actionMap = {
      add() {
        outputs[OutputIds.AddTab](data.tabList);
      },
      remove(key: string) {
        let index = data.tabList.findIndex((i) => i.key == key);
        if (index == -1) return;

        if (data.useCustomClose) {
          // 自定义
          outputs[OutputIds.RemoveTab](data.tabList[index]);
        } else {
          // 直接删除
          let item = data.tabList.splice(index, 1);
          outputs[OutputIds.RemoveTab](item[0]);
        }
      }
    };
    actionMap[action](targetKey);
  };

  return (
    <div className={cx([css.tabbox, 'root'])}>
      {data.tabList.map((item) => {
        if (env.runtime && (!isHasPermission(item.permission) || !showTabs?.includes(item.id))) {
          return null;
        }

        return (
          <div className={css.cardItem + ' card-list-item'}>
            <div className={css.cardItemTitle}>
              <span>{item.name}</span>
              {data.tabList.length > 1 && <a onClick={() => {onEdit(item.key, 'remove')}}><DeleteOutlined /></a>}
            </div>
            <div className={classnames(css.cardItemContent)}>
              {slots[item.id]?.render({
                key: item.id,
                style: data.slotStyle as any
              })}
            </div>
          </div>
        );
      })}
      <Button type="link" onClick={() => onEdit('', 'add')}>
        + 新增分页面板
      </Button>
    </div>
  );
}
