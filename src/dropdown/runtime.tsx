import React, { useEffect, useMemo, useState } from 'react';
import { Menu, Dropdown, Space, Empty } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Data } from './types';
import * as Icons from '@ant-design/icons';
import { uuid, handleOutputFn } from '../utils';
import { InputIds, OutputIds } from './constants';

export default function ({ data, env, style, inputs, outputs, slots, id }: RuntimeParams<Data>) {
  const { edit, runtime } = env;
  const debug = !!(runtime && runtime.debug);
  const rowKey = '_itemKey';
  const [visible, setVisible] = useState({});

  //阻止冒泡函数
  const onBubbleClick = (e) => {
    //e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  // 动态修改选项
  function updateObjectsInArray<T>(sourceArray: T[], updateArray: T[]): T[] {
    const keys = 'key';

    const updateMap = new Map<string, T>();
    updateArray.forEach((updateObj) => {
      const identifier = updateObj[keys];
      updateMap.set(identifier, updateObj);
    });

    return sourceArray.map((sourceObj) => {
      const identifier = sourceObj[keys];
      const updateObj = updateMap.get(identifier);
      if (updateObj) {
        // 以旧的为底，新增的属性覆盖下
        return { ...sourceObj, ...updateObj };
      }
      return sourceObj;
    });
  }

  //设置数据源输入
  useEffect(() => {
    if (env.runtime) {
      inputs[InputIds.SetDynamicOptions]((v, relOutputs) => {
        if (Array.isArray(v)) {
          const ds = v.map((item, index) => {
            if (data.isItem || !item.value) {
              return {
                value: item,
                [rowKey]: uuid(),
                disabled: item.disabled ? true : false,
                index: index
              };
            } else {
              return {
                value: item.value,
                disabled: item.disabled ? true : false,
                [rowKey]: uuid(),
                index: index
              };
            }
          });
          data.dynamicOptions = ds;
          relOutputs[OutputIds.SetDynamicOptionsDone](v);
        }
      });
      inputs[InputIds.DynamicallyModifySubitems]((v: Data['options'], relOutputs) => {
        if (Array.isArray(v)) {
          if (!data.isDynamic) {
            const ds = updateObjectsInArray(data.options, v);
            handleOutputFn(relOutputs, outputs, OutputIds.DynamicallyModifySubitemsDone, ds);
            data.options = ds;
          }
        }
      });
    }
  }, []);

  /*menu数据的渲染*/
  function dynamicMenuRender({ data }: { data: Data }) {
    if (env.edit) {
      return (
        <Menu style={{ width: data.width }}>
          <Menu.Item>{slots['item']?.render()}</Menu.Item>
        </Menu>
      );
    } else if (env.runtime) {
      if (Array.isArray(data.dynamicOptions) && data.dynamicOptions.length > 0) {
        return (
          <Menu style={{ width: data.width }}>
            {data.dynamicOptions &&
              data.dynamicOptions.map((option, index) => {
                return (
                  <div onClick={data.eventBubble ? onBubbleClick : void 0}>
                    <Menu.Item
                      data-menu-item={option[rowKey]}
                      disabled={option.disabled}
                      //style={{ color: option.disabled ? void 0 : option.iconColor }}
                      key={index}
                      onClick={() => onClick({value: option.value, disabled: option.disabled})}
                    >
                      {slots['item']?.render({
                        inputValues: {
                          itemData: option.value,
                          index: index
                        },
                        key: option[rowKey]
                      })}
                    </Menu.Item>
                  </div>
                );
              })}
          </Menu>
        );
      } else {
        return (
          <Menu>
            <Menu.Item>
              <Empty></Empty>
            </Menu.Item>
          </Menu>
        );
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
              <div onClick={data.eventBubble ? onBubbleClick : void 0}>
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
              </div>
            );
          })}
      </Menu>
    );
  }

  // 选项改变
  const onClick = (option) => {
    if (data.isDynamic) {
      outputs['onChange'](option);
    } else {
      outputs['onChange']({
        label: option.label,
        link: option.link,
        key: option.key
      });
    }
  };

  useEffect(() => {
    if ((edit && data.isChildCustom) || env.design || (edit && data.isDynamic)) {
      setVisible({
        visible: true
      });
    } else {
      if (env.edit) {
        setVisible({
          visible: false
        });
      } else {
        setVisible({});
      }
    }
  }, [env, data.isChildCustom, data.isDynamic]);

  return (
    <div className="dropdown" onClick={data.contentBubble ? onBubbleClick : void 0}>
      <Dropdown
        overlayClassName={id}
        overlay={data.isDynamic ? dynamicMenuRender({ data }) : menuRender({ data })}
        placement={data.placement}
        arrow
        {...visible}
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
          <div>{slots['carrier']?.render()}</div>
        )}
      </Dropdown>
    </div>
  );
}
