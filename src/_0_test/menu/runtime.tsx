import {useCallback} from "react";
import { Menu } from 'antd';

export default function ({env, data, inputs, outputs}) {
  return (
    <div>
      <Menu
        mode="horizontal"
        size="small">
        <Menu.Item
          key={'menu1'}
          data-menu-item={'menu1'}
        >
          {'菜单1'}
        </Menu.Item>
      </Menu>
    </div>
  )
}