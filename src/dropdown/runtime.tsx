import React, { useEffect, useMemo } from 'react';
import { Menu, Dropdown, Space, Empty } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Data } from './types';
import * as Icons from '@ant-design/icons';
import { uuid } from '../utils';

export default function ({ data, env, style, inputs, outputs, slots, id }: RuntimeParams<Data>) {
  const { edit, runtime } = env;
  const debug = !!(runtime && runtime.debug);
  const rowKey = '_itemKey';


  //设置数据源输入
  useEffect(() => {
    if (env.runtime) {
      inputs['setDynamicOptions']((v, relOutputs) => {
        if (Array.isArray(v)) {
          const ds = v.map((item,index)=>{
            if(item.value){
              return {
                value: item.value,
                disabled: item.disabled ? true: false,
                [rowKey]: uuid(),
                index: index
              }
            }else{
              return {
                value: item,
                [rowKey]: uuid(),
                index: index
              }
            }
          })
          data.dynamicOptions = ds;
          relOutputs['setDynamicOptionsDone'](v);
        }
      });
    }
  }, []);

  /*menu数据的渲染*/
  function dynamicMenuRender({ data }: { data: Data }){
    if(env.edit){
      return (
        <Menu style={{ width: data.width }}>
          <Menu.Item>
            {
              slots['item'].render()
            }
          </Menu.Item>          
        </Menu>
      )
    }else if(env.runtime){
      if(Array.isArray(data.dynamicOptions) && data.dynamicOptions.length > 0){
        return (
          <Menu style={{ width: data.width }}>
            {data.dynamicOptions &&
              data.dynamicOptions.map((option, index) => {
                return (
                  <Menu.Item
                    data-menu-item={option[rowKey]}
                    disabled={option.disabled}
                    //style={{ color: option.disabled ? void 0 : option.iconColor }}
                    key={index}
                    onClick={() => onClick(option)}
                  >
                    {
                      slots['item'].render(
                        {
                          inputValues: {
                            itemData: option.value,
                            index: index
                          },
                          key: option[rowKey]
                        }
                      )
                    }
                  </Menu.Item>
                );
              })}
          </Menu>
        );
      }else{
        return (
          <Empty></Empty>
        )
      }
      
    }
  }
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
                  {env.i18n(option.label)}
                </a>
              </Menu.Item>
            );
          })}
      </Menu>
    );
  }

  // 选项改变
  const onClick = (option) => {
    if(data.isDynamic){
      outputs['onChange'](
        option
      )
    }else{
      outputs['onChange']({
        label: option.label,
        link: option.link,
        key: option.key
      });
    }
  };

  return (
    <div>
      <Dropdown
        overlayClassName={id}
        overlay={data.isDynamic ? dynamicMenuRender({data}) : menuRender({ data })}
        placement={data.placement}
        arrow
        visible={(edit && data.isChildCustom) || env.design || (edit && data.isDynamic) ? true : edit ? false : void 0}
        getPopupContainer={(triggerNode: HTMLElement) => env?.canvasElement || document.body}
        overlayStyle={{ minWidth: data.width }}
        trigger={[data.trigger || 'hover']}
      >
        {data.isCustom === false ? (
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              {env.i18n(data.content)}
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
