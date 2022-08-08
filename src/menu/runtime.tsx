import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import {
  Data,
  InputIds,
  MenuItem,
  OutputIds,
  findMenuItem,
  uuid,
  MenuTypeEnum
} from './constants';
import css from './style.less';

export default function ({ env, data, outputs, inputs }: RuntimeParams<Data>) {
  const { dataSource, mode } = data;
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const formatDataSource = (ds: MenuItem[], toJson?: boolean): MenuItem[] => {
    return ds.map((item) => {
      const { title, key, children, value } = item || {};
      const menuKey = key || uuid();
      let val = value;
      if (toJson && value) {
        try {
          val = JSON.parse(decodeURIComponent(value));
        } catch (e) {}
      }
      return {
        ...item,
        title: env.i18n(title),
        value: val,
        key: menuKey,
        children: Array.isArray(children)
          ? formatDataSource(children)
          : undefined
      };
    });
  };
  const setSelectedKeysByData = (ds: MenuItem[], val: string) => {
    if (val && typeof val === 'string') {
      const temp = findMenuItem(ds, val);
      if (temp?.key) {
        setSelectedKeys([temp.key]);
      } else {
        setSelectedKeys([val]);
      }
    }
  };

  useEffect(() => {
    const tempData = formatDataSource(dataSource, true);
    setMenuData(tempData);
    const defaultActiveItem = tempData.find((item) => item.defaultActive);
    if (defaultActiveItem?.key) {
      setSelectedKeys([defaultActiveItem.key]);
    }
  }, [dataSource]);
  useEffect(() => {
    if (env.runtime) {
      inputs[InputIds.SetActiveItem]((val) => {
        setSelectedKeysByData(menuData, val);
      });
      inputs[InputIds.SetMenuData]((ds) => {
        const { dataSource, defaultActive } = ds || {};
        if (Array.isArray(dataSource)) {
          const tempData = formatDataSource(dataSource);
          setMenuData(tempData);
          setSelectedKeysByData(tempData, defaultActive);
        }
      });
      inputs[InputIds.GetActiveItem]((val, relOutputs) => {
        const temp = findMenuItem(menuData, selectedKeys[0]);
        relOutputs[OutputIds.GetActiveItem](temp);
      });
    }
  }, [menuData, selectedKeys]);

  const onClick = (e) => {
    const clickItem = findMenuItem(menuData, e.key);
    setSelectedKeys([e.key]);
    if (env.runtime) {
      outputs[OutputIds.ClickMenu](clickItem);
    }
  };

  const renderMenuItems = (ds: MenuItem[]) => {
    return (ds || []).map((item) => {
      const { key, children, menuType, title } = item || {};
      if (menuType === MenuTypeEnum.Group) {
        return (
          <div data-menu-item={key} key={key}>
            <Menu.ItemGroup title={title} key={key}>
              {renderMenuItems(children)}
            </Menu.ItemGroup>
          </div>
        );
      }
      if (menuType === MenuTypeEnum.SubMenu) {
        return (
          <Menu.SubMenu title={title} key={key} data-menu-item={key}>
            {renderMenuItems(children)}
          </Menu.SubMenu>
        );
      }
      return (
        <Menu.Item key={key} data-menu-item={key}>
          {title}
        </Menu.Item>
      );
    });
  };

  if (!menuData.length && env.edit) {
    return <div className={css.suggestion}>无静态数据</div>;
  }
  return (
    <Menu
      onClick={onClick}
      mode={mode}
      size="small"
      selectedKeys={selectedKeys}
    >
      {renderMenuItems(menuData)}
    </Menu>
  );
}
