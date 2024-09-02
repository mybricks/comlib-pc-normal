import React, { useCallback, useEffect, useState, ReactNode } from 'react';
import classnames from 'classnames';
import { Tabs, Tooltip, Badge } from 'antd';
import { Data, InputIds, OutputIds, SlotIds, TabItem } from './constants';
import css from './runtime.less';
import * as Icons from '@ant-design/icons';
import { usePrevious } from '../utils/hooks';
import { getWhatToDoWithoutPermission } from '../utils/permission';

const { TabPane } = Tabs;

//选择图标样式
const chooseIcon = ({ icon }: { icon: ReactNode }) => {
  const Icon = Icons && Icons[icon as string]?.render();
  return <>{Icon}</>;
};

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

  const preKey = usePrevious<string | undefined>(data.defaultActiveKey);
  const findTargetByKey = useCallback(
    (target = data.defaultActiveKey) => {
      return data.tabList.find(
        ({ id, permission, key }) =>
          isHasPermission(permission) && showTabs?.includes(id as string) && key === target
      );
    },
    [showTabs, data.defaultActiveKey]
  );

  const findIndexByKey = useCallback(
    (target = data.defaultActiveKey) => {
      return data.tabList.findIndex(
        ({ id, permission, key }) =>
          isHasPermission(permission) && showTabs?.includes(id as string) && key === target
      );
    },
    [showTabs, data.defaultActiveKey]
  );

  useEffect(() => {
    if (env.runtime) {
      if (data.tabList.length && !data.active) {
        data.defaultActiveKey = data.tabList[0].key;
      }
      // 激活
      inputs[InputIds.SetActiveTab]((index: number | string, relOutputs) => {
        const val = +index;
        let activeTab;
        if (isNaN(val)) {
          //兼容老数据，传入值是id（如"tab1"），id已摈弃
          activeTab = data.tabList.find((item) => {
            return item.id === index;
          });
          if (!activeTab) {
            const errorMessage = '标签页不存在';
            onError(errorMessage);
            logger.error(errorMessage);
            return;
          }
        } else {
          if (val < 0 || val > data.tabList.length - 1) {
            const errorMessage = '[tabs]：下标值超出范围';
            onError(errorMessage);
            logger.error(errorMessage);
            return;
          }
          activeTab = data.tabList[val];
        }
        if (activeTab) {
          const { permission } = activeTab;
          if (isHasPermission(permission)) {
            data.defaultActiveKey = activeTab.key;
            data.active = true;
            relOutputs[OutputIds.SetActiveTabComplete]();
            return;
          }
        }
        data.defaultActiveKey = undefined;
        data.active = false;
        relOutputs[OutputIds.SetActiveTabComplete]();
      });
      // 上一页
      inputs[InputIds.PreviousTab]((_, relOutputs) => {
        const currentDisplayTabList = data.tabList.filter((tab) => isHasPermission(tab.permission));
        const currentIndex = currentDisplayTabList.findIndex(
          (tab) => showTabs?.includes(tab.id) && tab.key === data.defaultActiveKey
        );
        if (currentDisplayTabList[currentIndex - 1]) {
          data.defaultActiveKey = currentDisplayTabList[currentIndex - 1].key;
          relOutputs[OutputIds.PreviousTabComplete]();
        }
      });
      // 下一页
      inputs[InputIds.NextTab]((_, relOutputs) => {
        const currentDisplayTabList = data.tabList.filter((tab) => isHasPermission(tab.permission));
        const currentIndex = currentDisplayTabList.findIndex(
          (tab) => showTabs?.includes(tab.id) && tab.key === data.defaultActiveKey
        );
        if (currentDisplayTabList[currentIndex + 1]) {
          data.defaultActiveKey = currentDisplayTabList[currentIndex + 1].key;
          relOutputs[OutputIds.NextTabComplete]();
        }
      });
      //获取当前激活步骤
      inputs[InputIds.OutActiveTab]((val, relOutputs) => {
        const current = findTargetByKey();
        const index = findIndexByKey();
        relOutputs[OutputIds.OutActiveTab]({ ...current, index });
      });
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

      // 动态设置显示tab
      if (data.useDynamicTab) {
        inputs[InputIds.SetShowTab]((ds: (number | string)[], relOutputs) => {
          if (Array.isArray(ds)) {
            const tempDs = ds
              .map((id) => {
                const val = +id;
                if (isNaN(val)) {
                  //兼容老数据，传入值是id
                  return id as string;
                } else {
                  return data.tabList[val]?.id;
                }
              })
              .filter((id) => !!id);
            setShowTabs(tempDs);
            //处理动态设置显示不选中问题
            if (tempDs.length) {
              const showTabs = data.tabList.filter((tab) => tempDs.includes(tab.id));
              if (!showTabs.find((tab) => tab.key === data.defaultActiveKey)) {
                data.defaultActiveKey = data.tabList.find(({ id }) => id === tempDs[0])?.key;
              }
            }
            relOutputs[OutputIds.SetShowTabComplete]();
          }
        });
      }

      if (data.dynamicTabs) {
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
            if (!('closable' in tab)) {
              tab.closable = data.closable;
            }
            keys.push(tab.key?.toString());
            return tab;
          });
          data.tabList = ds;
          if ((!data.defaultActiveKey || !keys.includes(data.defaultActiveKey)) && ds[0].key) {
            data.defaultActiveKey = ds[0].key + '';
          }
          relOutputs[OutputIds.SetTabsDone](ds);
        });
      }

      inputs[InputIds.GetTabs]!((_, relOutputs) => {
        relOutputs[OutputIds.GetTabsDone](data.tabList);
      });
    }
  }, [showTabs]);

  useEffect(() => {
    if (env.runtime) {
      // tabRenderHook();
      tabLeaveHook().then(tabIntoHook);
    }
  }, [data.defaultActiveKey]);

  const tabRenderHook = () => {
    const currentTab = findTargetByKey();
    if (currentTab && !currentTab.render) {
      const slotInputs = slots[currentTab.id].inputs;
      slotInputs[`${currentTab.id}_render`] && slotInputs[`${currentTab.id}_render`]();
    }
  };

  const tabIntoHook = () => {
    const currentTab = findTargetByKey();
    if (currentTab) {
      // currentTab.render = true; //标记render状态
      outputs[`${currentTab.id}_into`]();
    }
  };

  const tabLeaveHook = () => {
    if (preKey === undefined) return Promise.resolve();
    const preTab = findTargetByKey(preKey);
    if (preTab) return Promise.all([outputs[`${preTab.id}_leave`]()]);
    return Promise.resolve();
  };

  const handleClickItem = useCallback(
    (values) => {
      if (!data.prohibitClick) {
        data.defaultActiveKey = values;
      }
      if (env.runtime && outputs && outputs[OutputIds.OnTabClick]) {
        const item = findTargetByKey(values) || {};
        const index = findIndexByKey(values);
        outputs[OutputIds.OnTabClick]({ ...item, index });
      }
    },
    [showTabs]
  );

  const onEdit = (targetKey, action) => {
    const actionMap = {
      add() {
        outputs[OutputIds.AddTab](data.tabList);
      },
      remove(key: string) {
        data.tabList = data.tabList.filter((i) => i.key != key);
        if (data.defaultActiveKey === key && data.tabList.length) {
          data.defaultActiveKey = data.tabList[data.tabList.length].key + '';
        }
        outputs[OutputIds.RemoveTab](data.tabList);
      }
    };
    actionMap[action](targetKey);
  };

  const renderInfo = (item) => {
    const tabName = env.i18n(item.name);
    return item.infoType === 'icon' ? (
      <Badge
        count={item.num}
        offset={item.offset}
        size={item.size}
        status={item.status}
        showZero={item.showZero}
      >
        <span>
          {item.showIcon ? chooseIcon({ icon: item.icon }) : null}
          {tabName}
        </span>
      </Badge>
    ) : (
      <span>
        {item.showIcon ? chooseIcon({ icon: item.icon }) : null}
        {item.num === void 0 ? tabName : `${tabName} (${item.num})`}
      </span>
    );
  };

  const renderItems = () => {
    return (
      <>
        {data.tabList.map((item) => {
          if (env.runtime && (!isHasPermission(item.permission) || !showTabs?.includes(item.id))) {
            return null;
          }

          return (
            <TabPane
              tab={<Tooltip title={env.i18n(item.tooltipText)}>{renderInfo(item)}</Tooltip>}
              key={item.key}
              closable={!!item.closable}
              forceRender={!!data.forceRender}
            >
              {data.hideSlots ? null : (
                <div className={classnames(css.content, env.edit && css.minHeight)}>
                  {slots[item.id]?.render({
                    key: item.id,
                    style: data.slotStyle
                  })}
                </div>
              )}
            </TabPane>
          );
        })}
      </>
    );
  };

  const tabBarExtraContent = (() => {
    const res = {} as { left?: ReactNode; right?: ReactNode };
    if (data.useLeftExtra && slots[SlotIds.LeftExtra]) res.left = slots[SlotIds.LeftExtra].render();
    if (data.useRigthExtra && slots[SlotIds.RigthExtra])
      res.right = slots[SlotIds.RigthExtra].render();
    if (Object.keys(res).length === 0) return undefined;
    return res;
  })();

  return (
    <div className={`${css.tabbox} root`}>
      <Tabs
        activeKey={data.defaultActiveKey}
        type={data.type}
        centered={data.centered}
        tabPosition={data.tabPosition}
        onChange={handleClickItem}
        size={data.size || 'middle'}
        hideAdd={data.hideAdd}
        onEdit={env.edit ? undefined : onEdit}
        tabBarExtraContent={tabBarExtraContent}
      >
        {renderItems()}
      </Tabs>
    </div>
  );
}
