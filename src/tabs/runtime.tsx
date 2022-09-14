import React, { useCallback, useEffect, useState, ReactNode } from 'react';
import classnames from 'classnames';
import { message, Tabs, Tooltip } from 'antd';
import { Data, InputIds, OutputIds, SlotIds } from './constants';
import css from './tabs.less';
import * as Icons from '@ant-design/icons';
import { usePrevious } from '../utils/hooks';

const { TabPane } = Tabs;

//选择图标样式
const chooseIcon = ({ icon }: { icon: ReactNode }) => {
  const Icon = Icons && Icons[icon as string]?.render();
  return <>{Icon}</>;
};

export default function ({ env, data, slots, inputs, outputs }: RuntimeParams<Data>) {
  const [showTabs, setShowTabs] = useState<string[]>();
  const preKey = usePrevious<string | undefined>(data.defaultActiveKey);
  const findTargetIndex = useCallback(() => {
    return data.tabList.findIndex(
      ({ id, permissionKey, key }) =>
        (!permissionKey || env.hasPermission({ key: permissionKey })) &&
        showTabs?.includes(id as string) &&
        key === data.defaultActiveKey
    );
  }, [showTabs]);

  const setActiveKey = () => {
    const index = findTargetIndex();
    if (index > 0) {
      data.defaultActiveKey = data.tabList[index].key;
    } else {
      data.defaultActiveKey = data.tabList[0].key;
    }
  };

  useEffect(() => {
    setShowTabs(() => data.tabList?.map((item) => item.id) || []);
  }, [data.tabList.length]);

  useEffect(() => {
    setActiveKey();
  }, [showTabs]);

  useEffect(() => {
    if (data.tabList.length > 0 && !data.active) {
      setActiveKey();
    }
    if (env.runtime) {
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
      inputs[InputIds.OutActiveTab]((val, relOutputs) => {
        const current = data.tabList.find(({ key }) => key === data.defaultActiveKey);
        relOutputs[OutputIds.OutActiveTab](current);
      });
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
      tabLeaveHook().then(tabIntoHook);
    }
  }, [data.defaultActiveKey]);

  const tabIntoHook = () => {
    const currentTab = data.tabList.find(({ key }) => key === data.defaultActiveKey);
    if (currentTab) {
      const slotInputs = slots[currentTab.id].inputs;
      slotInputs[`${currentTab.id}_into`]();
    }
  };

  const tabLeaveHook = () => {
    if (preKey === undefined) return Promise.resolve();
    const preTab = data.tabList.find(({ key }) => key === preKey);
    const slotInputs = slots[preTab.id].inputs;
    return Promise.all([slotInputs[`${preTab.id}_leave`]()]);
  };

  const handleClickItem = useCallback((values) => {
    if (env.runtime && outputs && outputs[OutputIds.OnTabClick]) {
      const current = data.tabList.filter((item) => item.key === values)[0];
      outputs[OutputIds.OnTabClick](current);
    }

    if (!data.prohibitClick) {
      data.defaultActiveKey = values;
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
