import React, { useCallback, useEffect, useState, ReactNode } from 'react';
import classnames from 'classnames';
import { Tabs, Tooltip } from 'antd';
import { Data, InputIds, OutputIds, SlotIds } from './constants';
import css from './tabs.less';
import * as Icons from '@ant-design/icons';

const { TabPane } = Tabs;

export default function ({
  env,
  data,
  slots,
  inputs,
  outputs
}: RuntimeParams<Data>) {
  const [showTabs, setShowTabs] = useState<string[]>(
    (data.tabList || []).map((item) => item.id)
  );

  //选择图标样式
  const chooseIcon = ({ icon }: { icon: ReactNode }) => {
    const Icon = Icons && Icons[icon as string]?.render();
    return <>{Icon}</>;
  };

  const setDefaultActiveKey = () => {
    if (data.tabList?.length) {
      const tempTabs = data.tabList.filter(
        (item) =>
          (!item.permissionKey ||
            env.hasPermission({ key: item.permissionKey })) &&
          showTabs.includes(item.id)
      );
      if (
        tempTabs.length &&
        !tempTabs.find((item) => item.key === data.defaultActiveKey)
      ) {
        data.defaultActiveKey = tempTabs[0].key;
      }
      if (!data.defaultActiveKey) {
        data.defaultActiveKey = data.tabList[0].key;
      }
    }
  };
  useEffect(() => {
    setDefaultActiveKey();
  }, [showTabs]);
  useEffect(() => {
    if (data.tabList.length > 0 && !data.active) {
      const index = data.tabList.findIndex(
        (item) =>
          (!item.permissionKey ||
            env.hasPermission({ key: item.permissionKey })) &&
          showTabs.includes(item.id)
      );
      if (data.tabList[index]) {
        data.defaultActiveKey = data.tabList[index].key;
      } else {
        data.defaultActiveKey = data.tabList[0].key;
      }
    }
    if (env.runtime) {
      // 激活
      inputs[InputIds.SetActiveTab] &&
        inputs[InputIds.SetActiveTab]((id) => {
          const activeTab = data.tabList.find((item) => {
            return item.id === id;
          });
          if (
            activeTab &&
            env.hasPermission({ key: activeTab.permissionKey })
          ) {
            data.defaultActiveKey = activeTab.key;
            data.active = true;
          } else {
            data.defaultActiveKey = null;
            data.active = false;
          }
        });
      // 上一页
      inputs[InputIds.PreviousTab] &&
        inputs[InputIds.PreviousTab](() => {
          const currentIndex = data.tabList.findIndex((item) => {
            return item.key === data.defaultActiveKey;
          });
          if (data.tabList[currentIndex - 1]) {
            data.defaultActiveKey = data.tabList[currentIndex - 1].key;
          }
        });
      // 下一页
      inputs[InputIds.NextTab] &&
        inputs[InputIds.NextTab](() => {
          const currentIndex = data.tabList.findIndex((item) => {
            return item.key === data.defaultActiveKey;
          });
          if (data.tabList[currentIndex + 1]) {
            data.defaultActiveKey = data.tabList[currentIndex + 1].key;
          }
        });
      inputs[InputIds.OutActiveTab] &&
        inputs[InputIds.OutActiveTab]((val, relOutputs) => {
          const current = data.tabList.filter(
            (item) => item.key === data.defaultActiveKey
          )[0];
          relOutputs[OutputIds.OutActiveTab](
            current.outputContent || current.name
          );
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
      if (data.useDynamicTab && inputs[InputIds.SetShowTab]) {
        inputs[InputIds.SetShowTab]((ds) => {
          if (Array.isArray(ds)) {
            const tempDs = ds.filter((str) => typeof str === 'string');
            setShowTabs(tempDs);
          }
        });
      }
    }
  }, []);

  const handleClickItem = useCallback((values) => {
    if (env.runtime && outputs && outputs[OutputIds.OnTabClick]) {
      const current = data.tabList.filter((item) => item.key === values)[0];
      outputs[OutputIds.OnTabClick](current.outputContent || current.name);
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
            ((item.permissionKey &&
              !env.hasPermission({ key: item.permissionKey })) ||
              !showTabs.includes(item.id))
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
              forceRender={data.forceRender}
            >
              {data.hideSlots ? null : (
                <div
                  className={classnames(css.content, env.edit && css.minHeight)}
                >
                  {slots[item.key].render()}
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
          left: data.useLeftExtra
            ? slots[SlotIds.LeftExtra].render()
            : undefined,
          right: data.useRigthExtra
            ? slots[SlotIds.RigthExtra].render()
            : undefined
        }}
      >
        {renderItems()}
      </Tabs>
    </div>
  );
}
