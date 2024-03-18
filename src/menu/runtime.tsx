import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { Data, InputIds, MenuItem, OutputIds, findMenuItem, uuid, MenuTypeEnum } from './constants';
import css from './style.less';
import * as Icons from '@ant-design/icons';

import { findSelectkeys } from './utils';

export default function ({ env, data, outputs, inputs }: RuntimeParams<Data>) {
  const { dataSource, mode } = data;
  const [selectedKey, setSelectedKey] = useState<string[]>([]);
  const [isSet, setIsSet] = useState<boolean>(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  //激活项处理
  useEffect(() => {
    if (dataSource.length !== 0 && !isSet) {
      setSelectedKey([findSelectkeys(dataSource)]);
    }
  }, [dataSource]);

  useEffect(() => {
    if (env.runtime) {
      //设置选中项
      inputs[InputIds.SetActiveItem]((val, relOutputs) => {
        setSelectedKey([val]);
        relOutputs['setActiveItemDone'](val);
      });

      inputs[InputIds.SetMenuData]((val, relOutputs) => {
        const { dataSource, defaultActive } = val || {};
        if (Array.isArray(dataSource)) {
          dataSource.forEach((item) => {
            const key = item.key || uuid();
            item.key = key;
            item._key = key;
          });
          data.dataSource = dataSource;
          relOutputs['setMenuDataDone'](dataSource);
          setSelectedKey([defaultActive]);
          setIsSet(true);
        }
      });
    }
  }, [dataSource, selectedKey]);
  //获取选中值
  inputs[InputIds.GetActiveItem]((val, relOutputs) => {
    if (selectedKey && env.runtime) {
      const temp = findMenuItem(dataSource, selectedKey[0]);
      const { key, _key, title, menuType, value } = temp || {};
      relOutputs[OutputIds.GetActiveItem]({
        title: env.i18n(title),
        key: _key,
        menuType: menuType,
        value: value ? value : void 0
      });
    }
  });

  //菜单点击事件
  const onClick = (e) => {
    const clickItem = findMenuItem(dataSource, e.key);
    setSelectedKey([e.key]);
    const { key, _key, menuType, title, value } = clickItem;
    if (env.runtime) {
      outputs[OutputIds.ClickMenu]({
        title: env.i18n(title),
        key: key,
        menuType: menuType,
        value: value ? value : void 0
      });
    }
  };

  //子菜单的点击事件
  const menuOnClick = (e) => {
    const clickItem = findMenuItem(dataSource, e.key);
    const { key, _key, title, ...res } = clickItem;
    if (env.runtime && key && !isSet) {
      outputs[_key]({
        ...res,
        title: env.i18n(title),
        key: key
      });
    }
  };

  //选择图标样式
  const chooseIcon = ({ icon }) => {
    const Icon = Icons && Icons[icon as string]?.render();
    return <>{Icon}</>;
  };

  const renderMenuItems = (ds: MenuItem[]) => {
    return (ds || []).map((item) => {
      const { key, children, menuType, useIcon, icon } = item || {};
      const title = env.i18n(item.title);
      //分组菜单
      if (menuType === MenuTypeEnum.Group) {
        return (
          <div data-menu-item={key} key={key}>
            <Menu.ItemGroup title={title} key={key}>
              {renderMenuItems(children)}
            </Menu.ItemGroup>
          </div>
        );
      }
      //父菜单
      if (menuType === MenuTypeEnum.SubMenu) {
        return (
          <Menu.SubMenu
            title={title}
            key={key}
            data-menu-item={key}
            icon={useIcon ? chooseIcon({ icon: icon }) : void 0}
            style={{ opacity: 1, height: 'unset', overflowY: 'unset', position: 'relative' }}
          >
            {renderMenuItems(children)}
          </Menu.SubMenu>
        );
      }
      //最后的子菜单
      return (
        <Menu.Item
          onClick={menuOnClick}
          icon={useIcon ? chooseIcon({ icon: icon }) : void 0}
          key={key}
          data-menu-item={key}
          style={{ opacity: 1, height: 'unset', overflowY: 'unset', position: 'relative' }}
        >
          {title}
        </Menu.Item>
      );
    });
  };

  useEffect(() => {
    if (mode === 'inline') {
      const filterKeys = [];
      const filterFun = (data) => {
        data.forEach((item) => {
          if (item.menuType === 'subMenu') {
            filterKeys.push(item.key);
            if (item.children.length !== 0) {
              filterFun(item.children);
            }
          }
        });
      };

      filterFun(dataSource);
      setOpenKeys(filterKeys);
    }
  }, [dataSource, mode]);

  if (!dataSource.length && env.edit) {
    return <div className={css.suggestion}>无静态数据</div>;
  }
  if (env.edit) {
    if (data.mode === 'inline') {
      return (
        <div>
          <Menu
            onClick={onClick}
            mode={mode}
            selectedKeys={selectedKey}
            size="small"
            defaultOpenKeys={openKeys}
            openKeys={openKeys}
          >
            {renderMenuItems(dataSource)}
          </Menu>
        </div>
      );
    } else {
      return (
        <div>
          <Menu
            onClick={onClick}
            mode={mode}
            selectedKeys={selectedKey}
            size="small"
            className={css.overflow}
          >
            {renderMenuItems(dataSource)}
          </Menu>
        </div>
      );
    }
  }
  return (
    <div>
      <Menu onClick={onClick} mode={mode} selectedKeys={selectedKey} size="small">
        {renderMenuItems(dataSource)}
      </Menu>
    </div>
  );
}
