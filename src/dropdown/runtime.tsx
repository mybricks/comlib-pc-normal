import React, { useMemo } from 'react';
import { Menu, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Data } from './types';
import * as Icons from '@ant-design/icons';

export default function ({ data, env, style, inputs, outputs, slots, id }: RuntimeParams<Data>) {
  const { edit, runtime } = env;
  const debug = !!(runtime && runtime.debug);
  /*menu数据的渲染*/
  function menuRender({ data }: { data: Data }) {
    return (
      <Menu style={{ width: data.width }}>
        {data.options &&
          data.options.map((option, index) => {
            const Icon = Icons && Icons[option.icon as string]?.render();
            return (
              <Menu.Item
                data-menu-item={option.key}
                disabled={option.disabled}
                //style={{ color: option.disabled ? void 0 : option.iconColor }}
                key={index}
                onClick={() => onClick(option)}
              >
                <a target="_blank" href={option.value ? option.value : void 0}>
                  <span
                    style={{
                      display: !option.useIcon ? 'none' : void 0,
                      marginRight: '8px'
                    }}
                  >
                    {Icon}
                  </span>
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
      label: option.label,
      link: option.link,
      key: option.key
    });
  };

  return (
    <div>
      <Dropdown
        overlayClassName={id}
        overlay={menuRender({ data })}
        placement={data.placement}
        arrow
        visible={(edit && data.isChildCustom) || env.design ? true : edit ? false : void 0}
        getPopupContainer={(triggerNode: HTMLElement) =>
          edit ? triggerNode : debug ? env?.canvasElement : env.container || document.body
        }
        overlayStyle={{ minWidth: data.width }}
        trigger={[data.trigger || 'hover']}
      >
        {data.isCustom === false ? (
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              {data.content}
              <DownOutlined />
            </Space>
          </a>
        ) : (
          <div>{slots['carrier'] && slots['carrier'].render()}</div>
        )}
      </Dropdown>
    </div>
  );
}
