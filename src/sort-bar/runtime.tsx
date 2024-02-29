import React, { useEffect, useState } from 'react';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import css from './runtime.less';

export interface Children {
  key: string;
  content: string;
  fieldName: string;
  order: 'disorder' | 'ascend' | 'descend';
}

/**
 * *数据源
 *@param children 排序组件分配的数组
 *@param isSettingsSubmit 主动输出整体数据
 */

export interface Data {
  children: Children[];
  isSettingsSubmit: boolean;
}

export default function ({ env, data, outputs, inputs }: RuntimeParams<Data>) {
  //整体输入
  useEffect(() => {
    if (env.runtime) {
      inputs['inputSettings']((val, outputRels) => {
        data.children = val;
        outputRels['inputSettingsDone'](val);
      });
    }
  }, []);

  //点击改变升降序函数
  const onClick = (e) => {
    if (e.order === 'disorder') {
      e.order = 'ascend';
    } else if (e.order === 'ascend') {
      e.order = 'descend';
    } else if (e.order === 'descend') {
      e.order = 'disorder';
    }

    //点击触发整体输出
    if (env.runtime && outputs) {
      if (outputs['settingsSubmit']) {
        outputs['settingsSubmit']({
          //当前点击项数据
          current: {
            content: e.content,
            filedName: e.fieldName,
            order: e.order
          },
          //全量排序数据
          sorter: data.children.map((val) => {
            return {
              content: val.content,
              filedName: val.fieldName,
              order: val.order
            };
          })
        });
      }
    }
  };

  //可决定主动提交，整体输出
  useEffect(() => {
    if (env.runtime && outputs) {
      if (data.isSettingsSubmit) {
        outputs['settingsSubmit']({
          //当前点击项数据
          current: {},
          //全量排序数据
          sorter: data.children.map((val) => {
            return {
              content: val.content,
              filedName: val.fieldName,
              order: val.order
            };
          })
        });
      }
    }
  }, []);

  const SortRender = () => {
    //点击改变升降序函数，输出函数
    return (
      <div>
        {data.children.map((list) => {
          return (
            <div
              onClick={() => onClick(list)}
              className={css.outer}
              data-sort={list.key}
              key={list.key}
            >
              <div className={css.inner}>
                <div className={css.content}>{env.i18n(list.content)}</div>
                <div className={css.arr}>
                  <CaretUpOutlined
                    className={
                      list.order === 'ascend' ? `${css.arrUp} ${css.active}` : `${css.arrUp}`
                    }
                  />
                  <CaretDownOutlined
                    className={
                      list.order === 'descend' ? `${css.arrDown} ${css.active}` : `${css.arrUp}`
                    }
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      {data.children?.length ? (
        <div>
          <SortRender />
        </div>
      ) : (
        <p className={css.suggestion}>在编辑栏中点击“添加”</p>
      )}
    </div>
  );
}
