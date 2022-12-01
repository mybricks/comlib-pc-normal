import React, { useCallback, useEffect, useState, ReactNode } from 'react';
import classnames from 'classnames';
import { message, Tabs, Tooltip } from 'antd';
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

export default function ({ env, data, slots, inputs, outputs }: RuntimeParams<Data>) {
  const [showTabs, setShowTabs] = useState<string[]>(
    () => data.tabList?.map((item) => item.id) || []
  );
  const preKey = usePrevious<string | undefined>(data.defaultActiveKey);
  const findTargetByKey = useCallback(
    (target = data.defaultActiveKey) => {
      return data.tabList.find(
        ({ id, permissionKey, key }) =>
          (!permissionKey || env.hasPermission({ key: permissionKey })) &&
          showTabs?.includes(id as string) &&
          key === target
      );
    },
    [showTabs]
  );

  useEffect(() => {
    if (env.runtime) {
      if (data.tabList.length && !data.active) {
        data.defaultActiveKey = data.tabList[0].key;
      }
      // 激活
      inputs[InputIds.SetActiveTab]((id) => {
        const activeTab = data.tabList.find((item) => {
          return item.id === id;
        });
        if (activeTab) {
          const { permissionKey } = activeTab;
          if (!permissionKey || (permissionKey && env.hasPermission({ key: permissionKey }))) {
            data.defaultActiveKey = activeTab.key;
            data.active = true;
            return;
          }
        }
        data.defaultActiveKey = undefined;
        data.active = false;
        message.error('标签页不存在');
      });
      // 上一页
      inputs[InputIds.PreviousTab](() => {
        const currentIndex = data.tabList.findIndex(({ key }) => {
          return key === data.defaultActiveKey;
        });
        if (data.tabList[currentIndex - 1]) {
          data.defaultActiveKey = data.tabList[currentIndex - 1].key;
        }
      });
      // 下一页
      inputs[InputIds.NextTab](() => {
        const currentIndex = data.tabList.findIndex(({ key }) => {
          return key === data.defaultActiveKey;
        });
        if (data.tabList[currentIndex + 1]) {
          data.defaultActiveKey = data.tabList[currentIndex + 1].key;
        }
      });
      //获取当前激活步骤
      inputs[InputIds.OutActiveTab]((val, relOutputs) => {
        const current = findTargetByKey();
        relOutputs[OutputIds.OutActiveTab](current);
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
              console.error('只支持类型为string或者number的作为tab的name');
            }
          });
      });

      // 动态设置显示tab
      if (data.useDynamicTab) {
        inputs[InputIds.SetShowTab]((ds) => {
          if (Array.isArray(ds)) {
            const tempDs = ds.filter((str) => typeof str === 'string');
            setShowTabs(tempDs);
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
    return Promise.all([outputs[`${preTab.id}_leave`]()]);
  };

  const handleClickItem = useCallback((values) => {
    if (!data.prohibitClick) {
      data.defaultActiveKey = values;
    }
    if (env.runtime && outputs && outputs[OutputIds.OnTabClick]) {
      const { id, name } = data.tabList.find((item) => item.key === values) || {};
      outputs[OutputIds.OnTabClick]({ id, name });
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

  const renderItems = () => {
    return (
      <>
        {data.tabList.map((item) => {
          const tabName = env.i18n(item.name);
          if (
            env.runtime &&
            ((item.permissionKey && !env.hasPermission({ key: item.permissionKey })) ||
              !showTabs?.includes(item.id))
          ) {
            return null;
          }
          return (
            <TabPane
              tab={
                <Tooltip title={env.i18n(item.tooltipText)}>
                  <span>
                    {item.showIcon ? chooseIcon({ icon: item.icon }) : null}
                    {item.num === void 0 ? tabName : `${tabName} (${item.num})`}
                  </span>
                </Tooltip>
              }
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
    <div className={css.tabbox}>
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
