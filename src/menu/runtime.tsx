import React, { useEffect, useState, ReactNode } from 'react';
import { Menu } from 'antd';
import { Data, InputIds, MenuItem, OutputIds, findMenuItem, uuid, MenuTypeEnum } from './constants';
import * as Icons from '@ant-design/icons';

import css from './style.less';

export default function ({ env, data, outputs, inputs }: RuntimeParams<Data>) {
  const { dataSource, mode } = data;
  const [menuData, setMenuData] = useState<MenuItem[]>([...dataSource]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [isSet, setIsSet] = useState<boolean>(false);

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
        children: Array.isArray(children) ? formatDataSource(children) : undefined
      };
    });
  };

  const findSelectkeys = (ds: MenuItem[]) => {
    //对整体数据做一个筛选，选出第一个defaultActive为true的key
    let keys = [];
    for (let i = 0; i < ds.length; i++) {
      //1.全是子菜单
      if (ds[i].menuType === MenuTypeEnum.Menu && ds[i].defaultActive === true) {
        keys.push(ds[i].key);
        //2. 父菜单
      } else if (ds[i].menuType === MenuTypeEnum.SubMenu && ds[i].children !== undefined) {
        for (let j = 0; j < ds[i].children?.length; j++) {
          let item = ds[i].children[j];
          //2（1）子菜单
          if (item.menuType === MenuTypeEnum.Menu && item.defaultActive === true) {
            keys.push(item.key);
            //2（1）分组菜单
          } else if (item.menuType === MenuTypeEnum.Group && item.children !== undefined) {
            for (let t = 0; t < item.children.length; t++) {
              if (
                item.children[t].menuType === MenuTypeEnum.Menu &&
                item.children[t].defaultActive === true
              ) {
                keys.push(item.children[t].key);
              }
            }
          }
        }
      }
    }
    return keys;
  };

  //找出所有可以defaultActive为true的item
  const findItems = (ds: MenuItem[]): MenuItem[] => {
    let items: MenuItem[] = [];
    for (let i = 0; i < ds.length; i++) {
      if (ds[i].menuType === MenuTypeEnum.Menu) {
        items.push(ds[i]);
      } else if (ds[i].menuType === MenuTypeEnum.SubMenu && ds[i].children !== undefined) {
        for (let j = 0; j < ds[i].children?.length; j++) {
          let item = ds[i].children[j];
          //（1）子菜单
          if (item.menuType === MenuTypeEnum.Menu) {
            items.push(item);
            //（1）分组菜单
          } else if (item.menuType === MenuTypeEnum.Group && item.children !== undefined) {
            for (let t = 0; t < item.children.length; t++) {
              if (item.children[t].menuType === MenuTypeEnum.Menu) {
                items.push(item.children[t]);
              }
            }
          }
        }
      }
    }
    return items;
  };

  useEffect(() => {
    const tempData = formatDataSource(dataSource, true);
    setMenuData(tempData);
    //没有输入设置时的默认激活的key
    if (findSelectkeys(tempData).length === 0) {
      setSelectedKeys([]);
    } else {
      setSelectedKeys([findSelectkeys(tempData)[0]]);
    }
  }, [dataSource]);

  useEffect(() => {
    if (env.runtime) {
      //设置选中项
      inputs[InputIds.SetActiveItem]((val) => {
        const items = findItems(menuData);
        const keys = items.map((item) => {
          return {
            key: item.key,
            _key: item._key
          };
        });
        const selectItem = keys.find((k) => k._key === val);
        //有输入时的key
        if (selectItem) {
          setSelectedKeys([selectItem.key]);
        }
      });
      //设置数据
      inputs[InputIds.SetMenuData]((ds) => {
        const { dataSource, defaultActive } = ds || {};
        if (Array.isArray(dataSource)) {
          dataSource.forEach((item) => {
            const key = item.key || uuid();
            item.key = key;
            item._key = key;
          });
          const tempData = formatDataSource(dataSource);
          setMenuData(tempData);
          setIsSet(true);
          const items = findItems(tempData);
          const keys = items.map((item) => item.key);
          if (keys.indexOf(defaultActive) !== -1) {
            setSelectedKeys([defaultActive]);
          }
        }
      });
    }
  }, [menuData, selectedKeys]);

  const onClick = (e) => {
    const clickItem = findMenuItem(menuData, e.key);
    setSelectedKeys([e.key]);
    const { key, _key, ...res } = clickItem;
    if (env.runtime) {
      outputs[OutputIds.ClickMenu]({
        ...res,
        key: _key
      });
    }
  };

  //获取选中值
  inputs[InputIds.GetActiveItem]((val, relOutputs) => {
    const temp = findMenuItem(menuData, selectedKeys[0]);
    const { key, _key, ...res } = temp || {};
    relOutputs[OutputIds.GetActiveItem]({
      ...res,
      key: _key
    });
  });

  //子菜单的点击事件
  const menuOnClick = (e) => {
    const clickItem = findMenuItem(menuData, e.key);
    const { key, _key, ...res } = clickItem;
    if (env.runtime && key && !isSet) {
      outputs[key]({
        ...res,
        key: _key
      });
    }
  };

  //选择图标样式
  const chooseIcon = ({ icon }: { icon: ReactNode }) => {
    const Icon = Icons && Icons[icon as string]?.render();
    return <>{Icon}</>;
  };

  const renderMenuItems = (ds: MenuItem[]) => {
    return (ds || []).map((item) => {
      const { key, children, menuType, title, icon, showIcon } = item || {};
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
            icon={showIcon ? chooseIcon({ icon: icon }) : null}
          >
            {renderMenuItems(children)}
          </Menu.SubMenu>
        );
      }
      //最后的子菜单
      return (
        <Menu.Item
          onClick={menuOnClick}
          key={key}
          data-menu-item={key}
          icon={showIcon ? chooseIcon({ icon: icon }) : null}
        >
          {title}
        </Menu.Item>
      );
    });
  };

  if (!menuData.length && env.edit) {
    return <div className={css.suggestion}>无静态数据</div>;
  }
  return (
    <Menu onClick={onClick} mode={mode} size="small" selectedKeys={selectedKeys}>
      {renderMenuItems(menuData)}
    </Menu>
  );
}
