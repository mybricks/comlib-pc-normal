import React from 'react';
import { Menu, Dropdown } from 'antd';
import { Data } from './types';

export default function ({ data, env, style, inputs, outputs, slots }: RuntimeParams<Data>) {
  /*menu数据的渲染*/
  function menuRender({ data }: { data: Data }) {
    return (
      <Menu style={{ width: data.width }}>
        {data.options &&
          data.options.map((option, index) => {
            return (
              <Menu.Item disabled={option.disabled} key={index} onClick={() => onClick(option)}>
                <a target="_blank" href={option.value ? option.value : void 0}>
                  {option.label}
                </a>
              </Menu.Item>
            );
          })}
      </Menu>
    );
  }
  // 选项改变
  const onClick = (option) => {
    outputs['onChange']({
      disabled: option.disabled,
      label: option.label,
      value: option.value
    });
  };
  if (env.runtime) {
    return (
      <div>
        <Dropdown overlay={menuRender({ data })} placement={data.placement} arrow>
          <div>{slots['carrier'] && slots['carrier'].render()}</div>
        </Dropdown>
      </div>
    );
  } else {
    return (
      <div>
        <div>{slots['carrier'] && slots['carrier'].render()}</div>
      </div>
    );
  }
}
