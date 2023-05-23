import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { Data, InputIds, MenuItem, OutputIds, findMenuItem, uuid, MenuTypeEnum } from './constants';
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

  //找出所有可以defaultActive为true的key
  const findKeys = (ds: MenuItem[]) => {
    let keys = [];
    for (let i = 0; i < ds.length; i++) {
      if (ds[i].menuType === MenuTypeEnum.Menu) {
        keys.push(ds[i].key);
      } else if (ds[i].menuType === MenuTypeEnum.SubMenu && ds[i].children !== undefined) {
        for (let j = 0; j < ds[i].children?.length; j++) {
          let item = ds[i].children[j];
          //（1）子菜单
          if (item.menuType === MenuTypeEnum.Menu) {
            keys.push(item.key);
            //（1）分组菜单
          } else if (item.menuType === MenuTypeEnum.Group && item.children !== undefined) {
            for (let t = 0; t < item.children.length; t++) {
              if (item.children[t].menuType === MenuTypeEnum.Menu) {
                keys.push(item.children[t].key);
              }
            }
          }
        }
      }
    }
    return keys;
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
        const tempData = formatDataSource(dataSource);
        const keys = findKeys(tempData);
        //有输入时的key
        if (keys.indexOf(val) !== -1) {
          setSelectedKeys([val]);
        }
      });
      //设置数据
      inputs[InputIds.SetMenuData]((ds) => {
        const { dataSource, defaultActive } = ds || {};
        if (Array.isArray(dataSource)) {
          const tempData = formatDataSource(dataSource);
          setMenuData(tempData);
          setIsSet(true);
          const keys = findKeys(tempData);
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
    if (env.runtime && !isSet) {
      outputs[OutputIds.ClickMenu](clickItem);
    }
  };

  //获取选中值
  inputs[InputIds.GetActiveItem]((val, relOutputs) => {
    const temp = findMenuItem(menuData, selectedKeys[0]);
    relOutputs[OutputIds.GetActiveItem](temp);
  });

  //子菜单的点击事件
  const menuOnClick = (e) => {
    const clickItem = findMenuItem(menuData, e.key);
    if (env.runtime && !isSet) {
      outputs[e.key](clickItem);
    }
  };

  const renderMenuItems = (ds: MenuItem[]) => {
    return (ds || []).map((item) => {
      const { key, children, menuType, title } = item || {};
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
          <Menu.SubMenu title={title} key={key} data-menu-item={key}>
            {renderMenuItems(children)}
          </Menu.SubMenu>
        );
      }
      //最后的子菜单
      return (
        <Menu.Item onClick={menuOnClick} key={key} data-menu-item={key}>
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
