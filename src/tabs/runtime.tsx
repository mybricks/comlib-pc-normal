import React, { useCallback, useEffect, useState, ReactNode } from 'react';
import classnames from 'classnames';
import { Tabs, Tooltip, Badge } from 'antd';
import { Data, InputIds, OutputIds, SlotIds } from './constants';
import css from './runtime.less';
import * as Icons from '@ant-design/icons';
import { usePrevious } from '../utils/hooks';

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
  const preKey = usePrevious<string | undefined>(data.defaultActiveKey);
  const findTargetByKey = useCallback(
    (target = data.defaultActiveKey) => {
      return data.tabList.find(
        ({ id, permission, key }) =>
          (!permission || env.hasPermission(permission.id)) &&
          showTabs?.includes(id as string) &&
          key === target
      );
    },
    [showTabs, data.defaultActiveKey]
  );

  const findIndexByKey = useCallback(
    (target = data.defaultActiveKey) => {
      return data.tabList.findIndex(
        ({ id, permission, key }) =>
          (!permission || env.hasPermission(permission.id)) &&
          showTabs?.includes(id as string) &&
          key === target
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
      inputs[InputIds.SetActiveTab]((index: number | string) => {
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
          if (!permission || (permission && env.hasPermission(permission.id))) {
            data.defaultActiveKey = activeTab.key;
            data.active = true;
            return;
          }
        }
        data.defaultActiveKey = undefined;
        data.active = false;
      });
      // 上一页
      inputs[InputIds.PreviousTab](() => {
        const currentIndex = findIndexByKey();
        if (data.tabList[currentIndex - 1]) {
          data.defaultActiveKey = data.tabList[currentIndex - 1].key;
        }
      });
      // 下一页
      inputs[InputIds.NextTab](() => {
        const currentIndex = findIndexByKey();
        if (data.tabList[currentIndex + 1]) {
          data.defaultActiveKey = data.tabList[currentIndex + 1].key;
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
          inputs[item.key]((ds) => {
            if (typeof ds === 'string' || typeof ds === 'number') {
              item.num = ds;
            } else {
              item.num = undefined;
              const errorMessage = '只支持类型为string或者number的作为tab的name';
              onError(errorMessage);
              logger.error(errorMessage);
            }
          });
      });

      // 动态设置显示tab
      if (data.useDynamicTab) {
        inputs[InputIds.SetShowTab]((ds: (number | string)[]) => {
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
          }
        });
      }
    }
  }, []);

  useEffect(() => {
    if (env.runtime) {
      // tabRenderHook();
      tabLeaveHook().then(tabIntoHook);
    }
  }, [data.defaultActiveKey, showTabs]);

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

  const handleClickItem = useCallback((values) => {
    if (!data.prohibitClick) {
      data.defaultActiveKey = values;
    }
    if (env.runtime && outputs && outputs[OutputIds.OnTabClick]) {
      const item = findTargetByKey(values) || {};
      const index = findIndexByKey(values);
      outputs[OutputIds.OnTabClick]({ ...item, index });
    }
  }, []);

  const onEdit = (targetKey, action) => {
    const actionMap = {
      remove(key) {
        let newActiveKey = data.defaultActiveKey;
        let lastIndex;
        data.tabList.forEach((tab, index) => {
          if (tab.key === key) {
            lastIndex = index - 1;
          }
        });
        const newPanes = data.tabList.filter((i) => i.key !== key);
        if (newPanes.length && newActiveKey === key) {
          if (lastIndex >= 0) {
            newActiveKey = newPanes[lastIndex].key;
          } else {
            newActiveKey = newPanes[0].key;
          }
        }
        data.tabList = newPanes;
        data.defaultActiveKey = newActiveKey;
      }
    };
    actionMap[action](targetKey);
  };

  const renderInfo = (item) => {
    const tabName = env.i18n(item.name);
    return item.infoType === 'icon' && item.num ? (
      <Badge count={item.num} offset={data.offset} size={item.size} status={item.status}>
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
          const tabName = env.i18n(item.name);
          if (
            env.runtime &&
            ((item.permission && !env.hasPermission(item.permission.id)) ||
              !showTabs?.includes(item.id))
          ) {
            return null;
          }
          return (
            <TabPane
              tab={<Tooltip title={env.i18n(item.tooltipText)}>{renderInfo(item)}</Tooltip>}
              key={item.key}
              closable={!!item.closable}
            >
              {data.hideSlots ? null : (
                <div className={classnames(css.content, env.edit && css.minHeight)}>
                  {slots[item.id]?.render()}
                </div>
              )}
            </TabPane>
          );
        })}
      </>
    );
  };

  return (
    <div className={`${css.tabbox} root`}>
      <Tabs
        activeKey={data.defaultActiveKey}
        type={data.type}
        centered={data.centered}
        tabPosition={data.tabPosition}
        onChange={handleClickItem}
        hideAdd={true}
        onEdit={env.edit ? undefined : onEdit}
        tabBarExtraContent={{
          left: data.useLeftExtra ? slots[SlotIds.LeftExtra].render() : undefined,
          right: data.useRigthExtra ? slots[SlotIds.RigthExtra].render() : undefined
        }}
      >
        {renderItems()}
      </Tabs>
    </div>
  );
}
